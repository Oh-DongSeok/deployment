namespace FXKIS.PDL.Analyze
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;

    using Data;
    using Exceptions;



    public class PCLXLExtractor
    {
        #region Constants

        // Define of Extract target for PCL-XL Attributes

        private static readonly byte[] ExtractAttributes = new byte[]
        {
            PDL.Constants.PCLXLAttribute.UnitsPerMeasure,
            PDL.Constants.PCLXLAttribute.CommentData,
            PDL.Constants.PCLXLAttribute.MediaSize,
            PDL.Constants.PCLXLAttribute.PageAngle,
            PDL.Constants.PCLXLAttribute.PageOrigin,
            PDL.Constants.PCLXLAttribute.PageScale,
            PDL.Constants.PCLXLAttribute.Orientation,
            PDL.Constants.PCLXLAttribute.ROP3,
            PDL.Constants.PCLXLAttribute.ColorSpace,

            PDL.Constants.PCLXLAttribute.Point,
            PDL.Constants.PCLXLAttribute.FontName,
            PDL.Constants.PCLXLAttribute.CharCode,
            PDL.Constants.PCLXLAttribute.TextData
        };

        private static readonly byte[] ExtractAttributesWithoutMasking = new byte[]
        {
            PDL.Constants.PCLXLAttribute.UnitsPerMeasure,
            PDL.Constants.PCLXLAttribute.CommentData,
            PDL.Constants.PCLXLAttribute.MediaSize,
            PDL.Constants.PCLXLAttribute.PageAngle,
            PDL.Constants.PCLXLAttribute.PageOrigin,
            PDL.Constants.PCLXLAttribute.PageScale,
            PDL.Constants.PCLXLAttribute.Orientation,
            PDL.Constants.PCLXLAttribute.ROP3,
            PDL.Constants.PCLXLAttribute.ColorSpace
        };

        // Define of Extract target for PCL-XL Operators
        private static readonly byte[] ExtractOperators = new byte[]
        {
            PDL.Constants.PCLXLOperator.BeginFontHeader,
            PDL.Constants.PCLXLOperator.BeginChar,
            PDL.Constants.PCLXLOperator.ReadChar,
            PDL.Constants.PCLXLOperator.EndChar,
            PDL.Constants.PCLXLOperator.EndPage,
            PDL.Constants.PCLXLOperator.EndSession
        };

        private static readonly byte[] ExtractOperatorsWithoutMasking = new byte[]
        {
            PDL.Constants.PCLXLOperator.EndPage,
            PDL.Constants.PCLXLOperator.EndSession
        };

        private const long BufferCuttingSize = 131072; // 128kb

        #endregion Constants



        #region Properties

        private Stream PrnStream    { get; set; }
        private bool   HasPageAngle { get; set; }
        private long   OffsetCut    { get; set; }

        #endregion Properties



        #region Constructors

        public PCLXLExtractor (Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream is null");
            }

            this.PrnStream    = stream;
            this.HasPageAngle = false;
        }

        #endregion Constructors



        #region Methods :: Load

        public PrnBuffer Extract (PrnBuffer buffer, PrnDocument doc, bool isMasking = false)
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

            PCLXLAttributeItem previewPoint = null;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            // LOOP for Spool parsing
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

                valueTag = PCLXLAttributeItem.CheckValueTag(buffer.CurrentData);

                buffer.NewAttribute = null;
                buffer.NewOperation = null;

                //////////////////////////////////////////////////////////////////////

                if (valueTag != PCLXLAttributeItem.AttributeValueTagType.None)
                {
                    buffer = this.LoadAttribute(buffer, valueTag);

                    if (buffer != null && buffer.NewAttribute != null)
                    {
                        PCLXLAttributeItem attr = buffer.NewAttribute;

                        bool targetAttr = false;

                        //////////////////////////////////////////////////////////////////////////////////////////////////////

                        if (isMasking == true)
                        {
                            if (attr.Attribute == PDL.Constants.PCLXLAttribute.Point)
                            {
                                previewPoint = attr;
                                continue;
                            }

                            if (previewPoint != null)
                            {
                                if (attr.Attribute == PDL.Constants.PCLXLAttribute.TextData || attr.Attribute == PDL.Constants.PCLXLAttribute.CharAngle)
                                {
                                    doc.AddPCLXLItem(previewPoint);
                                }

                                previewPoint = null;
                            }

                            if (attr.Attribute == PDL.Constants.PCLXLAttribute.PageAngle)
                            {
                                if (this.HasPageAngle == true)
                                {
                                    continue;
                                }

                                this.HasPageAngle = true;
                            }

                            targetAttr = PCLXLExtractor.ExtractAttributes.Contains(attr.Attribute);
                        }
                        else
                        {
                            if (attr.Attribute == PDL.Constants.PCLXLAttribute.PageAngle)
                            {
                                if (this.HasPageAngle == true)
                                {
                                    continue;
                                }

                                this.HasPageAngle = true;
                            }

                            targetAttr = PCLXLExtractor.ExtractAttributesWithoutMasking.Contains(attr.Attribute);
                        }

                        //////////////////////////////////////////////////////////////////////////////////////////////////////

                        if (targetAttr == true)
                        {
                            // not "COMMENT DATA"
                            if (attr.Attribute != PDL.Constants.PCLXLAttribute.CommentData)
                            {
                                doc.AddPCLXLItem(attr);
                            }

                            // "COMMENT DATA"
                            else
                            {
                                targetAttr = false;

                                string text = attr.Text.ToUpper();

                                // PAGE START
                                if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.ColorMode) == true)
                                {
                                    Match match = Regex.Match(text, PDL.Constants.PCLXLAttribute.CommentDataValue.PatternColorMode);

                                    if (match != null && match.Success == true && match.Groups.Count == 2)
                                    {
                                        string strValue = match.Groups[1].Value;
                                        int value = 0;

                                        if (int.TryParse(strValue, out value) == true)
                                        {
                                            if (value == 1 || value == 3)
                                            {
                                                targetAttr = true;
                                            }
                                        }
                                    }
                                }

                                ///todo:: FXSR
                                else if (text.Contains("FXSR=") == true)
                                {
                                    targetAttr = true;
                                }

                                // PAGE END (LOGICAL)
                                else if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.EndPageOf) == true)
                                {
                                    targetAttr        = true;
                                    this.HasPageAngle = false;
                                }

                                // PAGE START (LOGICAL)
                                else if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.StartPage) == true)
                                {
                                    targetAttr = true;
                                }

                                if (targetAttr == true)
                                {
                                    doc.AddPCLXLItem(attr);
                                }
                            }
                        }
                    }
                }
                else
                {
                    buffer = this.LoadOperator(buffer);

                    if (buffer != null && buffer.NewOperation != null)
                    {
                        PCLXLOperatorItem oper = buffer.NewOperation;

                        bool isExtractOperator = false;

                        //////////////////////////////////////////////////////////////////////////////////////////////////////

                        if (isMasking == true)
                        {
                            isExtractOperator = PCLXLExtractor.ExtractOperators.Contains(oper.Operator);
                        }
                        else
                        {
                            isExtractOperator = PCLXLExtractor.ExtractOperatorsWithoutMasking.Contains(oper.Operator);
                        }

                        //////////////////////////////////////////////////////////////////////////////////////////////////////

                        if (isExtractOperator == true)
                        {
                            doc.AddPCLXLItem(buffer.NewOperation);

                            buffer.RemainBuffer = buffer.GetRange(buffer.Offset);

                            if (buffer.NewOperation.Operator == PDL.Constants.PCLXLOperator.EndSession)
                            {
                                buffer.ReaderMode = PrnBuffer.PrnReaderMode.PJL;
                            }

                            if (PDL.Constants.PCLXLOperator.DataSkipOperatorTable.Contains(oper.Operator) == true || oper.Operator == PDL.Constants.PCLXLOperator.ReadChar)
                            {
                                fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

                                if (this.OffsetCut + PCLXLExtractor.BufferCuttingSize < fileOffset)
                                {
                                    this.OffsetCut = fileOffset;

                                    buffer.Slice(buffer.Offset);
                                }
                            }

                            return buffer;
                        }

                        //////////////////////////////////////////////////////////////////////////////////////////////////////
                    }
                }

                //////////////////////////////////////////////////////////////////////

                fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

                if (this.OffsetCut + PCLXLExtractor.BufferCuttingSize < fileOffset)
                {
                    this.OffsetCut = fileOffset;

                    buffer.Slice(buffer.Offset);
                }

                if (buffer.Length < 1)
                {
                    if (buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL)
                    {
                        throw new PrnParserException(PrnParserException.PrnParserExceptionType.PCLXLDataParsingError, fileOffset);
                    }

                    buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL, false);
                }
            }

            return buffer;
        }

        private void LoadPCLXLHeader (PrnBuffer buffer, PrnDocument doc, long position)
        {
            PCLXLHeader.PCLXLBindingFormatType bindingFormat = PCLXLHeader.PCLXLBindingFormatType.None;
            long offset = -1;

            if (buffer.IsReadPCLXLHeader == false)
            {
                offset = buffer.Offset;

                bindingFormat = PCLXLHeader.CheckPCLXLHeader(buffer.Buffer, ref offset);

                buffer.Offset = offset;

                if (bindingFormat == PCLXLHeader.PCLXLBindingFormatType.None)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.SequenceReadingContinue);
                }
                else if (bindingFormat == PCLXLHeader.PCLXLBindingFormatType.Error)
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
                        PCLXLHeader header = new PCLXLHeader(buffer.GetRange(startLF, idxLF - startLF), bindingFormat);

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

        private PrnBuffer LoadOperator (PrnBuffer buffer)
        {
            PCLXLOperatorItem operatorItem = null;
            PCLXLOperatorItem.EmbeddedDataTagType embeddedDataTag;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            buffer = PrnBuffer.BufferSecuringProcess(this.PrnStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL);

            operatorItem = new PCLXLOperatorItem() { Operator = buffer.CurrentData, Offset = fileOffset };
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
                    cntDataLength = PCLXLExtractor.GetOperatorDataLength(embeddedDataTag, buffer, cntEmbeddedDataLength);

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

                if (PDL.Constants.PCLXLOperator.DataSkipOperatorTable.Contains(operatorItem.Operator) == false)
                {
                    operatorItem.Data = buffer.GetRange(buffer.Offset, cntDataLength);
                }

                buffer.Offset += cntDataLength;

                // Glyph ID 추출 
                operatorItem.ExtractGlyphID();
            }

            buffer.NewOperation = operatorItem;

            return buffer;
        }

        private PrnBuffer LoadAttribute (PrnBuffer buffer, PCLXLAttributeItem.AttributeValueTagType valueTag)
        {
            PCLXLAttributeItem attr = null;

            long fileOffset = this.PrnStream.Position + buffer.Offset - buffer.Length;

            attr = new PCLXLAttributeItem() { ValueTag = valueTag, Offset = fileOffset };
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



        #region Methods :: Get Item's Value

        public static void GetAttributeValue (PCLXLAttributeItem.AttributeValueTagType tag, PrnBuffer buffer, int cntDemand, ref PCLXLAttributeItem attr)
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

        public static int GetAttributeArrayLength (PCLXLAttributeItem.AttributeValueTagType tag, PrnBuffer buffer, int cntDemand)
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

        public static int GetOperatorDataLength (PCLXLOperatorItem.EmbeddedDataTagType tag, PrnBuffer buffer, int cntDemand)
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
    }
}