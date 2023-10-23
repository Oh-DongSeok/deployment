namespace FXKIS.SmartWhere.Policy
{
    using System;

    using Common.Extension;



    public class PrnPrintOptionPolicy : PrnPolicyItemBase
    {
        #region Enumerations

        public enum ForceDuplexType
        {
            Unknown,
            Simplex,
            DuplexLongEdge,
            DuplexShortEdge
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public struct DatabaseValue
        {
            public const string Simplex         = @"S";
            public const string DuplexLongEdge  = @"DL";
            public const string DuplexShortEdge = @"DS";
        }

        #endregion Constants :: Database Values



        #region Constants :: Default Values

        public const bool            DefaultForceBlackWhite  = false;
        public const bool            DefaultForce2Up         = false;
        public const ForceDuplexType DefaultForceDuplex      = ForceDuplexType.Simplex;
        public const bool            DefaultMassChecked      = false;
        public const bool            DefaultColorChecked     = false;
        public const bool            DefaultTonerSave        = false;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        // PROPERTY "MassLimit" :: default 1 page (range: 0 ~ 9999 pages)
        public const int MinimumMassLimit = 0;
        public const int DefaultMassLimit = 1;
        public const int MaximumMassLimit = 9999;

        // PROPERTY "ColorLimit" :: default 1 page (range: 0 ~ 9999 pages)
        public const int MinimumColorLimit = 0;
        public const int DefaultColorLimit = 1;
        public const int MaximumColorLimit = 9999;

        // PROPERTY "RemainDays" :: default 1 day (range: 1 ~ 1000 days)
        public const int MinimumRemainDays = 1;
        public const int DefaultRemainDays = 1;
        public const int MaximumRemainDays = 1000;

        #endregion Constants :: Ranges



        #region Properties 

        public string          Title           { get; set; }
        public bool            ForceBlackWhite { get; set; }
        public bool            Force2Up        { get; set; }
        public ForceDuplexType ForceDuplex     { get; set; }

        public bool            MassChecked     { get; set; }
        public int             MassLimit
        {
            get
            {
                return this._MassLimit;
            }
            set
            {
                if (value < PrnPrintOptionPolicy.MinimumMassLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnPrintOptionPolicy.MinimumMassLimit));
                }

                if (value > PrnPrintOptionPolicy.MaximumMassLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnPrintOptionPolicy.MaximumMassLimit));
                }

                this._MassLimit = value;
            }
        }
        private int _MassLimit = PrnPrintOptionPolicy.DefaultMassLimit;

        public bool            ColorChecked    { get; set; }
        public int             ColorLimit
        {
            get
            {
                return this._ColorLimit;
            }
            set
            {
                if (value < PrnPrintOptionPolicy.MinimumColorLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnPrintOptionPolicy.MinimumColorLimit));
                }

                if (value > PrnPrintOptionPolicy.MaximumColorLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnPrintOptionPolicy.MaximumColorLimit));
                }

                this._ColorLimit = value;
            }
        }
        private int _ColorLimit = PrnPrintOptionPolicy.DefaultColorLimit;

        public bool            TonerSave       { get; set; }
        public int             RemainDays
        {
            get
            {
                return this._RemainDays;
            }
            set
            {
                if (value < PrnPrintOptionPolicy.MinimumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PrnPrintOptionPolicy.MinimumRemainDays));
                }

                if (value > PrnPrintOptionPolicy.MaximumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PrnPrintOptionPolicy.MaximumRemainDays));
                }

                this._RemainDays = value;
            }
        }
        private int _RemainDays = PrnPrintOptionPolicy.DefaultRemainDays;

        #endregion Properties



        #region Constructors

        public PrnPrintOptionPolicy () : base()
        {
        }

        public PrnPrintOptionPolicy (PrnPrintOptionPolicy printOption) : this()
        {
            if (printOption == null)
            {
                throw new ArgumentNullException("PrnPrintOptionPolicy printOption");
            }

            this.SetValue(printOption);
        }

        #endregion Constructors



        #region Methods :: Initialize

        protected override void InitializeProperties ()
        {
            this.IsEnabled       = false;
            this.Title           = string.Empty;
            this.ForceBlackWhite = PrnPrintOptionPolicy.DefaultForceBlackWhite;
            this.Force2Up        = PrnPrintOptionPolicy.DefaultForce2Up;
            this.ForceDuplex     = PrnPrintOptionPolicy.DefaultForceDuplex;
            this.MassChecked     = PrnPrintOptionPolicy.DefaultMassChecked;
            this.MassLimit       = PrnPrintOptionPolicy.DefaultMassLimit;
            this.ColorChecked    = PrnPrintOptionPolicy.DefaultColorChecked;
            this.ColorLimit      = PrnPrintOptionPolicy.DefaultColorLimit;
            this.TonerSave       = PrnPrintOptionPolicy.DefaultTonerSave;
            this.RemainDays      = PrnPrintOptionPolicy.DefaultRemainDays;
        }

        protected override void InitializeCollections ()
        {
        }

        #endregion Methods :: Initialize



        #region Methods

        public void SetValue (PrnPrintOptionPolicy po)
        {
            if (po == null)
            {
                throw new ArgumentNullException("PrnPrintOptionPolicy printOption");
            }

            this.IsEnabled       = po.IsEnabled;
            this.Title           = po.Title;
            this.ForceBlackWhite = po.ForceBlackWhite;
            this.Force2Up        = po.Force2Up;
            this.ForceDuplex     = po.ForceDuplex;
            this.MassChecked     = po.MassChecked;
            this.MassLimit       = po.MassLimit;
            this.ColorChecked    = po.ColorChecked;
            this.ColorLimit      = po.ColorLimit;
            this.TonerSave       = po.TonerSave;
            this.RemainDays      = po.RemainDays;
        }

        [Obsolete]
        public override string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime)
        {
            throw new NotImplementedException();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static ForceDuplexType ToForceDuplex (string forceDuplex)
        {
            if (string.IsNullOrWhiteSpace(forceDuplex) == true)
            {
                throw new ArgumentNullException("string forceDuplex");
            }

            forceDuplex = forceDuplex.Trim();

            try
            {
                switch (forceDuplex.ToUpper())
                {

                    case PrnPrintOptionPolicy.DatabaseValue.Simplex:
                        return ForceDuplexType.Simplex;

                    case PrnPrintOptionPolicy.DatabaseValue.DuplexLongEdge:
                        return ForceDuplexType.DuplexLongEdge;

                    case PrnPrintOptionPolicy.DatabaseValue.DuplexShortEdge:
                        return ForceDuplexType.DuplexShortEdge;

                    default:
                        return ForceDuplexType.Unknown;
                }
            }
            catch
            {
                return ForceDuplexType.Unknown;
            }
        }

        #endregion Static Methods
    }
}
