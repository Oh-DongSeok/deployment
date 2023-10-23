namespace FXKIS.PDL.Image
{
    using System;
    using System.Drawing;
    using System.Drawing.Drawing2D;
    using System.Drawing.Imaging;
    using System.Drawing.Text;

    using SmartWhere.Policy;



    public static class ImageProcessing
    {
        #region Enumerations

        public enum PageImageLocation
        {
            Unknown,
            TopLeft,
            TopCenter,
            TopRight,
            MiddleLeft,
            MiddleCenter,
            MiddleRight,
            BottomLeft,
            BottomCenter,
            BottomRight
        }

        public enum ImageExtensionType
        {
            Unknown,
            PNG,
            JPEG
        }

        #endregion Enumerations



        #region Constants

        public const float ScaleImageProcessing = 4.0F;

        public const float ScaleImage = 4.0f;

        #endregion Constants



        #region Static Methods

        public static Bitmap CreateBitmapImage (string text, FontInformationBase fontInfo, ImageExtensionType extension)
        {
            if (string.IsNullOrWhiteSpace(text) == true)
            {
                throw new ArgumentNullException("string text");
            }

            if (fontInfo == null)
            {
                throw new ArgumentNullException("FontInformation fontInfo");
            }

            Color colorBackground = ImageProcessing.GetColorByImageExtension(extension);

            ///////////////////////////////////////////////////////////////////////////

            Bitmap objBmpImage = new Bitmap(1, 1);

            // Get a Font Object by PrnPolicy's FontInformation
            Font objFont = fontInfo.GetFontObject();

            // Create a Image Object
            using (Graphics objGraphics = Graphics.FromImage(objBmpImage))
            {
                int width  = (int)(Math.Round(objGraphics.MeasureString(text, objFont).Width)  * ImageProcessing.ScaleImageProcessing);
                int height = (int)(Math.Round(objGraphics.MeasureString(text, objFont).Height) * ImageProcessing.ScaleImageProcessing);

                objBmpImage = new Bitmap(objBmpImage, new Size(width, height));

                using (Graphics objResizeGraphics = Graphics.FromImage(objBmpImage))
                {
                    objResizeGraphics.Clear(colorBackground);

                    objResizeGraphics.SmoothingMode     = SmoothingMode.AntiAlias;
                    objResizeGraphics.TextRenderingHint = TextRenderingHint.AntiAlias;

                    objResizeGraphics.ScaleTransform(ImageProcessing.ScaleImageProcessing, ImageProcessing.ScaleImageProcessing);

                    objResizeGraphics.DrawString(text, objFont, fontInfo.GetSolidBrush(), 0, 0);
                    objResizeGraphics.Flush();

                    return objBmpImage;
                }
            }
        }

        private static Color GetColorByImageExtension (ImageExtensionType extension)
        {
            switch (extension)
            {
                case ImageExtensionType.PNG:
                    return Color.Transparent;

                case ImageExtensionType.JPEG:
                    return Color.White;

                default:
                    throw new NotSupportedException(string.Format("This Operation is not supported in this extension type (TYPE: {0})", extension.ToString()));
            }
        }

        public static Bitmap AdjustSize (Image originImage, int width, int height)
        {
            Bitmap adjustedImage = new Bitmap(width, height);

            using (Graphics graphics = Graphics.FromImage(adjustedImage))
            {
                graphics.DrawImage(originImage, new Rectangle(0, 0, width, height), 0, 0, originImage.Width, originImage.Height, GraphicsUnit.Pixel);

                return adjustedImage;
            }
        }

        public static Bitmap AdjustAngle (Image originImage, float angle, ImageExtensionType extension)
        {
            using (Bitmap adjustedImage = new Bitmap(originImage))
            {
                Color  colorBackground = ImageProcessing.GetColorByImageExtension(extension);

                angle = angle % 360;

                if (angle > 180)
                {
                    angle -= 360;
                }

                PixelFormat pf = default(PixelFormat);

                if (colorBackground == Color.Transparent)
                {
                    pf = PixelFormat.Format32bppArgb;
                }
                else
                {
                    pf = adjustedImage.PixelFormat;
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                float sin = (float)Math.Abs(Math.Sin(angle * Math.PI / 180.0)); // this function takes radians
                float cos = (float)Math.Abs(Math.Cos(angle * Math.PI / 180.0)); // this one too

                float newImgWidth  = (sin * adjustedImage.Height) + (cos * adjustedImage.Width);
                float newImgHeight = (sin * adjustedImage.Width)  + (cos * adjustedImage.Height);

                float originX = 0F;
                float originY = 0F;

                if (angle > 0)
                {
                    if (angle <= 90)
                    {
                        originX = sin * adjustedImage.Height;
                    }
                    else
                    {
                        originX = newImgWidth;
                        originY = newImgHeight - (sin * adjustedImage.Width);
                    }
                }
                else
                {
                    if (angle >= -90)
                    {
                        originY = sin * adjustedImage.Width;
                    }
                    else
                    {
                        originX = newImgWidth - (sin * adjustedImage.Height);
                        originY = newImgHeight;
                    }
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                Bitmap objNewImage = new Bitmap((int)newImgWidth, (int)newImgHeight, pf);

                using (Graphics graphics = Graphics.FromImage(objNewImage))
                {
                    graphics.Clear(colorBackground);

                    // offset the origin to our calculated values
                    graphics.TranslateTransform(originX, originY);

                    // set up rotate
                    graphics.RotateTransform(angle);

                    graphics.InterpolationMode = InterpolationMode.HighQualityBilinear;

                    // draw the image at 0, 0
                    graphics.DrawImageUnscaled(adjustedImage, 0, 0);

                    return objNewImage;
                }
            }
        }

        public static Bitmap AdjustTransparency (Image originImage, uint transparency)
        {
            if (originImage == null)
            {
                throw new ArgumentNullException("Image originImage");
            }

            float adjustedBrightness = (float)transparency / 100.0f;

            float[][] ptsArray = {
                                     new float[] {1.0f,   0,    0,    0,  0}, // scale red
                                     new float[] {  0,  1.0f,   0,    0,  0}, // scale green
                                     new float[] {  0,    0,  1.0f,   0,  0}, // scale blue
                                     new float[] {  0,    0,    0,  1.0f, 0}, // don't scale alpha
                                     new float[] {adjustedBrightness, adjustedBrightness, adjustedBrightness, 0, 1}
                                 };

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            ImageAttributes imageAttributes = new ImageAttributes();

            imageAttributes.ClearColorMatrix();
            imageAttributes.SetColorMatrix(new ColorMatrix(ptsArray), ColorMatrixFlag.Default, ColorAdjustType.Bitmap);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            Bitmap adjustedImage = new Bitmap(originImage.Width, originImage.Height);

            using (Graphics graphics = Graphics.FromImage(adjustedImage))
            {
                graphics.DrawImage(originImage, new Rectangle(0, 0, originImage.Width, originImage.Height), 0, 0, originImage.Width, originImage.Height, GraphicsUnit.Pixel, imageAttributes);

                return adjustedImage;
            }
        }

        #endregion Static Methods



        #region Extention Methods

        public static Bitmap SetSize (this Image originImage, int width, int height)
        {
            return ImageProcessing.AdjustSize(originImage, width, height);
        }

        public static Bitmap SetSize (this Image originImage, Size size)
        {
            return ImageProcessing.AdjustSize(originImage, size.Width, size.Height);
        }

        public static Bitmap SetAngle (this Image originImage, float angle, ImageExtensionType extension)
        {
            return ImageProcessing.AdjustAngle(originImage, angle, extension);
        }

        public static Bitmap SetTransparency (this Image originImage, uint transparency)
        {
            return ImageProcessing.AdjustTransparency(originImage, transparency);
        }

        #endregion Extension Methods
    }



    /// <summary>
    /// static class :: ImageProcessingUtility (for Extension Methods)
    /// </summary>
    public static class ImageProcessingUtility
    {
        public static ImageProcessing.PageImageLocation GetLocation (this PrnPolicyItemBase policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("this PrnPolicyItemBase policy");
            }

            if (policy is PrnHeaderFooterPolicy)
            {
                return (policy as PrnHeaderFooterPolicy).GetLocation();
            }

            if (policy is PrnWatermarkPolicy)
            {
                return (policy as PrnWatermarkPolicy).GetLocation();
            }

            return ImageProcessing.PageImageLocation.Unknown;
        }

        public static ImageProcessing.PageImageLocation GetLocation (this PrnHeaderFooterPolicy headerFooter)
        {
            if (headerFooter == null)
            {
                throw new ArgumentNullException("this PrnHeaderFooterPolicy headerFooter");
            }

            switch (headerFooter.Type)
            {
                case PrnHeaderFooterPolicy.HeaderFooterType.Header:
                    {
                        switch (headerFooter.Location)
                        {
                            case PrnHeaderFooterPolicy.LocationType.Left:
                                return ImageProcessing.PageImageLocation.TopLeft;

                            case PrnHeaderFooterPolicy.LocationType.Center:
                                return ImageProcessing.PageImageLocation.TopCenter;

                            case PrnHeaderFooterPolicy.LocationType.Right:
                                return ImageProcessing.PageImageLocation.TopRight;

                            default:
                                return ImageProcessing.PageImageLocation.Unknown;
                        }
                    }

                case PrnHeaderFooterPolicy.HeaderFooterType.Footer:
                    {
                        switch (headerFooter.Location)
                        {
                            case PrnHeaderFooterPolicy.LocationType.Left:
                                return ImageProcessing.PageImageLocation.BottomLeft;

                            case PrnHeaderFooterPolicy.LocationType.Center:
                                return ImageProcessing.PageImageLocation.BottomCenter;

                            case PrnHeaderFooterPolicy.LocationType.Right:
                                return ImageProcessing.PageImageLocation.BottomRight;

                            default:
                                return ImageProcessing.PageImageLocation.Unknown;
                        }
                    }

                default:
                    return ImageProcessing.PageImageLocation.Unknown;
            }
        }

        public static ImageProcessing.PageImageLocation GetLocation (this PrnWatermarkPolicy watermark)
        {
            if (watermark == null)
            {
                throw new ArgumentNullException("this PrnWatermarkPolicy watermark");
            }

            switch (watermark.Location)
            {
                case PrnWatermarkPolicy.LocationType.TopLeft:
                    return ImageProcessing.PageImageLocation.TopLeft;

                case PrnWatermarkPolicy.LocationType.TopCenter:
                    return ImageProcessing.PageImageLocation.TopCenter;

                case PrnWatermarkPolicy.LocationType.TopRight:
                    return ImageProcessing.PageImageLocation.TopRight;

                case PrnWatermarkPolicy.LocationType.MiddleLeft:
                    return ImageProcessing.PageImageLocation.MiddleLeft;

                case PrnWatermarkPolicy.LocationType.MiddleCenter:
                    return ImageProcessing.PageImageLocation.MiddleCenter;

                case PrnWatermarkPolicy.LocationType.MiddleRight:
                    return ImageProcessing.PageImageLocation.MiddleRight;

                case PrnWatermarkPolicy.LocationType.BottomLeft:
                    return ImageProcessing.PageImageLocation.BottomLeft;

                case PrnWatermarkPolicy.LocationType.BottomCenter:
                    return ImageProcessing.PageImageLocation.BottomCenter;

                case PrnWatermarkPolicy.LocationType.BottomRight:
                    return ImageProcessing.PageImageLocation.BottomRight;

                default:
                    return ImageProcessing.PageImageLocation.Unknown;
            }
        }
    }
}
