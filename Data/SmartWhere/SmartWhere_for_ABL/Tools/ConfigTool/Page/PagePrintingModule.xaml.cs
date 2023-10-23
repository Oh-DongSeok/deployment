namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PagePrintingModule.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PagePrintingModule : PageBase
    {
        #region Constructors

        public PagePrintingModule () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Name For MMD2
            if (string.IsNullOrWhiteSpace(this.TxtNameForMMD2.Text) == true)
            {
                message = @"""NameForMMD2"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Port For MMD2
            if (this.NumPortForMMD2.HasValue == false)
            {
                message = @"""PortForMMD2"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Use MMD2
            if (this.ChkUseMMD2.IsChecked == null || this.ChkUseMMD2.IsChecked.HasValue == false)
            {
                message = @"""UseMMD2"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Name For Mobile
            if (string.IsNullOrWhiteSpace(this.TxtNameForMobile.Text) == true)
            {
                message = @"""NameForMobile"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Port For MMD2
            if (this.NumPortForMobile.HasValue == false)
            {
                message = @"""PortForMobile"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Use Mobile
            if (this.ChkUseMobile.IsChecked == null || this.ChkUseMobile.IsChecked.HasValue == false)
            {
                message = @"""UseMobile"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Name For MacOS
            if (string.IsNullOrWhiteSpace(this.TxtNameForMacOS.Text) == true)
            {
                message = @"""NameForMacOS"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Port For MacOS
            if (this.NumPortForMacOS.HasValue == false)
            {
                message = @"""PortForMacOS"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Use MacOS
            if (this.ChkUseMacOS.IsChecked == null || this.ChkUseMacOS.IsChecked.HasValue == false)
            {
                message = @"""UseMacOS"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Use Printing by Device
            if (this.ChkUsePrintingByDevice.IsChecked == null || this.ChkUsePrintingByDevice.IsChecked.HasValue == false)
            {
                message = @"""UsePrintingByDevice"" of PrintingModuleEnvironment is empty";
                return false;
            }

            // Use Printing by File
            if (this.ChkUsePrintingByFile.IsChecked == null || this.ChkUsePrintingByFile.IsChecked.HasValue == false)
            {
                message = @"""UsePrintingByFile"" of PrintingModuleEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(PrintingModuleEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not PrintingModuleEnvironment");
            }

            PrintingModuleEnvironment env = new PrintingModuleEnvironment();

            env.NameForMMD2   = this.TxtNameForMMD2.Text;
            env.PortForMMD2   = this.NumPortForMMD2.Port;
            env.UseMMD2       = this.ChkUseMMD2.IsChecked.Value;

            env.NameForMobile = this.TxtNameForMobile.Text;
            env.PortForMobile = this.NumPortForMobile.Port;
            env.UseMobile     = this.ChkUseMobile.IsChecked.Value;

            env.NameForMac    = this.TxtNameForMacOS.Text;
            env.PortForMac    = this.NumPortForMacOS.Port;
            env.UseMac        = this.ChkUseMacOS.IsChecked.Value;

            env.UsePrintingByDevice = this.ChkUsePrintingByDevice.IsChecked.Value;
            env.UsePrintingByFile   = this.ChkUsePrintingByFile.IsChecked.Value;

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is PrintingModuleEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not PrintingModuleEnvironment");
            }

            PrintingModuleEnvironment module = env as PrintingModuleEnvironment;

            this.TxtNameForMMD2.Text    = module.NameForMMD2;
            this.NumPortForMMD2.Port    = module.PortForMMD2;
            this.ChkUseMMD2.IsChecked   = module.UseMMD2;

            this.TxtNameForMobile.Text  = module.NameForMobile;
            this.NumPortForMobile.Port  = module.PortForMobile;
            this.ChkUseMobile.IsChecked = module.UseMobile;

            this.TxtNameForMacOS.Text   = module.NameForMac;
            this.NumPortForMacOS.Port   = module.PortForMac;
            this.ChkUseMacOS.IsChecked  = module.UseMac;

            this.ChkUsePrintingByDevice.IsChecked = module.UsePrintingByDevice;
            this.ChkUsePrintingByFile.IsChecked   = module.UsePrintingByFile;
        }

        public override void Clear ()
        {
            this.TxtNameForMMD2.Text   = string.Empty;
            this.TxtNameForMobile.Text = string.Empty;
            this.TxtNameForMacOS.Text  = string.Empty;

            this.NumPortForMMD2.Clear();
            this.NumPortForMobile.Clear();
            this.NumPortForMacOS.Clear();

            this.ChkUseMMD2.IsChecked   = false;
            this.ChkUseMobile.IsChecked = false;
            this.ChkUseMacOS.IsChecked  = false;

            this.ChkUsePrintingByDevice.IsChecked = PrintingModuleEnvironment.DefaultUsePrintingByDevice;
            this.ChkUsePrintingByFile.IsChecked   = PrintingModuleEnvironment.DefaultUsePrintingByFile;
        }

        #endregion Methods
    }
}