namespace FXKIS.SmartWhere.Metadata
{
    using System;

    using Common.Extension;



    public class PrnInformation
    {
        #region Enumerations

        public enum ColorType
        {
            Unknown,
            Auto,
            Color,
            Grayscale
        }

        public enum DuplexType
        {
            Unknown,
            Simplex,
            DuplexLongEdge,
            DuplexShortEdge
        }

        public enum OrientationType
        {
            Unknown,
            Portrait,
            Landscape
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public const string DBValueColor             = @"C";
        public const string DBValueBlackWhite        = @"B";
        public const string DBValueSimplex           = @"S";
        public const string DBValueDuplexLongEdge    = @"DL";
        public const string DBValueDuplexShortEdge   = @"DS";
        public const short  DBValueJobStatusNormal   = 0;
        public const short  DBValueJobStatusApproval = 3;

        #endregion Constants :: Database Values



        #region Constants :: PDL Values

        public const int PageAnglePortrait  = 0;
        public const int PageAngleLandscape = 90;

        #endregion Constants :: PDL Values



        #region Constants :: Default Values

        public const int DefaultPages      = 1;
        public const int DefaultCopies     = 1;
        public const int DefaultNup        = 1;
        public const int DefaultResolution = 300;
        public const int DefaultRemainDays = 1;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumPages = 1;
        public const int MaximumPages = 9999;

        public const int MinimumCopies = 1;
        public const int MaximumCopies = 9999;

        public const int MinimumNup = 1;
        public const int MaximumNup = 64;

        public const int MinimumRemainDays = 1;
        public const int MaximumRemainDays = 1000;

        #endregion Constants :: Ranges



        #region Properties

        public DateTime        JobTime       { get; set; } // PJL: @DATE & @TIME
        public DateTime        ReceivedTime  { get; set; } // Server Received Time
        public string          UUID          { get; set; }
        public string          UserID        { get; set; } // PJL: @JOAU
        public string          SpoolName     { get; set; }
        public string          DocumentName  { get; set; } // PJL: @DNAME
        public int             TotalPages
        {
            get
            {
                return this._TotalPages;
            }
            set
            {
                if (value < PrnInformation.MinimumPages)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnInformation.MinimumPages));
                }

                if (value > PrnInformation.MaximumPages)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnInformation.MaximumPages));
                }

                this._TotalPages = value;
            }
        }
        private int _TotalPages = PrnInformation.DefaultPages;

        public int             Copies
        {
            get
            {
                return this._Copies;
            }
            set
            {
                if (value < PrnInformation.MinimumCopies)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnInformation.MinimumCopies));
                }

                if (value > PrnInformation.MaximumCopies)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnInformation.MaximumCopies));
                }

                this._Copies = value;
            }
        }
        private int _Copies = PrnInformation.DefaultCopies;

        public ColorType       ColorMode   { get; set; } // PCL-XL: (FXPC=1 : BW), (FXPC=3 : COLOR)
        public DuplexType      DuplexMode  { get; set; } // PJL: DUPLEX & BINDING
        public int             Resoulution { get; set; } // PCL-XL: UnitsPerMeasure
        public OrientationType Orientation { get; set; } // PCL-XL: PageAngle (by 1st page)
        public int             Nup
        {
            get
            {
                return this._Nup;
            }
            set
            {
                if (value < PrnInformation.MinimumNup)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnInformation.MinimumNup));
                }

                if (value > PrnInformation.MaximumNup)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnInformation.MaximumNup));
                }

                this._Nup = value;
            }
        }
        private int _Nup = PrnInformation.DefaultNup; // PJL: FXJOBINFO NUP

        public string          UserIPAddress { get; set; }
        public string          Queue         { get; set; }
        private bool           IsApproval    { get; set; }
        private int            RemainDays    { get; set; }

        #endregion Properties



        #region Constructors

        public PrnInformation ()
        {
            this.InitializeProperties();
        }

        public PrnInformation (PrnInformation prnInfo) : this()
        {
            if (prnInfo == null)
            {
                throw new ArgumentNullException("PrnInformation prnInfo");
            }

            this.JobTime       = prnInfo.JobTime;
            this.ReceivedTime  = prnInfo.ReceivedTime;
            this.UUID          = prnInfo.UUID;
            this.UserID        = prnInfo.UserID;
            this.SpoolName     = prnInfo.SpoolName;
            this.DocumentName  = prnInfo.DocumentName;
            this.TotalPages    = prnInfo.TotalPages;
            this.Copies        = prnInfo.Copies;
            this.ColorMode     = prnInfo.ColorMode;
            this.DuplexMode    = prnInfo.DuplexMode;
            this.Resoulution   = prnInfo.Resoulution;
            this.Orientation   = prnInfo.Orientation;
            this.Nup           = prnInfo.Nup;
            this.UserIPAddress = prnInfo.UserIPAddress;
            this.Queue         = prnInfo.Queue;
            this.IsApproval    = prnInfo.IsApproval;
            this.RemainDays    = prnInfo.RemainDays;
        }
    
        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.JobTime       = DateTime.MinValue;
            this.ReceivedTime  = DateTime.MinValue;
            this.UUID          = string.Empty;
            this.UserID        = string.Empty;
            this.SpoolName     = string.Empty;
            this.DocumentName  = string.Empty;
            this.TotalPages    = PrnInformation.DefaultPages;
            this.Copies        = PrnInformation.DefaultCopies;
            this.ColorMode     = ColorType.Unknown;
            this.DuplexMode    = DuplexType.Unknown;
            this.Resoulution   = PrnInformation.DefaultResolution;
            this.Orientation   = OrientationType.Unknown;
            this.Nup           = PrnInformation.DefaultNup;
            this.UserIPAddress = string.Empty;
            this.Queue         = string.Empty;
            this.IsApproval    = false;
            this.RemainDays    = PrnInformation.DefaultRemainDays;
        }

        #endregion Methods :: Initialize



        #region Methods :: Getter & Setters

        public void SetApproval (bool approval)
        {
            this.IsApproval = approval;
        }

        public void SetRemainDays (int remainDays)
        {
            if (remainDays < PrnInformation.MinimumRemainDays)
            {
                throw new ArgumentOutOfRangeException("int remainDays", remainDays, string.Format("value is less than Minimum ({0} < {1})", remainDays, PrnInformation.MinimumRemainDays));
            }

            if (remainDays > PrnInformation.MaximumRemainDays)
            {
                throw new ArgumentOutOfRangeException("int remainDays", remainDays, string.Format("value is greater than Maximum ({0} > {1})", remainDays, PrnInformation.MaximumRemainDays));
            }

            this.RemainDays = remainDays;
        }

        public void SetOrientationByPageAngle (int angle)
        {
            switch (angle)
            {
                case PrnInformation.PageAnglePortrait:
                    this.Orientation = OrientationType.Portrait;
                    break;

                case PrnInformation.PageAngleLandscape:
                    this.Orientation = OrientationType.Landscape;
                    break;

                default:
                    throw new NotSupportedException(string.Format("This Angle value is not supported to Orientaion (ANGLE: {0})", angle));
            }
        }

        public bool GetApproval ()
        {
            return this.IsApproval;
        }

        public short GetJobStatus ()
        {
            if (this.IsApproval == true)
            {
                return PrnInformation.DBValueJobStatusApproval;
            }

            return PrnInformation.DBValueJobStatusNormal;
        }

        public int GetRemainDays ()
        {
            return this.RemainDays;
        }

        #endregion Methods :: Getter & Setters



        #region Methods

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
