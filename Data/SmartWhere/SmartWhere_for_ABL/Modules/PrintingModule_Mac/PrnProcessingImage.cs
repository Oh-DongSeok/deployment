namespace FXKIS.SmartWhere.PrintingModule.Mac
{
    using Common.Extension;
    using PDL.Image;
    using Policy;

    public class PrnProcessingImage
    {
        #region Enumerations

        public enum ImageType
        {
            Unknown,
            HeaderFooter,
            Watermark
        }

        #endregion Enumerations
        

        #region Properties

        
        public string ImagePath            { get; set; }
        public float  ScalePercent         { get; set; }
        public bool   Grid                 { get; set; } // 격자식표시
        public int    AdjustmentHorizontal { get; set; } // 좌우미세조정
        public int    AdjustmentVertical   { get; set; } // 상하미세조정
        public bool   HasImageProcessing   { get; set; }

        public ImageType Type { get; set; }

        public ImageProcessing.PageImageLocation Location       { get; set; }       
        public PrnWatermarkPolicy.PageRepeatType PageRepeatType { get; set; } // 반복 설정
        

        #endregion Properties

        
        #region Constructors

        public PrnProcessingImage()
        {
            this.InitializeProperties();
        }

        #endregion Constructors
        

        #region Methods

        private void InitializeProperties()
        {
            this.Type                 = ImageType.Unknown;
            this.ImagePath            = string.Empty;
            this.Location             = ImageProcessing.PageImageLocation.Unknown;
            this.ScalePercent         = 100.0F;
            this.Grid                 = false;
            this.PageRepeatType       = PrnWatermarkPolicy.PageRepeatType.Unknown;
            this.AdjustmentHorizontal = 0;
            this.AdjustmentVertical   = 0;
            this.HasImageProcessing   = false;
        }

        public override string ToString()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
