namespace FXKIS.PDL.Image
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Drawing;
    using System.Drawing.Imaging;

    using SmartWhere.Metadata;
    using SmartWhere.Policy;



    public class ImageProcessor
    {
        #region Enumerations

        public enum ImageProcessingType
        {
            Unknown,
            HeaderFooter,
            Watermark
        }

        #endregion Enumerations



        #region Constants

        public const string ExtensionPNG  = @".png";
        public const string ExtensionJPEG = @".jpg";

        #endregion Constants



        #region Properties

        public PrnMetadata                        Metadata                 { get; private set; }
        public ImageProcessing.ImageExtensionType ExtensionType            { get; private set; }
        public DirectoryInfo                      DirectoryWatermarkImage  { get; private set; }
        public DirectoryInfo                      DirectoryImageProcessing { get; private set; }
        public string                             Extension
        {
            get
            {
                switch (this.ExtensionType)
                {
                    case ImageProcessing.ImageExtensionType.PNG:
                        return ImageProcessor.ExtensionPNG;

                    case ImageProcessing.ImageExtensionType.JPEG:
                        return ImageProcessor.ExtensionJPEG;

                    default:
                        return string.Empty;
                }
            }
        }
        public ImageFormat Format
        {
            get
            {
                switch (this.ExtensionType)
                {
                    case ImageProcessing.ImageExtensionType.PNG:
                        return ImageFormat.Png;

                    case ImageProcessing.ImageExtensionType.JPEG:
                        return ImageFormat.Jpeg;

                    default:
                        return null;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public ImageProcessor (PrnMetadata metadata, ImageProcessing.ImageExtensionType extensionType, DirectoryInfo dirWatermarkImage, DirectoryInfo dirImageProcessing)
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (dirWatermarkImage == null)
            {
                throw new ArgumentNullException("DirectoryInfo dirWatermarkImage");
            }

            if (dirWatermarkImage.Exists == false)
            {
                throw new DirectoryNotFoundException(string.Format("Watermark Image Directory is not exists", dirWatermarkImage.FullName));
            }

            if (dirImageProcessing == null)
            {
                throw new ArgumentNullException("DirectoryInfo dirImageProcessing");
            }

            if (dirImageProcessing.Exists == false)
            {
                throw new DirectoryNotFoundException(string.Format("Image Processing Directory is not exists", dirImageProcessing.FullName));
            }

            this.Metadata                 = metadata;
            this.ExtensionType            = extensionType;
            this.DirectoryWatermarkImage  = dirWatermarkImage;
            this.DirectoryImageProcessing = dirImageProcessing;
        }

        public ImageProcessor (PrnMetadata metadata, ImageProcessing.ImageExtensionType extensionType, string pathWatermarkImageDir, string pathImageProcessingDir)
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (string.IsNullOrWhiteSpace(pathWatermarkImageDir) == true)
            {
                throw new ArgumentNullException("string pathWatermarkImageDir");
            }

            if (Directory.Exists(pathWatermarkImageDir) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Watermark Image Directory is not exists", pathWatermarkImageDir));
            }

            if (string.IsNullOrWhiteSpace(pathImageProcessingDir) == true)
            {
                throw new ArgumentNullException("string pathImageProcessingDir");
            }

            if (Directory.Exists(pathImageProcessingDir) == false)
            {
                throw new DirectoryNotFoundException(string.Format("Image Processing Directory is not exists", pathImageProcessingDir));
            }

            this.Metadata                 = metadata;
            this.ExtensionType            = extensionType;
            this.DirectoryWatermarkImage  = new DirectoryInfo(pathWatermarkImageDir);
            this.DirectoryImageProcessing = new DirectoryInfo(pathImageProcessingDir);
        }

        #endregion Constructors



        #region Methods

        public string MakePolicyImage (PrnPolicyItemBase policy, bool applyPostDrawing = false)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            ImageProcessingType type = ImageProcessingType.Unknown;
            FontInformationBase font = null;

            PrnHeaderFooterPolicy policyHeaderFooter = null;
            PrnWatermarkPolicy    policyWatermark    = null;

            ///////////////////////////////////////////////////////////////////////////

            if (policy is PrnHeaderFooterPolicy)
            {
                type               = ImageProcessingType.HeaderFooter;
                policyHeaderFooter = policy as PrnHeaderFooterPolicy;
                font               = policyHeaderFooter.Font;
            }
            else if (policy is PrnWatermarkPolicy)
            {
                type            = ImageProcessingType.Watermark;
                policyWatermark = policy as PrnWatermarkPolicy;
                font            = policyWatermark.Font;
            }
            else
            {
                throw new NotSupportedException(string.Format("This Operation is not supported in this Policy object type (TYPE: {0})", policy.GetType().ToString()));
            }

            ///////////////////////////////////////////////////////////////////////////

            // Set a Path of Image
            string pathImageProcessing = Path.Combine(this.DirectoryImageProcessing.FullName, string.Format("{0}_{1}{2}", this.Metadata.PrnInfo.UUID, Guid.NewGuid().ToString(), this.Extension));

            // Create a string
            string strPolicy = policy.ToString(this.Metadata.PrnInfo.UserIPAddress, this.Metadata.PrnInfo.UserID, this.Metadata.PrnInfo.DocumentName, this.Metadata.PrnInfo.ReceivedTime);

            if (string.IsNullOrWhiteSpace(strPolicy) == true)
            {
                throw new InvalidDataException("Text data of Policy is invald or empty");
            }

            // Create a Bitmap image by Policy string
            Bitmap objImage = null;

            try
            {
                objImage = ImageProcessing.CreateBitmapImage(strPolicy, font, this.ExtensionType);

                if (objImage == null)
                {
                    throw new InvalidOperationException("Image Creation failed");
                }

                ///////////////////////////////////////////////////////////////////////////

                if (applyPostDrawing == true && type == ImageProcessingType.Watermark)
                {
                    if (policyWatermark.Transparency < 100)
                    {
                        objImage = objImage.SetTransparency((uint)policyWatermark.Transparency);
                    }

                    if (policyWatermark.Angle != 0)
                    {
                        objImage = objImage.SetAngle(policyWatermark.Angle, this.ExtensionType);
                    }
                }

                ///////////////////////////////////////////////////////////////////////////

                // Save a Image of Policy string
                objImage.Save(pathImageProcessing, this.Format);
            }
            finally
            {
                if (objImage != null)
                {
                    objImage.Dispose();
                }
            }

            return pathImageProcessing;
        }

        public List<PCLXLItem> CreatePolicyImageItems (int pageNumber, int paperCode = Constants.MediaSizeInfo.EA4PAPER)
        {
            if (pageNumber < 1)
            {
                throw new ArgumentOutOfRangeException("int pageNumber", pageNumber, string.Format("Page Number is less than 1 ({0} < 1)", pageNumber));
            }

            if (pageNumber > this.Metadata.PrnInfo.TotalPages)
            {
                throw new ArgumentOutOfRangeException("int pageNumber", pageNumber, string.Format("Page Number is greater than TotalPages ({0} > {1})", pageNumber, this.Metadata.PrnInfo.TotalPages));
            }

            if (paperCode < 0)
            {
                throw new ArgumentOutOfRangeException("int paperCode", paperCode, string.Format("Paper Code is less than 0 ({0} < 0)", paperCode));
            }



            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

            PrnPageInfo.ResolutionType resolution = PrnPageInfo.GetResolutionType((ushort)this.Metadata.PrnInfo.Resoulution);

            List<PCLXLItem> listResult    = new List<PCLXLItem>();
            List<PCLXLItem> listImageItem = null;

            // Headers
            foreach (PrnHeaderFooterPolicy header in this.Metadata.Policy.Headers)
            {
                listImageItem = null;

                try
                {
                    listImageItem = this.CreatePolicyImageItem(header, pageNumber, resolution, paperCode);

                    listResult.AddRange(listImageItem);
                }
                catch
                {
                    continue;
                }
            }

            // Footers
            foreach (PrnHeaderFooterPolicy footer in this.Metadata.Policy.Footers)
            {
                listImageItem = null;

                try
                {
                    listImageItem = this.CreatePolicyImageItem(footer, pageNumber, resolution, paperCode);

                    listResult.AddRange(listImageItem);
                }
                catch
                {
                    continue;
                }
            }

            // Watermarks
            foreach (PrnWatermarkPolicy watermark in this.Metadata.Policy.Watermarks)
            {
                listImageItem = null;

                try
                {
                    switch (watermark.PageRepetition)
                    {
                        case PrnWatermarkPolicy.PageRepeatType.All:
                            break;

                        case PrnWatermarkPolicy.PageRepeatType.First:
                            if (pageNumber > 1)
                            {
                                continue;
                            }
                            break;

                        case PrnWatermarkPolicy.PageRepeatType.FirstAndLast:
                            if (pageNumber == 1 || pageNumber >= this.Metadata.PrnInfo.TotalPages)
                            {
                                break;
                            }
                            continue;

                        default:
                            continue;
                    }

                    listImageItem = this.CreatePolicyImageItem(watermark, pageNumber, resolution, paperCode);

                    listResult.AddRange(listImageItem);
                }
                catch
                {
                    continue;
                }
            }

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

            return listResult;
        }

        public List<PCLXLItem> CreatePolicyImageItem (PrnPolicyItemBase policy, int pageNumber, PrnPageInfo.ResolutionType resolution, int paperCode = Constants.MediaSizeInfo.EA4PAPER)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }
            if (pageNumber < 1)
            {
                throw new ArgumentOutOfRangeException("int pageNumber", pageNumber, string.Format("Page Number is less than 1 ({0} < 1)", pageNumber));
            }

            if (pageNumber > this.Metadata.PrnInfo.TotalPages)
            {
                throw new ArgumentOutOfRangeException("int pageNumber", pageNumber, string.Format("Page Number is greater than TotalPages ({0} > {1})", pageNumber, this.Metadata.PrnInfo.TotalPages));
            }

            if (paperCode < 0)
            {
                throw new ArgumentOutOfRangeException("int paperCode", paperCode, string.Format("Paper Code is less than 0 ({0} < 0)", paperCode));
            }

            ///////////////////////////////////////////////////////////////////////////

            byte[] binaryImage = this.GetImageBinaryFromPolicy(policy);

            Size   originImageSize = this.GetImageSizeFromPolicy(policy);
            Size   paperSize       = PageInformation.GetPaperSize(resolution, paperCode);            
            int    printSpace      = PrnPageInfo.GetPrintSpace(resolution);
            Point  pixelPerMM      = PrnPageInfo.GetPixelPerMM(resolution);
            double resolutionScale = PrnPageInfo.GetImageScale(resolution);


            // Resolution Scale x Image Size
            ushort displayWidth  = (ushort)Math.Round(originImageSize.Width  * resolutionScale);
            ushort displayHeight = (ushort)Math.Round(originImageSize.Height * resolutionScale);

            ///////////////////////////////////////////////////////////////////////////

            ushort displayX = displayWidth;
            ushort displayY = displayHeight;

            if (this.Metadata.PrnInfo.Orientation == PrnInformation.OrientationType.Landscape)
            {
                int tempint = paperSize.Width;

                paperSize.Width  = paperSize.Height;
                paperSize.Height = tempint;
            }

            bool grid = false;

            if (policy is PrnWatermarkPolicy)
            {
                grid = (policy as PrnWatermarkPolicy).Grid;
            }

            ///////////////////////////////////////////////////////////////////////////

            short xx = 0;
            short yy = 0;

            if (grid == false)
            {
                ///////////////////////////////////////////////////////////////////////////
                // Normal Image
                ///////////////////////////////////////////////////////////////////////////

                switch (policy.GetLocation())
                {
                    case ImageProcessing.PageImageLocation.TopLeft:
                        xx = 1;
                        yy = 1;
                        break;

                    case ImageProcessing.PageImageLocation.TopCenter:
                        xx = (short)((paperSize.Width - printSpace - displayX) / 2);
                        yy = 1;
                        break;

                    case ImageProcessing.PageImageLocation.TopRight:
                        xx = (short)(paperSize.Width - printSpace - displayX);
                        yy = 1;
                        break;

                    case ImageProcessing.PageImageLocation.MiddleLeft:
                        xx = 1;
                        yy = (short)((paperSize.Height - printSpace - displayY) / 2);
                        break;

                    case ImageProcessing.PageImageLocation.MiddleCenter:
                        xx = (short)((paperSize.Width  - printSpace - displayX) / 2);
                        yy = (short)((paperSize.Height - printSpace - displayY) / 2);
                        break;

                    case ImageProcessing.PageImageLocation.MiddleRight:
                        xx = (short) (paperSize.Width  - printSpace - displayX);
                        yy = (short)((paperSize.Height - printSpace - displayY) / 2);
                        break;

                    case ImageProcessing.PageImageLocation.BottomLeft:
                        xx = 1;
                        yy = (short)(paperSize.Height - printSpace - displayY);
                        break;

                    case ImageProcessing.PageImageLocation.BottomCenter:
                        xx = (short)((paperSize.Width - printSpace - displayX) / 2);
                        yy = (short)(paperSize.Height - printSpace - displayY);
                        break;

                    case ImageProcessing.PageImageLocation.BottomRight:
                        xx = (short)(paperSize.Width  - printSpace - displayX);
                        yy = (short)(paperSize.Height - printSpace - displayY);
                        break;

                    default:
                        break;
                }

                if (policy is PrnWatermarkPolicy)
                {
                    PrnWatermarkPolicy policyWatermark = policy as PrnWatermarkPolicy;

                    short moveX = (short)(policyWatermark.AdjustmentHorizontal * pixelPerMM.X);
                    short moveY = (short)(policyWatermark.AdjustmentVertical   * pixelPerMM.Y);

                    xx += moveX;
                    yy += moveY;
                }

                return this.CreatePolicyImageItem(binaryImage, new Point(xx, yy), originImageSize, new Size(displayWidth, displayHeight));
            }
            else
            {
                ///////////////////////////////////////////////////////////////////////////
                // Grid Image (Repetition in Page)
                ///////////////////////////////////////////////////////////////////////////

                List<PCLXLItem> listResult   = new List<PCLXLItem>();
                List<PCLXLItem> listGridItem = new List<PCLXLItem>();

                Point maxPoint = new Point()
                {
                    X = paperSize.Width  - printSpace,
                    Y = paperSize.Height - printSpace
                };

                int countY = 1;
                yy = 1;

                while (yy < maxPoint.Y)
                {
                    if ((countY % 2) == 1)
                    {
                        xx = 1;
                    }
                    else
                    {
                        xx = (short)displayX;
                    }

                    while (xx < maxPoint.X)
                    {
                        listGridItem = this.CreatePolicyImageItem(binaryImage, new Point(xx, yy), originImageSize, new Size(displayWidth, displayHeight));

                        if (listGridItem != null && listGridItem.Count > 0)
                        {
                            listResult.AddRange(listGridItem);
                        }

                        xx += (short)(displayX * 2);
                    }

                    yy += (short)displayY;

                    countY++;
                }

                return listResult;
            }
        }

        private List<PCLXLItem> CreatePolicyImageItem (byte[] binaryImage, Point point, Size sizeOrigin, Size sizeDisplay)
        {
            if (binaryImage == null || binaryImage.Length < 1)
            {
                throw new ArgumentNullException("byte[] binaryImage");
            }

            List<PCLXLItem> listItem = new List<PCLXLItem>();

            PCLXLAttributeItem attr = null;
            PCLXLOperatorItem  oper = null;



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Set ROP3 >> := { "ROP3" }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // ATTRIBUTE :: ROP3 (0x2C) - SingleUByteInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute = Constants.PCLXLAttribute.ROP3,
                Tag       = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag  = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                ValueByte = new byte[]
                            {
                                0x88
                            }
            };

            listItem.Add(attr);

            // OPERATOR :: SetROP (0x2C) - SingleUByteInt16
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.SetROP,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Set Clip To Page >> := NULL
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // OPERATOR :: SetClipToPage (0x69)
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.SetClipToPage,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Set Cursor >> := { "Point" }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // ATTRIBUTE :: Point (0x4C) - XYSInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.Point,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.XYSInt16,
                ValueSInt16 = new short[]
                              {
                                  (short)point.X,
                                  (short)point.Y
                              }
            };

            listItem.Add(attr);

            // OPERATOR :: SetCursor (0x6B)
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.SetCursor,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Set Color Space >> := { "ColorSpace" }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // ATTRIBUTE :: ColorSpace (0x03) - SingleUByte
            attr = new PCLXLAttributeItem()
            {
                Attribute = Constants.PCLXLAttribute.ColorSpace,
                Tag       = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag  = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                ValueByte = new byte[]
                            {
                                Constants.PCLXLAttribute.ColorSpaceValue.RGB
                            }
            };

            listItem.Add(attr);

            // OPERATOR  :: SetColorSpace (0x6A)
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.SetColorSpace,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Begin Image >> := { "ColorMapping", "ColorDepth", "SourceWidth", "SourceHeight", "DestinationSize" }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // ATTRIBUTE :: ColorMapping (0x64) - SingleUByte
            attr = new PCLXLAttributeItem()
            {
                Attribute = Constants.PCLXLAttribute.ColorMapping,
                Tag       = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag  = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                ValueByte = new byte[]
                            {
                                Constants.PCLXLAttribute.ColorMappingValue.DirectPixel
                            }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: ColorDepth (0x62) - SingleUByte
            attr = new PCLXLAttributeItem()
            {
                Attribute = Constants.PCLXLAttribute.ColorDepth,
                Tag       = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag  = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                ValueByte = new byte[]
                            {
                                Constants.PCLXLAttribute.ColorDepthValue.Bit8
                            }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: SourceWidth (0x6C) - SingleUInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.SourceWidth,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.SingleUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  (ushort)sizeOrigin.Width
                              }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: SourceHeight (0x6B) - SingleUInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.SourceHeight,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.SingleUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  (ushort)sizeOrigin.Height
                              }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: DestinationSize (0x67) - XYUInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.DestinationSize,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.XYUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  (ushort)sizeDisplay.Width,
                                  (ushort)sizeDisplay.Height
                              }
            };

            listItem.Add(attr);

            // OPERATOR :: BeginImage (0xB0)
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.BeginImage,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << Read Image >> := { "StartLine", "BlockHeight", "CompressMode" }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // ATTRIBUTE :: StartLine (0x6D) - SingleUInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.StartLine,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.SingleUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  0
                              }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: BlockHeight (0x63) - SingleUInt16
            attr = new PCLXLAttributeItem()
            {
                Attribute   = Constants.PCLXLAttribute.BlockHeight,
                Tag         = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag    = PCLXLAttributeItem.AttributeValueTagType.SingleUInt16,
                ValueUInt16 = new ushort[]
                              {
                                  (ushort)sizeOrigin.Height
                              }
            };

            listItem.Add(attr);

            // ATTRIBUTE :: CompressMode (0x65) - SingleUByte            
            attr = new PCLXLAttributeItem()
            {
                Attribute = Constants.PCLXLAttribute.CompressMode,
                Tag       = PCLXLAttributeItem.AttributeTagType.UByte,
                ValueTag  = PCLXLAttributeItem.AttributeValueTagType.SingleUByte,
                ValueByte = new byte[]
                            {
                                Constants.PCLXLAttribute.CompressModeValue.JPEGCompression
                            }
            };

            listItem.Add(attr);

            // OPERATOR :: ReadImage (0xB1) - DataLength
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.ReadImage,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.DataLength,
                Data            = binaryImage
            };

            listItem.Add(oper);



            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // << End Image >> := NULL
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // OPERATOR :: EndImage (0xB2)
            oper = new PCLXLOperatorItem()
            {
                Operator        = Constants.PCLXLOperator.EndImage,
                EmbeddedDataTag = PCLXLOperatorItem.EmbeddedDataTagType.None
            };

            listItem.Add(oper);



            return listItem;
        }

        public string GetImagePathFromPolicy (PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            PrnHeaderFooterPolicy policyHeaderFooter = null;
            PrnWatermarkPolicy    policyWatermark    = null;

            string pathImage = string.Empty;
            bool   isImage   = false;

            ///////////////////////////////////////////////////////////////////////////

            if (policy is PrnHeaderFooterPolicy)
            {
                policyHeaderFooter = policy as PrnHeaderFooterPolicy;

                pathImage = policyHeaderFooter.GetImagePath();
            }
            else if (policy is PrnWatermarkPolicy)
            {
                policyWatermark = policy as PrnWatermarkPolicy;

                if (policyWatermark.ImageProcessingApplied == false)
                {
                    isImage = true;
                }

                pathImage = policyWatermark.ImageInfo.FileName;
            }
            else
            {
                throw new NotSupportedException(string.Format("This Operation is not supported in this Policy object type (TYPE: {0})", policy.GetType().ToString()));
            }

            ///////////////////////////////////////////////////////////////////////////

            if (isImage == true)
            {
                if (Path.IsPathRooted(pathImage) == false)
                {
                    pathImage = Path.Combine(this.DirectoryWatermarkImage.FullName, pathImage);
                }
            }
            else
            {
                if (Path.IsPathRooted(pathImage) == false)
                {
                    pathImage = Path.Combine(this.DirectoryImageProcessing.FullName, pathImage);
                }
            }

            if (File.Exists(pathImage) == false)
            {
                throw new FileNotFoundException("Image file is not exists", pathImage);
            }

            ///////////////////////////////////////////////////////////////////////////

            return pathImage;
        }

        public Bitmap GetImageObjectFromPolicy (PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            return (Bitmap)Image.FromFile(this.GetImagePathFromPolicy(policy));
        }

        private byte[] GetImageBinaryFromPolicy (PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            ///////////////////////////////////////////////////////////////////////////

            FileInfo fi = new FileInfo(this.GetImagePathFromPolicy(policy));

            using (FileStream fs = fi.OpenRead())
            {
                using (BinaryReader reader = new BinaryReader(fs))
                {
                    if (fi.Length < int.MaxValue)
                    {
                        return reader.ReadBytes((int)fi.Length);
                    }

                    //////////////////////////////////////////////////////////////////

                    List<byte> listResult = new List<byte>();

                    long length = fi.Length;

                    do
                    {
                        int cntRead = (length <= int.MaxValue ? (int)length : int.MaxValue);

                        listResult.AddRange(reader.ReadBytes(cntRead));

                        length -= cntRead;
                    }
                    while (length > 0);

                    //////////////////////////////////////////////////////////////////

                    if (listResult == null || listResult.Count < 1)
                    {
                        return null;
                    }

                    return listResult.ToArray();
                }
            }
        }

        public Size GetImageSizeFromPolicy (PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicyItemBase policy");
            }

            using (Bitmap objImage = this.GetImageObjectFromPolicy(policy))
            {
                return objImage.Size;
            }
        }

        public string SetTransparency (PrnWatermarkPolicy policyWatermark)
        {
            if (policyWatermark == null)
            {
                throw new ArgumentNullException("PrnWatermarkPolicy policyWatermark");
            }

            if (policyWatermark.ImageInfo == null)
            {
                throw new ArgumentException("Property \"ImageInfo\" of PrnWatermarkPolicy is null");
            }

            string pathOrigin   = this.GetImagePathFromPolicy(policyWatermark);
            string pathAdjusted = Path.Combine(this.DirectoryImageProcessing.FullName, string.Format("{0}_{1}{2}", this.Metadata.PrnInfo.UUID, Guid.NewGuid().ToString(), this.Extension));

            // Load a Original Image
            using (Bitmap objImageOrigin = this.GetImageObjectFromPolicy(policyWatermark))
            {
                // Set a Transparency
                using (Bitmap objImageAdjusted = objImageOrigin.SetTransparency((uint)policyWatermark.Transparency))
                {
                    // Save a Adjusted Image
                    objImageAdjusted.Save(pathAdjusted, this.Format);
                }
            }

            try
            {
                if (policyWatermark.ImageProcessingApplied == true && File.Exists(pathOrigin) == true)
                {
                    File.Delete(pathOrigin);
                }
            }
            catch { }

            return pathAdjusted;
        }


        public string SetAngle (PrnWatermarkPolicy policyWatermark)
        {
            if (policyWatermark == null)
            {
                throw new ArgumentNullException("PrnWatermarkPolicy policyWatermark");
            }

            if (policyWatermark.ImageInfo == null)
            {
                throw new ArgumentException("Property \"ImageInfo\" of PrnWatermarkPolicy is null");
            }

            string pathOrigin   = this.GetImagePathFromPolicy(policyWatermark);
            string pathAdjusted = Path.Combine(this.DirectoryImageProcessing.FullName, string.Format("{0}_{1}{2}", this.Metadata.PrnInfo.UUID, Guid.NewGuid().ToString(), this.Extension));

            // Load a Original Image
            using (Bitmap objImageOrigin = this.GetImageObjectFromPolicy(policyWatermark))
            {
                // Set a Image Angle
                using (Bitmap objImageAdjusted = objImageOrigin.SetAngle(policyWatermark.Angle, this.ExtensionType))
                {
                    // Save a Adjusted Image
                    objImageAdjusted.Save(pathAdjusted, this.Format);
                }
            }

            try
            {
                if (policyWatermark.ImageProcessingApplied == true && File.Exists(pathOrigin) == true)
                {
                    File.Delete(pathOrigin);
                }
            }
            catch { }

            return pathAdjusted;
        }

        public string SetImageScale (PrnWatermarkPolicy policyWatermark)
        {
            if (policyWatermark == null)
            {
                throw new ArgumentNullException("PrnWatermarkPolicy policyWatermark");
            }

            if (policyWatermark.ImageInfo == null)
            {
                throw new ArgumentException("Property \"ImageInfo\" of PrnWatermarkPolicy is null");
            }

            string pathOrigin   = this.GetImagePathFromPolicy(policyWatermark);
            string pathAdjusted = Path.Combine(this.DirectoryImageProcessing.FullName, string.Format("{0}_{1}{2}", this.Metadata.PrnInfo.UUID, Guid.NewGuid().ToString(), this.Extension));

            // Load a Original Image
            using (Bitmap objImageOrigin = this.GetImageObjectFromPolicy(policyWatermark))
            {
                // Rescale
                double scaleAdjusted = policyWatermark.ImageInfo.SizePercent / 100.0;

                Size sizeOrigin   = objImageOrigin.Size;
                Size sizeAdjusted = new Size((int)Math.Round(sizeOrigin.Width * scaleAdjusted), (int)Math.Round(sizeOrigin.Height * scaleAdjusted));

                // Set a Size of Image by Scale (Percent)
                using (Bitmap objImageAdjusted = objImageOrigin.SetSize(sizeAdjusted))
                {
                    // Save a Adjusted Image
                    objImageAdjusted.Save(pathAdjusted, this.Format);
                }
            }

            try
            {
                if (policyWatermark.ImageProcessingApplied == true && File.Exists(pathOrigin) == true)
                {
                    File.Delete(pathOrigin);
                }
            }
            catch { }

            return pathAdjusted;
        }

        #endregion Methods
    }
}
