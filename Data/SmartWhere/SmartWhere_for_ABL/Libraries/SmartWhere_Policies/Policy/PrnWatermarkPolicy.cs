namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.IO;

    using Common.Extension;



    public class PrnWatermarkPolicy : PrnPolicyItemBase
    {
        #region Enumerations

        public enum WatermarkType
        {
            Unknown,
            Image,
            Text
        }

        public enum LocationType
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

        public enum PageRepeatType
        {
            Unknown,
            First,
            FirstAndLast,
            All
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public const string DBValueTypeImage                  = @"I";
        public const string DBValueTypeText                   = @"T";

        public const string DBValueLocationTypeTopLeft        = @"TL";
        public const string DBValueLocationTypeTopCenter      = @"TC";
        public const string DBValueLocationTypeTopRight       = @"TR";
        public const string DBValueLocationTypeMiddleLeft     = @"ML";
        public const string DBValueLocationTypeMiddleCenter   = @"MC";
        public const string DBValueLocationTypeMiddleRight    = @"MR";
        public const string DBValueLocationTypeBottomLeft     = @"BL";
        public const string DBValueLocationTypeBottomCenter   = @"BC";
        public const string DBValueLocationTypeBottomRight    = @"BR";

        public const string DBValuePageRepetitionFirst        = @"I";
        public const string DBValuePageRepetitionFirstAndLast = @"B";
        public const string DBValuePageRepetitionAll          = @"A";

        #endregion Constants :: Database Values



        #region Constants :: Default Values

        public const WatermarkType  DefaultType           = WatermarkType.Image;
        public const LocationType   DefaultLocation       = LocationType.MiddleCenter;
        public const PageRepeatType DefaultPageRepetition = PageRepeatType.First;
        public const int            DefaultTransparency   = 100;
        public const bool           DefaultGrid           = false;
        public const int            DefaultAngle          = 0;
        public const int            DefaultAdjustment     = 0;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumTransparency = 0;
        public const int MaximumTransparency = 100;

        public const int MinimumAngle        = -90;
        public const int MaximumAngle        =  90;

        public const int MinimumAdjustment = -100;
        public const int MaximumAdjustment =  100;

        #endregion Constants :: Ranges



        #region Properties

        public WatermarkType            Type                 { get; set; }
        public LocationType             Location             { get; set; }
        public string                   Title                { get; set; }
        public ImageItem                ImageInfo            { get; set; }
        public TextItem                 TextInfo             { get; set; }
        public WatermarkFontInformation Font                 { get; set; }
        public int                      Transparency
        {
            get
            {
                return this._Transparency;
            }
            set
            {
                if (value < PrnWatermarkPolicy.MinimumTransparency)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum Value ({0} < {1})", value, PrnWatermarkPolicy.MinimumTransparency));
                }
                if (value > PrnWatermarkPolicy.MaximumTransparency)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greter than Maximum Value ({0} < {1})", value, PrnWatermarkPolicy.MaximumTransparency));
                }

                this._Transparency = value;
            }
        }
        private int _Transparency = PrnWatermarkPolicy.DefaultTransparency;
        
        public PageRepeatType           PageRepetition       { get; set; }
        public bool                     Grid                 { get; set; }
        public int                      Angle
        {
            get
            {
                return this._Angle;
            }
            set
            {
                if (value < PrnWatermarkPolicy.MinimumAngle)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum Value ({0} < {1})", value, PrnWatermarkPolicy.MinimumAngle));
                }
                if (value > PrnWatermarkPolicy.MaximumAngle)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greter than Maximum Value ({0} < {1})", value, PrnWatermarkPolicy.MaximumAngle));
                }

                this._Angle = value;
            }
        }
        private int _Angle = PrnWatermarkPolicy.DefaultAngle;

        public int                      AdjustmentHorizontal
        {
            get
            {
                return this._AdjustmentHorizontal;
            }
            set
            {
                if (value < PrnWatermarkPolicy.MinimumAdjustment)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum Value ({0} < {1})", value, PrnWatermarkPolicy.MinimumAdjustment));
                }
                if (value > PrnWatermarkPolicy.MaximumAdjustment)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greter than Maximum Value ({0} < {1})", value, PrnWatermarkPolicy.MaximumAdjustment));
                }

                this._AdjustmentHorizontal = value;
            }
        }
        private int _AdjustmentHorizontal = PrnWatermarkPolicy.DefaultAdjustment;

        public int                      AdjustmentVertical
        {
            get
            {
                return this._AdjustmentVertical;
            }
            set
            {
                if (value < PrnWatermarkPolicy.MinimumAdjustment)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum Value ({0} < {1})", value, PrnWatermarkPolicy.MinimumAdjustment));
                }
                if (value > PrnWatermarkPolicy.MaximumAdjustment)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greter than Maximum Value ({0} < {1})", value, PrnWatermarkPolicy.MaximumAdjustment));
                }

                this._AdjustmentVertical = value;
            }
        }
        private int _AdjustmentVertical = PrnWatermarkPolicy.DefaultAdjustment;

        public bool ImageProcessingApplied { get; set; }

        #endregion Properties



        #region Constructors

        public PrnWatermarkPolicy () : base()
        {
        }

        #endregion Constructors



        #region Methods :: Initialize

        protected override void InitializeProperties ()
        {
            this.IsEnabled              = false;
            this.Type                   = PrnWatermarkPolicy.DefaultType;
            this.Location               = PrnWatermarkPolicy.DefaultLocation;
            this.Title                  = string.Empty;
            this.ImageInfo              = null;
            this.TextInfo               = null;
            this.Font                   = null;
            this.Transparency           = PrnWatermarkPolicy.DefaultTransparency;
            this.PageRepetition         = PrnWatermarkPolicy.DefaultPageRepetition;
            this.Grid                   = PrnWatermarkPolicy.DefaultGrid;
            this.Angle                  = PrnWatermarkPolicy.DefaultAngle;
            this.AdjustmentHorizontal   = PrnWatermarkPolicy.DefaultAdjustment;
            this.AdjustmentVertical     = PrnWatermarkPolicy.DefaultAdjustment;
            this.ImageProcessingApplied = false;
        }

        protected override void InitializeCollections ()
        {
        }

        #endregion Methods :: Initialize



        #region Methods

        public override string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime)
        {
            if (string.IsNullOrWhiteSpace(ipAddress) == true)
            {
                throw new ArgumentNullException("string ipAddress");
            }

            if (string.IsNullOrWhiteSpace(userID) == true)
            {
                throw new ArgumentNullException("string userID");
            }

            if (string.IsNullOrWhiteSpace(documentName) == true)
            {
                throw new ArgumentNullException("documentName");
            }

            if (this.Type != WatermarkType.Text)
            {
                throw new NotSupportedException(string.Format("This Operation is not supported in the current type (TYPE: {0})", this.Type.ToString()));
            }

            try
            {
                switch (this.TextInfo.Type)
                {
                    case TextItem.TextType.PCTime:
                        return this.TextInfo.GetLocalTimeStringKT(rcdTime);

                    case TextItem.TextType.DocumentName:
                        return documentName;

                    case TextItem.TextType.UserID:
                        return userID;

                    case TextItem.TextType.IPAddress:
                        return this.TextInfo.GetMaskedIPAddress(ipAddress);

                    case TextItem.TextType.CustomString:
                        return this.TextInfo.CustomString;

                    default:
                        return string.Empty;
                }
            }
            catch
            {
                return string.Empty;
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static WatermarkType ToType (string strType)
        {
            if (string.IsNullOrWhiteSpace(strType) == true)
            {
                throw new ArgumentNullException("string strType");
            }

            strType = strType.Trim();

            try
            {
                switch (strType.ToUpper())
                {

                    case PrnWatermarkPolicy.DBValueTypeImage:
                        return WatermarkType.Image;

                    case PrnWatermarkPolicy.DBValueTypeText:
                        return WatermarkType.Text;

                    default:
                        return WatermarkType.Unknown;
                }
            }
            catch
            {
                return WatermarkType.Unknown;
            }
        }

        public static LocationType ToLocation (string strLocation)
        {
            if (string.IsNullOrWhiteSpace(strLocation) == true)
            {
                throw new ArgumentNullException("string strLocation");
            }

            strLocation = strLocation.Trim();

            try
            {
                switch (strLocation.ToUpper())
                {
                    case PrnWatermarkPolicy.DBValueLocationTypeTopLeft:
                        return LocationType.TopLeft;

                    case PrnWatermarkPolicy.DBValueLocationTypeTopCenter:
                        return LocationType.TopCenter;

                    case PrnWatermarkPolicy.DBValueLocationTypeTopRight:
                        return LocationType.TopRight;

                    case PrnWatermarkPolicy.DBValueLocationTypeMiddleLeft:
                        return LocationType.MiddleLeft;

                    case PrnWatermarkPolicy.DBValueLocationTypeMiddleCenter:
                        return LocationType.MiddleCenter;

                    case PrnWatermarkPolicy.DBValueLocationTypeMiddleRight:
                        return LocationType.MiddleRight;

                    case PrnWatermarkPolicy.DBValueLocationTypeBottomLeft:
                        return LocationType.BottomLeft;

                    case PrnWatermarkPolicy.DBValueLocationTypeBottomCenter:
                        return LocationType.BottomCenter;

                    case PrnWatermarkPolicy.DBValueLocationTypeBottomRight:
                        return LocationType.BottomRight;

                    default:
                        return LocationType.Unknown;
                }
            }
            catch
            {
                return LocationType.Unknown;
            }
        }

        public static PageRepeatType ToPageRepetition (string strRepetition)
        {
            if (string.IsNullOrWhiteSpace(strRepetition) == true)
            {
                throw new ArgumentNullException("string strRepetition");
            }

            strRepetition = strRepetition.Trim();

            try
            {
                switch (strRepetition.ToUpper())
                {
                    case PrnWatermarkPolicy.DBValuePageRepetitionFirst:
                        return PageRepeatType.First;
                    case PrnWatermarkPolicy.DBValuePageRepetitionFirstAndLast:
                        return PageRepeatType.FirstAndLast;
                    case PrnWatermarkPolicy.DBValuePageRepetitionAll:
                        return PageRepeatType.All;

                    default:
                        return PageRepeatType.Unknown;
                }
            }
            catch
            {
                return PageRepeatType.Unknown;
            }
        }

        public void SetProcessingImage (string pathModified)
        {
            if (string.IsNullOrWhiteSpace(pathModified) == true)
            {
                throw new ArgumentNullException("string pathModified");
            }

            if (File.Exists(pathModified) == false)
            {
                throw new FileNotFoundException("Image file is not exists", pathModified);
            }

            if (this.ImageInfo == null)
            {
                this.ImageInfo = new ImageItem();
            }

            this.ImageInfo.FileName     = pathModified;
            this.ImageProcessingApplied = true;
        }

        #endregion Static Methods
    }
}
