namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class PrintingModuleEnvironment
    {
        #region Constants :: Default Values

        public const string DefaultNameForMMD2         = @"SmartWhere_PrintingModule.exe";
        public const string DefaultNameForMobile       = @"SmartWhere_PrintingModule_Mobile.exe";
        public const string DefaultNameForMac          = @"SmartWhere_PrintingModule_Mac.exe";
        public const int    DefaultPort                = 9100;
        public const bool   DefaultUseMMD2             = true;
        public const bool   DefaultUseMobile           = true;
        public const bool   DefaultUseMac              = true;
        public const bool   DefaultUsePrintingByDevice = true;
        public const bool   DefaultUsePrintingByFile   = false;

        #endregion Constants :: Default Values



        #region Properties

        public string NameForMMD2   { get; set; }
        public string NameForMobile { get; set; }
        public string NameForMac    { get; set; }

        public int    PortForMMD2
        {
            get
            {
                return this._PortForMMD2;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 0 ({0} < {1})", value, 0));
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than 65535 ({0} > {1})", value, 65535));
                }

                this._PortForMMD2 = value;
            }
        }
        private int _PortForMMD2 = PrintingModuleEnvironment.DefaultPort;

        public int    PortForMobile
        {
            get
            {
                return this._PortForMobile;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 0 ({0} < {1})", value, 0));
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than 65535 ({0} > {1})", value, 65535));
                }

                this._PortForMobile = value;
            }
        }
        private int _PortForMobile = PrintingModuleEnvironment.DefaultPort;

        public int    PortForMac
        {
            get
            {
                return this._PortForMac;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 0 ({0} < {1})", value, 0));
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than 65535 ({0} > {1})", value, 65535));
                }

                this._PortForMac = value;
            }
        }
        private int _PortForMac = PrintingModuleEnvironment.DefaultPort;

        public bool   UseMMD2             { get; set; }
        public bool   UseMobile           { get; set; }
        public bool   UseMac              { get; set; }
        public bool   UsePrintingByDevice { get; set; }
        public bool   UsePrintingByFile   { get; set; }

        #endregion Properties



        #region Constructors

        public PrintingModuleEnvironment ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.NameForMMD2         = PrintingModuleEnvironment.DefaultNameForMMD2;
            this.NameForMobile       = PrintingModuleEnvironment.DefaultNameForMobile;
            this.NameForMac          = PrintingModuleEnvironment.DefaultNameForMac;
            this.PortForMMD2         = PrintingModuleEnvironment.DefaultPort;
            this.PortForMobile       = PrintingModuleEnvironment.DefaultPort;
            this.PortForMac          = PrintingModuleEnvironment.DefaultPort;
            this.UseMMD2             = PrintingModuleEnvironment.DefaultUseMMD2;
            this.UseMobile           = PrintingModuleEnvironment.DefaultUseMobile;
            this.UseMac              = PrintingModuleEnvironment.DefaultUseMac;
            this.UsePrintingByDevice = PrintingModuleEnvironment.DefaultUsePrintingByDevice;
            this.UsePrintingByFile   = PrintingModuleEnvironment.DefaultUsePrintingByFile;
        }

        #endregion Methods
    }
}