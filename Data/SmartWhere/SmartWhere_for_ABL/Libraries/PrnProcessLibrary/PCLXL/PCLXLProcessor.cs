namespace FXKIS.PDL.Process
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.IO;
    using System.Text;

    using Data;
    using Exceptions;

    using SmartWhere.CommonIF;
    using SmartWhere.Metadata;
    using SmartWhere.Policy;

    using Image;
    using System.Linq;

    public class PCLXLProcessor
    {
        #region Enumerations

        public enum ProcessOperatingType
        {
            Unknown,
            ToNext,
            ToPhysicalPageStart,
            ToPhysicalPageEnd,
            ToLogicalPageStart,
            ToLogicalPageEnd,
            ToNextPage,
            ToEndSession,
            ToSpecifiedOffset,
            ToColor,
            ToAngle,
            ToOrientation,
            ToOrigin,
            ToScale,
            ToFont,
            ToMasking,
            ToInsertImage,
            SetRop
        }

        #endregion Enumerations



        #region Constants

        public const ImageProcessing.ImageExtensionType ImageProcessingExtension = ImageProcessing.ImageExtensionType.JPEG;

        #endregion Constants



        #region Properties :: Stream

        private Stream PrnStream { get; set; }
        private Stream[] OutputStreams { get; set; }

        #endregion Properties :: Stream



        #region Properties :: Data

        private PrnMetadata Metadata { get; set; }
        private PrintJobData JobData { get; set; }

        #endregion Properties :: Data



        #region Properties :: Used for Processing

        private ImageProcessor ImageProcessor { get; set; }
        private string PathFontDirectory { get; set; }
        private string PathWatermarkImageDirectory { get; set; }
        private string PathImageProcessingDirectory { get; set; }
        private bool HasPageAngle { get; set; }
        private PCLXLHeader.PCLXLBindingFormatType HeaderBindingFormat { get; set; }

        private bool IncreasedCharacterCode { get; set; }
        private bool IncreasedTextData { get; set; }

        private int CurrentPageNumber { get; set; }
        private PageInformation CurrentPage
        {
            get
            {
                if (this.Metadata == null || this.Metadata.PageDictionary == null || this.Metadata.PageDictionary.ContainsKey(this.CurrentPageNumber) == false)
                {
                    return null;
                }

                return this.Metadata.PageDictionary[this.CurrentPageNumber];
            }
        }
        private MaskingInformation CurrentMaskingInfo
        {
            get
            {
                if (this.CurrentPage == null || this.CurrentPage.MaskingInfoList == null || this.CurrentPage.MaskingInfoList.Count < 1)
                {
                    return null;
                }

                if (this.CurrentPage.MaskingInfoList.Count <= idxFontInfo)
                {
                    return null;
                }

                return this.CurrentPage.MaskingInfoList[idxFontInfo];
            }
        }

        private Dictionary<string, MaskingFontData> DictionaryMaskingFontData { get; set; }

        #endregion Properties :: Used for Processing



        #region Variables :: Used for Processing

        private int idxFontInfo = -1;
        private int idxTextData = -1;
        private List<MaskingTextData> listTextData = null;

        private bool IsColorJob = false;
        private byte[] SetData = new byte[15];
        private byte? UpdateColorSpace = null;

        private byte? UpdateRop = null;
        public bool IsUpdate = false;

        byte[] Fxsr = { 0x46, 0x58, 0x53, 0x52, 0x3d }; //  C8 C0 07 46 58 53 52 3D 30 30 F8 81 47  = Comment(“FXSR=00”) 

        #endregion Variables :: Used for Processing



        #region Constructors

        public PCLXLProcessor(Stream prnStream, Stream[] arrOutputStream, PrnMetadata metadata, PrintJobData jobData, string pathFontDir, string pathWatermarkImageDir, string pathImageProcessingDir)
        {
            if (prnStream == null)
            {
                throw new ArgumentNullException("Stream prnStream");
            }

            if (arrOutputStream == null || arrOutputStream.Length < 1)
            {
                throw new ArgumentNullException("Stream[] arrOutputStream");
            }

            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (jobData == null)
            {
                throw new ArgumentNullException("PrintJobData jobData");
            }

            if (string.IsNullOrWhiteSpace(pathFontDir) == true)
            {
                throw new ArgumentNullException("string pathFontDir");
            }

            if (string.IsNullOrWhiteSpace(pathWatermarkImageDir) == true)
            {
                throw new ArgumentNullException("string pathWatermarkImageDir");
            }

            if (string.IsNullOrWhiteSpace(pathImageProcessingDir) == true)
            {
                throw new ArgumentNullException("string pathImageProcessingDir");
            }

            this.PrnStream = prnStream;
            this.OutputStreams = arrOutputStream;
            this.Metadata = metadata;
            this.JobData = jobData;

            this.PathFontDirectory = pathFontDir;
            this.PathWatermarkImageDirectory = pathWatermarkImageDir;
            this.PathImageProcessingDirectory = pathImageProcessingDir;
            this.CurrentPageNumber = 0;
            this.HasPageAngle = false;
            this.HeaderBindingFormat = PCLXLHeader.PCLXLBindingFormatType.None;

            this.IncreasedCharacterCode = false;
            this.IncreasedTextData = false;

            this.DictionaryMaskingFontData = new Dictionary<string, MaskingFontData>();

            this.ImageProcessor = new ImageProcessor(this.Metadata, PCLXLProcessor.ImageProcessingExtension, this.PathWatermarkImageDirectory, this.PathImageProcessingDirectory);
        }

        #endregion Constructors



        #region Methods :: Load

        public PrnBuffer Process(PrnBuffer buffer, PrnDocument doc, bool hasWatermark, bool isMasking = false)
        {
            if (buffer == null)
            {
                throw new ArgumentNullException("PrnBuffer buffer");
            }

            PCLXLAttributeItem.AttributeValueTagType valueTag;

            buffer.ReaderMode = PrnBuffer.PrnReaderMode.PCLXL;
            buffer.Offset = 0;

            if (buffer.IsReadPCLXLHeader == false || buffer.IsReadPCLXLHeaderLF == false)
            {
                this.LoadPCLXLHeader(buffer, doc, this.PrnStream.Position);

                buffer.ReaderMode = PrnBuffer.PrnReaderMode.PCLXL;
                return buffer;
            }

            if (buffer.IsReadPCLXLHeader == true && buffer.IsReadPCLXLHeaderLF == true && this.CurrentPageNumber < 1)
            {
                byte[] binaryHeader = doc.PCLXL.Header.GetBinaryOrigin();

                if (binaryHeader == null || binaryHeader.Length < 1)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLHeaderParsingError);
                }

                this.OutputStreams.WriteBinary(binaryHeader);

                this.CurrentPageNumber = 1;
            }

            ///////////////////////////////////////////////////////////////////////////////////



            ProcessOperatingType operating = ProcessOperatingType.ToPhysicalPageStart;

            List<PCLXLItem> listAddedItem = null;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            long offsetSpecified = -1;

            int nup = this.JobData.Nup;

            MaskingFontData currentFont = null;

            ///////////////////////////////////////////////////////////////////////////////////
            // LOOP for Spool parsing
            ///////////////////////////////////////////////////////////////////////////////////

            while (buffer.Offset < buffer.Length)
            {
                if (buffer.IsTerminate == true)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.Terminated);
                }

                if (buffer.Length < 1)
                {
                    buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL, false);
                }

                if (buffer.ReaderMode == PrnBuffer.PrnReaderMode.PJL)
                {
                    return buffer;
                }

                fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

                ///////////////////////////////////////////////////////////////////////////////////
                // PCL-XL 가공 부분
                ///////////////////////////////////////////////////////////////////////////////////

                long diff = -1;

                switch (operating)
                {
                    ////////////////////////////////////////////////////////////////////

                    case ProcessOperatingType.ToPhysicalPageStart:
                        {
                            // N-UP 처리
                            if (PageInformation.IsAbstractedPageStartByNup(this.Metadata.PrnInfo.TotalPages, this.CurrentPageNumber, nup) == true)
                            {
                                diff = this.CurrentPage.OffsetInfo.StartLogical - fileOffset;

                                if (diff >= 0)
                                {
                                    buffer = buffer.SkipBuffer(this.PrnStream, (int)diff);
                                }

                                operating = ProcessOperatingType.ToLogicalPageStart;
                                continue;
                            }

                            // SKIP to Physical PageStart of Current Page
                            offsetSpecified = this.CurrentPage.OffsetInfo.StartPhysical;

                            operating = ProcessOperatingType.ToOrientation;
                        }
                        break;

                    case ProcessOperatingType.ToLogicalPageStart:
                        {
                            long colorSpace = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.ColorSpace);
                            if (colorSpace != -1)
                            {
                                this.UpdateColorSpace = this.CurrentPage.ColorSpaceValue;
                            }


                            if (listAddedItem == null)
                            {
                                listAddedItem = new List<PCLXLItem>();
                            }
                            // SKIP to Logical PageStart of Current Page
                            offsetSpecified = this.CurrentPage.OffsetInfo.StartLogical;

                            idxFontInfo = 0;
                            idxTextData = 0;

                            this.IncreasedCharacterCode = false;
                            this.IncreasedTextData = false;

                            operating = ProcessOperatingType.ToOrigin;


                            if (this.CurrentPage.HasPhysicalStart == true)
                            {
                                this.IsUpdate = false;
                                this.UpdateRop = null;
                            }

                            //// TODO :: E1 결함 #5068 해당사항 대응
                            // 삽입 위치 
                            if (this.CurrentPage.HasPhysicalStart == false)
                            {
                                offsetSpecified = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.FXSR) + 13;

                                byte ropData = SetData[1];



                                long rop3 = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.ROP3);

                                long fxsr = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.FXSR);

                                if (rop3 - 13 == fxsr || rop3 - 14 == fxsr)
                                {
                                    if (this.CurrentPage.RopValue != 0)
                                    {
                                        this.UpdateRop = this.CurrentPage.RopValue;
                                        this.IsUpdate = true;

                                        Console.WriteLine(string.Format("page {0}, rop value {1}", this.CurrentPageNumber, this.UpdateRop));
                                        break;
                                    }
                                }

                                if (this.UpdateRop != null)
                                {
                                    ropData = (byte)this.UpdateRop;
                                }
                                PCLXLAttributeItem attr = null;
                                PCLXLOperatorItem oper = null;

                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = SetData[3],
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { ropData }
                                };

                                listAddedItem.Add(attr);

                                oper = new PCLXLOperatorItem()
                                {
                                    Operator = SetData[4],
                                    EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
                                };

                                listAddedItem.Add(oper);


                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = SetData[8],
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { SetData[6] }
                                };

                                listAddedItem.Add(attr);

                                oper = new PCLXLOperatorItem()
                                {
                                    Operator = SetData[9],
                                    EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
                                };

                                listAddedItem.Add(oper);

                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = SetData[13],
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { SetData[11] }
                                };

                                listAddedItem.Add(attr);

                                oper = new PCLXLOperatorItem()
                                {
                                    Operator = SetData[14],
                                    EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
                                };

                                listAddedItem.Add(oper);
                            }
                            //////////////////////////////////////////////////////////////
                        }
                        break;

                    case ProcessOperatingType.ToLogicalPageEnd:
                        {
                            if (this.CurrentPage.HasPhysicalEnd == false)
                            {
                                operating = ProcessOperatingType.ToNextPage;
                                continue;
                            }

                            // SKIP to Specified Offset
                            diff = this.CurrentPage.OffsetInfo.EndPhysical - fileOffset;

                            buffer = buffer.SkipBuffer(this.PrnStream, (int)diff, this.OutputStreams);

                            operating = ProcessOperatingType.ToPhysicalPageEnd;
                        }
                        continue;

                    case ProcessOperatingType.ToPhysicalPageEnd:
                        {
                            bool isAbstracted = PageInformation.IsAbstractedPageEndByNup(this.Metadata.PrnInfo.TotalPages, this.CurrentPageNumber, nup);

                            if (isAbstracted == false)
                            {
                                operating = ProcessOperatingType.ToNextPage;
                                continue;
                            }

                            // N-UP 처리
                            this.CurrentPageNumber++;

                            // SKIP to Specified Offset
                            if (this.CurrentPage.HasPhysicalStart == true)
                            {
                                diff = this.CurrentPage.OffsetInfo.StartPhysical - fileOffset;

                                if (diff >= 0)
                                {
                                    buffer = buffer.SkipBuffer(this.PrnStream, (int)diff);

                                    fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;
                                }

                                operating = ProcessOperatingType.ToPhysicalPageStart;
                            }
                            else
                            {
                                diff = this.CurrentPage.OffsetInfo.StartLogical - fileOffset;

                                if (diff >= 0)
                                {
                                    buffer = buffer.SkipBuffer(this.PrnStream, (int)diff);

                                    fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;
                                }

                                operating = ProcessOperatingType.ToLogicalPageStart;
                            }
                        }
                        continue;

                    ////////////////////////////////////////////////////////////////////

                    case ProcessOperatingType.ToNextPage:
                        {
                            this.CurrentPageNumber++;

                            if (this.CurrentPage == null)
                            {
                                operating = ProcessOperatingType.ToEndSession;
                                continue;
                            }

                            // Jump to Page Start Offset
                            if (this.CurrentPage.HasPhysicalStart == true && fileOffset < this.CurrentPage.OffsetInfo.StartPhysical)
                            {
                                operating = ProcessOperatingType.ToPhysicalPageStart;
                            }
                            else if (this.CurrentPage.HasPhysicalStart == false && fileOffset < this.CurrentPage.OffsetInfo.StartLogical)
                            {
                                operating = ProcessOperatingType.ToLogicalPageStart;
                            }
                        }
                        continue;

                    ////////////////////////////////////////////////////////////////////

                    // [OFFSET about PAGE ORDER]
                    // - 1. COLOR (but processing part is Physical Page Start)
                    // - 2. ORIENTATION
                    // - 3. ORIGIN
                    // - 4. SCALE

                    case ProcessOperatingType.ToOrientation:
                        {
                            offsetSpecified = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.Orientation);

                            operating = ProcessOperatingType.ToLogicalPageStart;

                            if (offsetSpecified < 0)
                            {
                                continue;
                            }
                        }
                        break;

                    case ProcessOperatingType.ToOrigin:
                        {
                            offsetSpecified = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.Origin);

                            this.CurrentPage.SetResolution((ushort)this.Metadata.PrnInfo.Resoulution);

                            operating = ProcessOperatingType.ToScale;

                            if (offsetSpecified < 0)
                            {
                                continue;
                            }
                        }
                        break;

                    case ProcessOperatingType.ToScale:
                        {
                            offsetSpecified = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.Scale);

                            //operating = ProcessOperatingType.ToFont;
                            //2020-02-10 ADD by ParkSY
                            //특정 환경에서 Origin->Scale이 반복되는 현상에 대한 대응
                            if(this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.Origin, true) != -1)
                            {
                                operating = ProcessOperatingType.ToOrigin;
                            }

                            else
                            {
                                operating = ProcessOperatingType.SetRop;
                            }

                            if (offsetSpecified < 0)
                            {
                                continue;
                            }
                        }
                        break;

                    case ProcessOperatingType.SetRop:
                        {
                            offsetSpecified = this.CurrentPage.OffsetInfo.GetOffsetByType(PageOffsetInformation.PageOffsetType.ROP3);

                            operating = ProcessOperatingType.ToFont;

                            if (offsetSpecified < 0)
                            {
                                continue;
                            }
                        }
                        break;

                    case ProcessOperatingType.ToFont:
                        {
                            if (this.IncreasedCharacterCode == true)
                            {
                                break;
                            }

                            ///////////////////////////////////////////////////////////////

                            if (this.CurrentPage.MaskingInfoList == null || this.CurrentPage.MaskingInfoList.Count < 1)
                            {
                                operating = ProcessOperatingType.ToInsertImage;
                                continue;
                            }

                            if (this.CurrentPage.MaskingInfoList.Count <= idxFontInfo)
                            {
                                operating = ProcessOperatingType.ToInsertImage;
                                continue;
                            }

                            ///////////////////////////////////////////////////////////////

                            string fontName = this.CurrentMaskingInfo.Font.Name;

                            if (this.DictionaryMaskingFontData.ContainsKey(fontName) == true)
                            {
                                currentFont = this.DictionaryMaskingFontData[fontName];
                            }
                            else
                            {
                                // Load a Font Data
                                string dataFileName = this.CurrentMaskingInfo.Font.DataFileName;

                                if (Path.IsPathRooted(dataFileName) == false)
                                {
                                    dataFileName = Path.Combine(this.PathFontDirectory, dataFileName);
                                }

                                SmartWhere.CommonIF.FontInformation font = this.Metadata.GetFontInformation(fontName, dataFileName);

                                currentFont = new MaskingFontData(this.CurrentMaskingInfo.Font, font);

                                this.DictionaryMaskingFontData.Add(fontName, currentFont);
                            }

                            ///////////////////////////////////////////////////////////////

                            if (currentFont.PageSet.Contains(this.CurrentPageNumber) == true)
                            {
                                // ADD +1 CharCode, EndChar가 나올 때 까지 (0xFFFF는 제외)
                                this.IncreasedCharacterCode = true;
                            }
                            else
                            {
                                currentFont.PageSet.Add(this.CurrentPageNumber);

                                currentFont.AsteriskCharCode = this.CurrentMaskingInfo.Font.CharAttributeCount;
                                currentFont.Offset = this.CurrentMaskingInfo.Font.RangeOffset.End;

                                // Add Asterisk binary data
                                listAddedItem = PCLXLProcessor.CreateAsteriskItems(currentFont.Font.AsteriskBinary, currentFont.AsteriskCharCode);

                                // jump
                                offsetSpecified = currentFont.Offset;
                            }

                            idxTextData = 0;
                            listTextData = new List<MaskingTextData>(this.CurrentMaskingInfo.MaskingDictionary.Values);                           
                        }
                        break;

                    ////////////////////////////////////////////////////////////////////

                    case ProcessOperatingType.ToMasking:
                        {
                            if (this.IncreasedTextData == true)
                            {
                                break;
                            }

                            offsetSpecified = listTextData[idxTextData].Offset;

                            idxTextData++;

                            if (idxTextData >= listTextData.Count)
                            {
                                operating = ProcessOperatingType.ToFont;
                                continue;
                            }
                        }
                        break;

                    case ProcessOperatingType.ToInsertImage:
                        {
                            operating = ProcessOperatingType.ToLogicalPageEnd;

                            if (this.Metadata.Policy.HasImageProcessing == false)
                            {
                                continue;
                            }

                            if (hasWatermark == false)
                            {
                                continue;
                            }

                            // Add a Policy Image's binary data
                            listAddedItem = this.ImageProcessor.CreatePolicyImageItems(this.CurrentPageNumber, this.CurrentPage.PaperCode);


                            PCLXLAttributeItem attr = null;
                            PCLXLOperatorItem oper = null;


                            if (this.UpdateColorSpace == 0x02)
                            {
                                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                //<< Set Color Space >> := { "ColorSpace" }
                                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

                                //ATTRIBUTE::ColorSpace(0x03) - SingleUByte
                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x03,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { (byte)this.UpdateColorSpace }
                                };

                                listAddedItem.Add(attr);

                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x02,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { 0x02 }
                                };

                                listAddedItem.Add(attr);


                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x06,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.ArrayUByte,
                                    ArrayLengthTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF }
                                };

                                listAddedItem.Add(attr);


                                //OPERATOR::SetColorSpace(0x6A)
                                oper = new PCLXLOperatorItem()
                                {
                                    Operator = 0x6a,
                                    EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
                                };

                                listAddedItem.Add(oper);
                            }
                            else if (this.UpdateColorSpace == 0x01)
                            {///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                //<< Set Color Space >> := { "ColorSpace" }
                                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

                                //ATTRIBUTE::ColorSpace(0x03) - SingleUByte
                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x03,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { (byte)this.UpdateColorSpace }
                                };

                                listAddedItem.Add(attr);


                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x02,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { 0x02 }
                                };

                                listAddedItem.Add(attr);


                                attr = new PCLXLAttributeItem()
                                {
                                    Attribute = 0x06,
                                    Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                                    ValueTag = PCLXLAttributeItem.AttributeValueTagType.ArrayUByte,
                                    ArrayLengthTag = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                                    ValueByte = new byte[] { 0x00, 0xFF }
                                };

                                listAddedItem.Add(attr);


                                //OPERATOR::SetColorSpace(0x6A)
                                oper = new PCLXLOperatorItem()
                                {
                                    Operator = 0x6a,
                                    EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
                                };

                                listAddedItem.Add(oper);

                            }

                            // jump
                            offsetSpecified = this.CurrentPage.OffsetInfo.EndLogical;
                        }
                        break;

                    ////////////////////////////////////////////////////////////////////

                    case ProcessOperatingType.ToNext:
                    default:
                        break;
                }

                // SKIP to Specified Offset
                if (offsetSpecified >= 0)
                {
                    diff = offsetSpecified - fileOffset;
                }

                //////////////////////////////////////////////////////////////////////

                // SKIP buffer by diff size (offset reset)
                if (diff > 0)
                {
                    buffer = buffer.SkipBuffer(this.PrnStream, (int)diff, this.OutputStreams);

                    fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;
                }

                //////////////////////////////////////////////////////////////////////

                if (listAddedItem != null && listAddedItem.Count > 0)
                {
                    foreach (PCLXLItem item in listAddedItem)
                    {
                        this.OutputStreams.WriteBinary(item.ToBinary());
                    }

                    listAddedItem.Clear();
                }

                //////////////////////////////////////////////////////////////////////

                valueTag = PCLXLAttributeItem.CheckValueTag(buffer.CurrentData);

                buffer.NewAttribute = null;
                buffer.NewOperation = null;

                //////////////////////////////////////////////////////////////////////

                byte[] binary = null;

                if (valueTag != PCLXLAttributeItem.AttributeValueTagType.None)
                {
                    buffer = this.LoadAttribute(buffer, valueTag);

                    do
                    {
                        if (buffer == null || buffer.NewAttribute == null)
                        {
                            break;
                        }

                        PCLXLAttributeItem attr = buffer.NewAttribute;

                        // PCL-XL Attribute 추출/수정값에 대한 가공
                        switch (attr.Attribute)
                        {
                            case PDL.Constants.PCLXLAttribute.CommentData:

                                if (this.CurrentPage != null && this.CurrentPage.HasPhysicalStart && attr.Text.Contains("FXPC=") == true)
                                {
                                    this.SetData = new byte[15];
                                    int idxInt = this.IndexOf(buffer.Buffer, Fxsr);
                                    if (idxInt != -1)
                                    {
                                        if (buffer.Buffer[idxInt + 10] == 0x69)
                                        {
                                            Array.Copy(buffer.Buffer, idxInt + 11, this.SetData, 0, 15);

                                        }
                                        else if (buffer.Buffer[idxInt + 9] == 0x47)
                                        {
                                            Array.Copy(buffer.Buffer, idxInt + 10, this.SetData, 0, 15);
                                        }

                                        this.UpdateRop = null;
                                    }
                                }


                                if (attr.Text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.ColorModeColor) == true)
                                {
                                    this.IsColorJob = true;
                                }
                                if (this.JobData.Color == PrintJobData.ColorType.BlackWhite)
                                {
                                    if (attr.Text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.ColorModeColor) == true)
                                    {
                                        // 흑백 출력시 "FXPC=03"이 존재하는 attribute에 대한 값 변환
                                        attr.ValueByte = Encoding.Default.GetBytes(PDL.Constants.PCLXLAttribute.CommentDataValue.ColorModeBlackWhite);
                                    }
                                }

                                break;

                            case PDL.Constants.PCLXLAttribute.Orientation:
                                if (this.Metadata.PrnInfo.TotalPages > 1 && nup > 1 && this.Metadata.PrnInfo.Nup != nup)
                                {
                                    PDL.Constants.PageInfo.NUpType nupType = PDL.Constants.PageInfo.CalculateNup(nup);

                                    if (nupType == PDL.Constants.PageInfo.NUpType.Double)
                                    {
                                        // Orientation 전환 대상: 2up, 8up, 32up, ...
                                        attr.ValueByte[0] = PDL.Constants.PCLXLAttribute.OrientationValue.Landscape;
                                    }
                                }
                                break;

                            case PDL.Constants.PCLXLAttribute.PageOrigin:
                                if (this.Metadata.PrnInfo.TotalPages > 1 && nup > 1 && this.Metadata.PrnInfo.Nup != nup)
                                {
                                    Point pageOrigin = this.CurrentPage.GetPageOrigin(nup, this.Metadata.PrnInfo.Orientation);

                                    attr.SetPoint(pageOrigin);
                                }
                                break;

                            case PDL.Constants.PCLXLAttribute.PageScale:
                                if (this.Metadata.PrnInfo.TotalPages > 1 && nup > 1)
                                {
                                    float scale = PDL.Constants.PageInfo.PageScale.CalculateScale(nup);

                                    if (scale == float.NaN || attr.ValueTag != PCLXLAttributeItem.AttributeValueTagType.XYReal32)
                                    {
                                        break;
                                    }

                                    attr.SetPoint(scale, scale);
                                }
                                break;

                            case PDL.Constants.PCLXLAttribute.FontName:
                                if (operating == ProcessOperatingType.ToMasking)
                                {
                                    operating = ProcessOperatingType.ToFont;
                                    idxFontInfo++;
                                }
                                break;

                            case PDL.Constants.PCLXLAttribute.CharCode:
                                if (this.IncreasedCharacterCode == true)
                                {
                                    bool increased = false;

                                    foreach (MaskingInformation masking in this.CurrentPage.MaskingInfoList)
                                    {
                                        if (masking.Font.RangeOffset.Start < attr.Offset && attr.Offset < masking.Font.RangeOffset.End)
                                        {
                                            increased = true;
                                            break;
                                        }
                                    }

                                    if (increased == true)
                                    {
                                        attr.IncreaseCharacterCode();
                                    }
                                }
                                break;

                            case PDL.Constants.PCLXLAttribute.TextData:
                                {
                                    string fontName = currentFont.Font.InputName;

                                    if (this.IncreasedTextData == true)
                                    {
                                        attr.IncreaseTextData(currentFont.AsteriskCharCode);
                                    }

                                    MaskingTextData maskingData = this.CurrentPage.GetMaskingTextData(fontName, attr.Offset);

                                    if (maskingData == null)
                                    {
                                        break;
                                    }

                                    PrnSecurityPolicy security = this.Metadata.Policy.GetSecurityByID(maskingData.PolicyID);

                                    if (security == null || security.UseMasking == false)
                                    {
                                        break;
                                    }

                                    attr.ChangeTextData(currentFont.AsteriskCharCode, maskingData.MaskingIndexList);
                                }
                                break;

                            default:
                                break;
                        }

                        // Attribute Item to Binary
                        binary = attr.ToBinary();
                    }
                    while (false);
                }
                else
                {
                    buffer = this.LoadOperator(buffer);

                    do
                    {
                        if (buffer == null || buffer.NewOperation == null)
                        {
                            break;
                        }

                        PCLXLOperatorItem oper = buffer.NewOperation;

                        // PCL-XL Operator 추출/수정값에 대한 가공
                        switch (oper.Operator)
                        {
                            case PDL.Constants.PCLXLOperator.EndChar:
                                {
                                    if (this.CurrentPage == null)
                                    {
                                        break;
                                    }

                                    if (this.CurrentMaskingInfo.MaskingDictionary == null || this.CurrentMaskingInfo.MaskingDictionary.Count < 1)
                                    {
                                        idxFontInfo++;
                                    }
                                    else
                                    {
                                        operating = ProcessOperatingType.ToMasking;

                                        if (this.IncreasedCharacterCode == true)
                                        {
                                            this.IncreasedTextData = true;
                                        }
                                    }

                                    this.IncreasedCharacterCode = false;
                                }
                                break;

                            case PDL.Constants.PCLXLOperator.RemoveFont:
                                {
                                    operating = ProcessOperatingType.ToInsertImage;
                                }
                                break;

                            case PDL.Constants.PCLXLOperator.EndSession:
                                {
                                    buffer.ReaderMode = PrnBuffer.PrnReaderMode.PJL;
                                }
                                break;

                            default:
                                break;
                        }

                        // Operator Item to Binary
                        binary = oper.ToBinary();
                    }
                    while (false);
                }

                //////////////////////////////////////////////////////////////////////

                if (binary == null || binary.Length < 1)
                {
                    continue;
                }

                this.OutputStreams.WriteBinary(binary);
            }

            return buffer;
        }
        /// <summary>
        /// #5068 대응 추가 함수
        /// </summary>
        /// <param name="arrayToSearchThrough"></param>
        /// <param name="patternToFind"></param>
        /// <returns></returns>
        public int IndexOf(byte[] arrayToSearchThrough, byte[] patternToFind)
        {
            if (patternToFind.Length > arrayToSearchThrough.Length)
                return -1;
            for (int i = 0; i < arrayToSearchThrough.Length - patternToFind.Length; i++)
            {
                bool found = true;
                for (int j = 0; j < patternToFind.Length; j++)
                {
                    if (arrayToSearchThrough[i + j] != patternToFind[j])
                    {
                        found = false;
                        break;
                    }
                }
                if (found)
                {
                    return i;
                }
            }
            return -1;
        }

        private void LoadPCLXLHeader(PrnBuffer buffer, PrnDocument doc, long position)
        {
            long offset = -1;

            if (buffer.IsReadPCLXLHeader == false)
            {
                offset = buffer.Offset;

                this.HeaderBindingFormat = PCLXLHeader.CheckPCLXLHeader(buffer.Buffer, ref offset);

                buffer.Offset = offset;

                if (this.HeaderBindingFormat == PCLXLHeader.PCLXLBindingFormatType.None)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.SequenceReadingContinue);
                }
                else if (this.HeaderBindingFormat == PCLXLHeader.PCLXLBindingFormatType.Error)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLHeaderParsingError);
                }

                if (offset + 2 >= buffer.Length)
                {
                    buffer.RemainBuffer = null;
                }
                else
                {
                    buffer.RemainBuffer = buffer.GetRange(buffer.Offset + 2);
                }

                buffer.IsReadPCLXLHeader = true;
            }
            else if (buffer.IsReadPCLXLHeaderLF == false)
            {
                int idxLF;
                int startLF = 0;

                do
                {
                    idxLF = Array.IndexOf(buffer.Buffer, Constants.ASCII.LineFeed, startLF);

                    if (idxLF >= 0)
                    {
                        PCLXLHeader header = new PCLXLHeader(buffer.GetRange(startLF, idxLF - startLF), true, this.HeaderBindingFormat);

                        header.Offset = position + startLF - buffer.Length;

                        doc.SetPCLXLHeader(header);

                        if (idxLF + 1 >= buffer.Length)
                        {
                            buffer.RemainBuffer = null;
                        }
                        else
                        {
                            buffer.RemainBuffer = buffer.GetRange(idxLF + 1);
                        }

                        buffer.IsReadPCLXLHeaderLF = true;
                        break;
                    }
                    else
                    {
                        buffer.RemainBuffer = buffer.GetRange(startLF);
                    }
                }
                while (idxLF >= 0 && startLF < buffer.Length);

                if (idxLF >= buffer.Length - 1)
                {
                    buffer.RemainBuffer = null;
                }
            }
        }

        private PrnBuffer LoadOperator(PrnBuffer buffer)
        {
            PCLXLOperatorItem operatorItem = null;
            PCLXLOperatorItem.EmbeddedDataTagType embeddedDataTag;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

            operatorItem = new PCLXLOperatorItem()
            {
                Operator = buffer.CurrentData,
                Offset = fileOffset
            };

            buffer.Offset++;

            buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

            embeddedDataTag = PCLXLOperatorItem.CheckPCLXLEmbeddedDataTag(buffer.CurrentData);

            if (embeddedDataTag != PCLXLOperatorItem.EmbeddedDataTagType.None)
            {
                operatorItem.EmbeddedDataTag = embeddedDataTag;
                buffer.Offset++;

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                int cntEmbeddedDataLength = 1;

                if (embeddedDataTag == PCLXLOperatorItem.EmbeddedDataTagType.DataLength)
                {
                    cntEmbeddedDataLength = PDL.Constants.PCLXLOperator.CountEmbeddedDataLength;
                }
                else if (embeddedDataTag == PCLXLOperatorItem.EmbeddedDataTagType.DataLengthByte)
                {
                    cntEmbeddedDataLength = PDL.Constants.PCLXLOperator.CountEmbeddedDataLengthByte;
                }

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntEmbeddedDataLength, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                int cntDataLength = 0;

                try
                {
                    cntDataLength = PCLXLProcessor.GetOperatorDataLength(embeddedDataTag, buffer, cntEmbeddedDataLength);

                    buffer.Offset += cntEmbeddedDataLength;
                }
                catch (PrnParserException ppex)
                {
                    if (ppex.Type == PrnParserException.PrnParserExceptionType.PCLXLDataParsingError)
                    {
                        ppex.Offset = fileOffset;
                    }

                    throw ppex;
                }

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntDataLength, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL, true, cntDataLength);

                operatorItem.Data = buffer.GetRange(buffer.Offset, cntDataLength);

                buffer.Offset += cntDataLength;

                // Glyph ID 추출 
                operatorItem.ExtractGlyphID();
            }

            buffer.NewOperation = operatorItem;

            return buffer;
        }

        private PrnBuffer LoadAttribute(PrnBuffer buffer, PCLXLAttributeItem.AttributeValueTagType valueTag)
        {
            PCLXLAttributeItem attr = null;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            attr = new PCLXLAttributeItem()
            {
                ValueTag = valueTag,
                Offset = fileOffset
            };

            buffer.Offset++;

            try
            {
                int cntDemand = PCLXLAttributeItem.GetDemandForReadingAttributeValue(attr.ValueTag);

                if (cntDemand < 1)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntDemand, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                switch (attr.ValueTagSizeType)
                {
                    case PCLXLAttributeItem.AttributeValueTagSizeType.Single:
                    case PCLXLAttributeItem.AttributeValueTagSizeType.XY:
                    case PCLXLAttributeItem.AttributeValueTagSizeType.Box:
                        {
                            GetAttributeValue(attr.ValueTag, buffer, cntDemand, ref attr);

                            buffer.Offset += cntDemand;
                        }

                        break;

                    case PCLXLAttributeItem.AttributeValueTagSizeType.Array:
                        {
                            int cntDemandArr;

                            attr.ArrayLengthTag = PCLXLAttributeItem.CheckArrayLengthTag(buffer.CurrentData);
                            buffer.Offset++;

                            cntDemandArr = PCLXLAttributeItem.GetDemandForReadingAttributeArrayLength(attr.ArrayLengthTag);

                            if (cntDemandArr < 1)
                            {
                                throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                            }

                            buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntDemandArr, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                            int cntArrLength = 0;
                            cntArrLength = GetAttributeArrayLength(attr.ArrayLengthTag, buffer, cntDemandArr);
                            buffer.Offset += cntDemandArr;

                            cntDemandArr = cntArrLength * PCLXLAttributeItem.GetDemandForReadingAttributeArray(attr.ValueTag);

                            if (cntDemandArr < 1)
                            {
                                throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                            }

                            buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntDemandArr, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                            GetAttributeValue(attr.ValueTag, buffer, cntDemandArr, ref attr);
                            buffer.Offset += cntDemandArr;
                        }

                        break;
                }

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                attr.Tag = PCLXLAttributeItem.CheckAttributeTag(buffer.CurrentData);

                if (attr.Tag == PCLXLAttributeItem.AttributeTagType.UInt16)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.IsNotSupported);
                }
                else if (attr.Tag == PCLXLAttributeItem.AttributeTagType.None)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }

                int cntAttribute = attr.Tag == PCLXLAttributeItem.AttributeTagType.UByte ? PDL.Constants.PCLXLAttribute.CountUByte : PDL.Constants.PCLXLAttribute.CountUInt16;

                buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, cntAttribute, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

                buffer.Offset += cntAttribute;

                attr.Attribute = buffer.CurrentData;

                buffer.NewAttribute = attr;
                buffer.Offset++;
            }
            catch (PrnParserException ppex)
            {
                if (ppex.Type == PrnParserException.PrnParserExceptionType.PCLXLDataParsingError)
                {
                    ppex.Offset = fileOffset;
                }

                throw ppex;
            }

            return buffer;
        }

        #endregion Methods :: Load



        #region Methods :: Image Processing        

        public void MakeHeaderFooter(List<PrnHeaderFooterPolicy> listHeaderFooter)
        {
            if (listHeaderFooter == null)
            {
                throw new ArgumentNullException("List<PrnHeaderFooterPolicy> listHeaderFooter");
            }

            foreach (PrnHeaderFooterPolicy policyHeaderFooter in listHeaderFooter)
            {
                try
                {
                    string pathImage = this.ImageProcessor.MakePolicyImage(policyHeaderFooter, true);

                    if (string.IsNullOrWhiteSpace(pathImage) == true)
                    {
                        continue;
                    }

                    policyHeaderFooter.SetImagePath(pathImage);
                }
                catch
                {
                    continue;
                }
            }
        }

        public void MakeWatermarkImage(List<PrnWatermarkPolicy> listWatermark)
        {
            if (listWatermark == null)
            {
                throw new ArgumentNullException("List<PrnWatermarkPolicy> listWatermark");
            }

            foreach (PrnWatermarkPolicy policyWatermark in listWatermark)
            {
                try
                {
                    switch (policyWatermark.Type)
                    {
                        case PrnWatermarkPolicy.WatermarkType.Image:
                            {
                                string pathModified = string.Empty;

                                // TRANSPARENCY
                                if (policyWatermark.Transparency < 100)
                                {
                                    pathModified = this.ImageProcessor.SetTransparency(policyWatermark);

                                    policyWatermark.SetProcessingImage(pathModified);
                                }

                                // ANGLE
                                if (policyWatermark.Angle != 0)
                                {
                                    pathModified = this.ImageProcessor.SetAngle(policyWatermark);

                                    policyWatermark.SetProcessingImage(pathModified);
                                }

                                // SCALE
                                if (policyWatermark.ImageInfo.SizePercent != 100)
                                {
                                    pathModified = this.ImageProcessor.SetImageScale(policyWatermark);

                                    policyWatermark.SetProcessingImage(pathModified);
                                }
                            }
                            break;

                        case PrnWatermarkPolicy.WatermarkType.Text:
                            {
                                // MAKE a TEXT IMAGE
                                string pathImage = this.ImageProcessor.MakePolicyImage(policyWatermark, true);

                                if (string.IsNullOrWhiteSpace(pathImage) == true)
                                {
                                    continue;
                                }

                                policyWatermark.ImageInfo = new ImageItem()
                                {
                                    FileName = pathImage,
                                    SizePercent = 100
                                };
                            }
                            break;

                        default:
                            continue;
                    }
                }
                catch
                {
                    continue;
                }
            }
        }

        #endregion Methods :: Image Processing



        #region Methods :: Get Item's Value

        public static void GetAttributeValue(PCLXLAttributeItem.AttributeValueTagType tag, PrnBuffer buffer, int cntDemand, ref PCLXLAttributeItem attr)
        {
            PCLXLAttributeItem.AttributeValueTagDataType dataType;
            int cntDataType = 0;

            switch (tag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.SingleUByte:
                case PCLXLAttributeItem.AttributeValueTagType.XYUByte:
                case PCLXLAttributeItem.AttributeValueTagType.BoxUByte:
                case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UByte;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountUByte;

                        attr.ValueByte = new byte[cntDemand / cntDataType];
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleUInt16:
                case PCLXLAttributeItem.AttributeValueTagType.XYUInt16:
                case PCLXLAttributeItem.AttributeValueTagType.BoxUInt16:
                case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UInt16;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountUInt16;

                        attr.ValueUInt16 = new ushort[cntDemand / cntDataType];
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleUInt32:
                case PCLXLAttributeItem.AttributeValueTagType.XYUInt32:
                case PCLXLAttributeItem.AttributeValueTagType.BoxUInt32:
                case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UInt32;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountUInt32;

                        attr.ValueUInt32 = new uint[cntDemand / cntDataType];
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleSInt16:
                case PCLXLAttributeItem.AttributeValueTagType.XYSInt16:
                case PCLXLAttributeItem.AttributeValueTagType.BoxSInt16:
                case PCLXLAttributeItem.AttributeValueTagType.ArraySInt16:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.SInt16;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountSInt16;

                        attr.ValueSInt16 = new short[cntDemand / cntDataType];
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleSInt32:
                case PCLXLAttributeItem.AttributeValueTagType.XYSInt32:
                case PCLXLAttributeItem.AttributeValueTagType.BoxSInt32:
                case PCLXLAttributeItem.AttributeValueTagType.ArraySInt32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.SInt32;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountSInt32;

                        attr.ValueSInt32 = new int[cntDemand / cntDataType];
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleReal32:
                case PCLXLAttributeItem.AttributeValueTagType.XYReal32:
                case PCLXLAttributeItem.AttributeValueTagType.BoxReal32:
                case PCLXLAttributeItem.AttributeValueTagType.ArrayReal32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.Real32;

                        cntDataType = PDL.Constants.PCLXLAttribute.CountReal32;

                        attr.ValueReal32 = new float[cntDemand / cntDataType];
                    }

                    break;

                default:
                    {
                        throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                    }
            }

            // LOOP for Reading Value

            byte[] arrReading = null;

            long limitReadingOffset = buffer.Offset + cntDemand;
            int cntArr = 0;

            for (int i = (int)buffer.Offset; i < limitReadingOffset; i += cntDataType, cntArr++)
            {
                // Get Value
                arrReading = buffer.GetRange(i, cntDataType);

                if (arrReading == null)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }

                if (arrReading.Length < 1)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.SequenceReadingContinue);
                }

                try
                {
                    switch (dataType)
                    {
                        case PCLXLAttributeItem.AttributeValueTagDataType.UByte:
                            attr.ValueByte[cntArr] = arrReading[0];
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.UInt16:
                            attr.ValueUInt16[cntArr] = BitConverter.ToUInt16(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.UInt32:
                            attr.ValueUInt32[cntArr] = BitConverter.ToUInt32(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.SInt16:
                            attr.ValueSInt16[cntArr] = BitConverter.ToInt16(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.SInt32:
                            attr.ValueSInt32[cntArr] = BitConverter.ToInt32(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.Real32:
                            attr.ValueReal32[cntArr] = BitConverter.ToSingle(arrReading, 0);
                            break;

                        default:
                            throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                    }
                }
                catch
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }
            }
        }

        public static int GetAttributeArrayLength(PCLXLAttributeItem.AttributeValueTagType tag, PrnBuffer buffer, int cntDemand)
        {
            int result = -1;

            PCLXLAttributeItem.AttributeValueTagDataType dataType;
            int cntDataType = 0;

            switch (tag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.SingleUByte:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UByte;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountUByte;
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleUInt16:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UInt16;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountUInt16;
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleUInt32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.UInt32;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountUInt32;
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleSInt16:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.SInt16;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountSInt16;
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleSInt32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.SInt32;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountSInt32;
                    }

                    break;

                case PCLXLAttributeItem.AttributeValueTagType.SingleReal32:
                    {
                        dataType = PCLXLAttributeItem.AttributeValueTagDataType.Real32;
                        cntDataType = PDL.Constants.PCLXLAttribute.CountReal32;
                    }

                    break;

                default:
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
            }

            // LOOP for Reading Value
            byte[] arrReading = null;
            long limitReadingOffset = buffer.Offset + cntDemand;

            for (int i = (int)buffer.Offset; i < limitReadingOffset; i += cntDataType)
            {
                // Get Value
                arrReading = buffer.GetRange(i, cntDataType);

                if (arrReading == null)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }

                if (arrReading.Length < 1)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }

                try
                {
                    switch (dataType)
                    {
                        case PCLXLAttributeItem.AttributeValueTagDataType.UByte:
                            result = arrReading[0];
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.UInt16:
                            result = BitConverter.ToUInt16(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.UInt32:
                            result = (int)BitConverter.ToUInt32(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.SInt16:
                            result = (int)BitConverter.ToInt16(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.SInt32:
                            result = (int)BitConverter.ToInt32(arrReading, 0);
                            break;

                        case PCLXLAttributeItem.AttributeValueTagDataType.Real32:
                            result = (int)BitConverter.ToSingle(arrReading, 0);
                            break;

                        default:
                            throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                    }
                }
                catch
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }
            }

            return result;
        }

        public static int GetOperatorDataLength(PCLXLOperatorItem.EmbeddedDataTagType tag, PrnBuffer buffer, int cntDemand)
        {
            int result = 0;

            // Get Value
            byte[] arrReading = buffer.GetRange(buffer.Offset, cntDemand);

            if (arrReading == null)
            {
                throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
            }

            if (arrReading.Length < 1)
            {
                throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
            }

            try
            {
                switch (tag)
                {
                    case PCLXLOperatorItem.EmbeddedDataTagType.DataLength:
                        result = (int)BitConverter.ToUInt32(arrReading, 0);
                        break;

                    case PCLXLOperatorItem.EmbeddedDataTagType.DataLengthByte:
                        result = arrReading[0];
                        break;

                    default:
                        throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
                }
            }
            catch
            {
                throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError);
            }

            return result;
        }

        #endregion Methods :: Get Item's Value



        #region Static Methods :: Create PCL-XL Items

        private static List<PCLXLItem> CreateAsteriskItems(byte[] binary, long code)
        {
            if (binary == null || binary.Length < 1)
            {
                throw new ArgumentNullException("byte[] binary");
            }

            List<PCLXLItem> listItem = new List<PCLXLItem>();

            PCLXLAttributeItem attr = null;
            PCLXLOperatorItem oper = null;



            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // ATTRIBUTE :: CharCode (0xA2) - SingleUInt16   :: currentFont.AsteriskCharCode
            /////////////////////////////////////////////////////////////////////////////////////////////////////

            attr = new PCLXLAttributeItem
            {
                Attribute = PDL.Constants.PCLXLAttribute.CharCode,
                Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  (ushort)code
                              }
            };

            listItem.Add(attr);



            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // ATTRIBUTE :: CharDataSize (0xA3) - SingleUInt32   :: currentFont.Font.AsteriskBinary.Length
            /////////////////////////////////////////////////////////////////////////////////////////////////////

            attr = new PCLXLAttributeItem
            {
                Attribute = PDL.Constants.PCLXLAttribute.CharDataSize,
                Tag = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag = PCLXLAttributeItem.AttributeValueTagType.SingleUInt32,
                ValueUInt32 = new uint[]
                              {
                                  (uint)binary.Length
                              }
            };

            listItem.Add(attr);



            /////////////////////////////////////////////////////////////////////////////////////////////////////
            // OPERATOR  :: ReadChar (0x53) - DataLengthByte :: currentFont.Font.AsteriskBinary
            /////////////////////////////////////////////////////////////////////////////////////////////////////

            oper = new PCLXLOperatorItem
            {
                Operator = PDL.Constants.PCLXLOperator.ReadChar,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.DataLengthByte,
                Data = binary
            };

            listItem.Add(oper);



            return listItem;
        }

        #endregion Static Methods :: Create PCL-XL Items
    }
}