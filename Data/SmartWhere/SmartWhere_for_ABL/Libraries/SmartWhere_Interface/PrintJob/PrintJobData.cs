namespace FXKIS.SmartWhere.CommonIF.Constants
{
    #region Constants

    public struct DriverType
    {
        public const string MMD2      = @"SWPRN_MMD2";
        public const string Mobile    = @"MOBILE";
        public const string MobilePCL = @"MOBILE_PCL";
        public const string MacOS     = @"MACOS";
    }

    #endregion Constants
}

namespace FXKIS.SmartWhere.CommonIF
{
    using Common.Extension;



    public class PrintJobData
    {
        #region Enumerations

        public enum ColorType
        {
            Unknown,
            Color,
            BlackWhite
        }

        public enum DuplexType
        {
            Unknown,
            Simplex,
            DuplexLongEdge,
            DuplexShortEdge
        }
        public enum PrintDriverType
        {
            MMD2,
            Mobile,
            MobilePCL,
            MacOS,
            Unknown
        }

        #endregion Enumerations



        #region Properties

        public string     UUID            { get; set; }
        public string     SpoolFileName   { get; set; }
        public string     ClientIPAddress { get; set; }
        public string     DocumentName    { get; set; }
        public ColorType  Color           { get; set; }
        public DuplexType Duplex          { get; set; }
        public int        Nup             { get; set; }
        public int        Copies          { get; set; }
        public string     DriverType      { get; set; }
        public bool       PrnSave         { get; set; }

        public PrintDriverType Driver
        {
            get
            {
                try
                {
                    if (string.IsNullOrWhiteSpace(this.DriverType) == true)
                    {
                        return PrintDriverType.Unknown;
                    }

                    switch (this.DriverType.ToUpper())
                    {
                        case Constants.DriverType.MMD2:
                            return PrintDriverType.MMD2;

                        case Constants.DriverType.Mobile:
                            return PrintDriverType.Mobile;

                        case Constants.DriverType.MobilePCL:
                            return PrintDriverType.MobilePCL;

                        case Constants.DriverType.MacOS:
                            return PrintDriverType.MacOS;

                        default:
                            return PrintDriverType.Unknown;
                    }
                }
                catch
                {
                    return PrintDriverType.Unknown;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public PrintJobData ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.UUID            = string.Empty;
            this.SpoolFileName   = string.Empty;
            this.ClientIPAddress = string.Empty;
            this.DocumentName    = string.Empty;
            this.Color           = ColorType.Unknown;
            this.Duplex          = DuplexType.Unknown;
            this.Nup             = 1;
            this.Copies          = 1;
            this.DriverType      = string.Empty;
            this.PrnSave         = false;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}