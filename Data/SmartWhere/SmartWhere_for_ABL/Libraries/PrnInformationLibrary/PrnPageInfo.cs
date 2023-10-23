namespace FXKIS.PDL
{
    using System;
    using System.Drawing;



    /**********************************************************************************************//**
     * <summary> PRN 문서의 페이지 데이터를 제공하는 클래스.</summary>
     *
     * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
     **************************************************************************************************/
    public class PrnPageInfo
    {
        #region Enumerations

        /**********************************************************************************************//**
         * <summary> 해상도 종류의 표현에 대한 열거형 상수의 집합.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         **************************************************************************************************/
        public enum ResolutionType
        {
            None    = 0,
            DPI200  = 200,
            DPI300  = 300,
            DPI600  = 600,
            DPI1200 = 1200
        }

        #endregion Enumerations



        #region Properties

        public uint           CurrentPageNumber { get; set; }
        public ResolutionType Resolution        { get; set; }
        public Size           PaperSize         { get; set; }
        public int            PaperCode         { get; set; }
        public int            PaperSpace        { get; set; }
        public int            PageSpace         { get; set; }
        public Point          PixelPerMM        { get; set; }

        #endregion Properties



        #region Constructrors

        /**********************************************************************************************//**
         * <summary> PrnPageInfo 클래스의 생성자.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         **************************************************************************************************/
        public PrnPageInfo()
        {
            this.InitProperties();
        }

        #endregion Constructors



        #region Methods

        /**********************************************************************************************//**
         * <summary> 객체의 속성을 초기화한다.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         **************************************************************************************************/
        public void InitProperties()
        {
            this.CurrentPageNumber = 1;
            this.Resolution        = ResolutionType.None;
            this.PaperSize         = Size.Empty;
            this.PaperCode         = 0;
            this.PaperSpace        = 0;
            this.PageSpace         = 0;
            this.PixelPerMM        = new Point(0, 0);
        }

        /**********************************************************************************************//**
         * <summary> Sets a resolution.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <exception cref="ArgumentNullException"> Thrown when one or more required arguments are null.</exception>
         * <exception cref="ArgumentException">     Thrown when one or more arguments have unsupported or
         *                                          illegal values.</exception>
         *
         * <param name="item"> The item.</param>
         **************************************************************************************************/
        public void SetResolution (PCLXLAttributeItem item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("PCLXLAttributeItem item is null");
            }

            if (item.ValueUInt16 == null || item.ValueUInt16.Length < 1)
            {
                throw new ArgumentException("Atttribute's Value is wrong");
            }

            ushort value = 0;

            switch (item.ValueTag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.XYUInt16:
                    value = item.ValueUInt16[0];
                    break;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }

            this.Resolution = PrnPageInfo.GetResolutionType(value);

            this.PaperSpace = PrnPageInfo.GetPaperSpace (this.Resolution);
            this.PageSpace  = PrnPageInfo.GetPageSpace  (this.Resolution);
            this.PixelPerMM = PrnPageInfo.GetPixelPerMM (this.Resolution);
        }

        /**********************************************************************************************//**
         * <summary> Sets paper size.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-24.</remarks>
         *
         * <exception cref="NotImplementedException"> Thrown when the requested operation is unimplemented.</exception>
         *
         * <param name="item"> The item.</param>
         **************************************************************************************************/
        public void SetPaperSize (PCLXLAttributeItem item)
        {
            int index = Constants.MediaSizeInfo.MEDIA_SIZE_ARRAY;
            
            switch (this.Resolution)
            {
                case ResolutionType.DPI200:
                    index *= 0;
                    break;

                case ResolutionType.DPI300:
                    index *= 1;
                    break;

                case ResolutionType.DPI600:
                    index *= 2;
                    break;

                case ResolutionType.DPI1200:
                    index *= 3;
                    break;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }

            this.PaperCode = Constants.MediaSizeInfo.EA4PAPER;

            if (item.ValueByte == null)
            {
                throw new ArgumentException("Atttribute's Value is wrong");
            }

            switch (item.ValueTag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.SingleUByte:
                    {
                        if (item.ValueByte.Length < 1)
                        {
                            throw new ArgumentException("Atttribute's Value is wrong");
                        }

                        this.PaperCode = item.ValueByte[0];
                    }
                    break;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }

            for (int i = 0; i < Constants.MediaSizeInfo.MEDIA_SIZE.Length; i++)
            {
                if (this.PaperCode == Constants.MediaSizeInfo.MEDIA_SIZE[i])
                {
                    this.PaperSize = new Size(Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 0] + this.PaperSpace,
                                              Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 1] + this.PaperSpace);
                    return;
                }

                if (i == Constants.MediaSizeInfo.MEDIA_SIZE.Length - 1)
                {
                    this.PaperSize = new Size(Constants.MediaSizeInfo.MEDIA_SIZE_INFO[Constants.MediaSizeInfo.EA4PAPER + index, 0] + this.PaperSpace,
                                              Constants.MediaSizeInfo.MEDIA_SIZE_INFO[Constants.MediaSizeInfo.EA4PAPER + index, 1] + this.PaperSpace);
                }
            }
        }

        /**********************************************************************************************//**
         * <summary> Check resolution type.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-25.</remarks>
         *
         * <param name="value"> The value.</param>
         *
         * <returns> A ResoultionType.</returns>
         **************************************************************************************************/
        public static ResolutionType GetResolutionType (ushort value)
        {
            ResolutionType type = (ResolutionType)value;

            switch (type)
            {
                case ResolutionType.DPI200:
                case ResolutionType.DPI300:
                case ResolutionType.DPI600:
                case ResolutionType.DPI1200:
                    return type;

                default:
                    return ResolutionType.None;
            }
        }

        /**********************************************************************************************//**
         * <summary> Gets paper space.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-25.</remarks>
         *
         * <exception cref="ArgumentException"> Thrown when one or more arguments have unsupported or
         *                                      illegal values.</exception>
         *
         * <param name="resolution"> The resolution.</param>
         *
         * <returns> The paper space.</returns>
         **************************************************************************************************/
        public static int GetPaperSpace (ResolutionType resolution)
        {
            switch (resolution)
            {
                case ResolutionType.DPI200:
                    return Constants.PageInfo.PaperSpace.DPI200;

                case ResolutionType.DPI300:
                    return Constants.PageInfo.PaperSpace.DPI300;

                case ResolutionType.DPI600:
                    return Constants.PageInfo.PaperSpace.DPI600;

                case ResolutionType.DPI1200:
                    return Constants.PageInfo.PaperSpace.DPI1200;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }
        }

        /**********************************************************************************************//**
         * <summary> Gets page space.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-25.</remarks>
         *
         * <exception cref="ArgumentException"> Thrown when one or more arguments have unsupported or
         *                                      illegal values.</exception>
         *
         * <param name="resolution"> The resolution.</param>
         *
         * <returns> The page space.</returns>
         **************************************************************************************************/
        public static int GetPageSpace (ResolutionType resolution)
        {
            switch (resolution)
            {
                case ResolutionType.DPI200:
                    return Constants.PageInfo.PageSpace.DPI200;

                case ResolutionType.DPI300:
                    return Constants.PageInfo.PageSpace.DPI300;

                case ResolutionType.DPI600:
                    return Constants.PageInfo.PageSpace.DPI600;

                case ResolutionType.DPI1200:
                    return Constants.PageInfo.PageSpace.DPI1200;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }
        }

        public static int GetPrintSpace (ResolutionType resolution)
        {
            switch (resolution)
            {
                case ResolutionType.DPI200:
                    return Constants.PageInfo.PrintSpace.DPI200;

                case ResolutionType.DPI300:
                    return Constants.PageInfo.PrintSpace.DPI300;

                case ResolutionType.DPI600:
                    return Constants.PageInfo.PrintSpace.DPI600;

                case ResolutionType.DPI1200:
                    return Constants.PageInfo.PrintSpace.DPI1200;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }
        }

        public static double GetImageScale (PrnPageInfo.ResolutionType resolution)
        {
            switch (resolution)
            {
                case ResolutionType.DPI200:
                    return Constants.PageInfo.ImageScale.DPI200;

                case ResolutionType.DPI300:
                    return Constants.PageInfo.ImageScale.DPI300;

                case ResolutionType.DPI600:
                    return Constants.PageInfo.ImageScale.DPI600;

                case ResolutionType.DPI1200:
                    return Constants.PageInfo.ImageScale.DPI1200;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }
        }

        /**********************************************************************************************//**
         * <summary> Gets pixel per millimetres.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-11-25.</remarks>
         *
         * <exception cref="ArgumentException"> Thrown when one or more arguments have unsupported or
         *                                      illegal values.</exception>
         *
         * <param name="resolution"> The resolution.</param>
         *
         * <returns> The pixel per millimetres.</returns>
         **************************************************************************************************/
        public static Point GetPixelPerMM (ResolutionType resolution)
        {
            Point point = new Point();

            switch (resolution)
            {
                case ResolutionType.DPI200:
                    point.X = Constants.PageInfo.PixelPerMM.DPI200.X;
                    point.Y = Constants.PageInfo.PixelPerMM.DPI200.Y;
                    break;

                case ResolutionType.DPI300:
                    point.X = Constants.PageInfo.PixelPerMM.DPI300.X;
                    point.Y = Constants.PageInfo.PixelPerMM.DPI300.Y;
                    break;

                case ResolutionType.DPI600:
                    point.X = Constants.PageInfo.PixelPerMM.DPI600.X;
                    point.Y = Constants.PageInfo.PixelPerMM.DPI600.Y;
                    break;

                case ResolutionType.DPI1200:
                    point.X = Constants.PageInfo.PixelPerMM.DPI1200.X;
                    point.Y = Constants.PageInfo.PixelPerMM.DPI1200.Y;
                    break;

                default:
                    throw new ArgumentException("Atttribute's Value is wrong");
            }

            return point;
        }

        #endregion Methods
    }
}
