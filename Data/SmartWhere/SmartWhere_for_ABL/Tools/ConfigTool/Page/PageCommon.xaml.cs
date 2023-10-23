namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageCommon.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageCommon : PageBase
    {
        #region Constructors

        public PageCommon ()
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
            // PathSmartWhereDataRootDirectory
            if (string.IsNullOrWhiteSpace(this.TxtRootDataDirectory.Text) == true)
            {
                message = @"""PathSmartWhereDataRootDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathSpoolDirectory
            if (string.IsNullOrWhiteSpace(this.TxtSpoolDirectory.Text) == true)
            {
                message = @"""PathSpoolDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathErrorSpoolDirectory
            if (string.IsNullOrWhiteSpace(this.TxtErrorSpoolDirectory.Text) == true)
            {
                message = @"""PathErrorSpoolDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathMetadataDirectory
            if (string.IsNullOrWhiteSpace(this.TxtMetadataDirectory.Text) == true)
            {
                message = @"""PathMetadataDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathPrintJobDirectory
            if (string.IsNullOrWhiteSpace(this.TxtPrintJobDirectory.Text) == true)
            {
                message = @"""PathPrintJobDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathContingencyDirectory
            if (string.IsNullOrWhiteSpace(this.TxtContingencyDirectory.Text) == true)
            {
                message = @"""PathContingencyDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathFontDataDirectory
            if (string.IsNullOrWhiteSpace(this.TxtFontDataDirectory.Text) == true)
            {
                message = @"""PathFontDataDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathWatermarkImageDirectory
            if (string.IsNullOrWhiteSpace(this.TxtWatermarkImageDirectory.Text) == true)
            {
                message = @"""PathWatermarkImageDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathImageProcessingDirectory
            if (string.IsNullOrWhiteSpace(this.TxtImageProcessingDirectory.Text) == true)
            {
                message = @"""PathImageProcessingDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathApprovalProcessingDirectory
            if (string.IsNullOrWhiteSpace(this.TxtApprovalProcessingDirectory.Text) == true)
            {
                message = @"""PathApprovalProcessingDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathImageLogProcessingDirectory
            if (string.IsNullOrWhiteSpace(this.TxtImageLogProcessingDirectory.Text) == true)
            {
                message = @"""PathImageLogProcessingDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathPrintingByFileSpoolDirectory
            if (string.IsNullOrWhiteSpace(this.TxtPrintingByFileSpoolDirectory.Text) == true)
            {
                message = @"""PathPrintingByFileSpoolDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // PathLogDirectory
            if (string.IsNullOrWhiteSpace(this.TxtLogDirectory.Text) == true)
            {
                message = @"""PathLogDirectory"" of CommonEnvironment is empty";
                return false;
            }

            // LogLevel
            if (this.CmbLogLevel.Level == CommonEnvironment.LogLevelType.Unknown)
            {
                message = @"""LogLevel"" of CommonEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(CommonEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not CommonEnvironment");
            }

            CommonEnvironment common = new CommonEnvironment();

            common.PathSmartWhereDataRootDirectory  = this.TxtRootDataDirectory.Text;
            common.PathSpoolDirectory               = this.TxtSpoolDirectory.Text;
            common.PathErrorSpoolDirectory          = this.TxtErrorSpoolDirectory.Text;
            common.PathMetadataDirectory            = this.TxtMetadataDirectory.Text;
            common.PathPrintJobDirectory            = this.TxtPrintJobDirectory.Text;
            common.PathContingencyDirectory         = this.TxtContingencyDirectory.Text;
            common.PathFontDataDirectory            = this.TxtFontDataDirectory.Text;
            common.PathWatermarkImageDirectory      = this.TxtWatermarkImageDirectory.Text;
            common.PathImageProcessingDirectory     = this.TxtImageProcessingDirectory.Text;
            common.PathApprovalProcessingDirectory  = this.TxtApprovalProcessingDirectory.Text;
            common.PathImageLogProcessingDirectory  = this.TxtImageLogProcessingDirectory.Text;
            common.PathPrintingByFileSpoolDirectory = this.TxtPrintingByFileSpoolDirectory.Text;
            common.PathLogDirectory                 = this.TxtLogDirectory.Text;
            common.LogLevel                         = this.CmbLogLevel.Level;

            return common.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is CommonEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not CommonEnvironment");
            }

            CommonEnvironment common = env as CommonEnvironment;

            this.TxtRootDataDirectory.Text            = common.PathSmartWhereDataRootDirectory;
            this.TxtSpoolDirectory.Text               = common.PathSpoolDirectory;
            this.TxtErrorSpoolDirectory.Text          = common.PathErrorSpoolDirectory;
            this.TxtMetadataDirectory.Text            = common.PathMetadataDirectory;
            this.TxtPrintJobDirectory.Text            = common.PathPrintJobDirectory;
            this.TxtContingencyDirectory.Text         = common.PathContingencyDirectory;
            this.TxtFontDataDirectory.Text            = common.PathFontDataDirectory;
            this.TxtWatermarkImageDirectory.Text      = common.PathWatermarkImageDirectory;
            this.TxtImageProcessingDirectory.Text     = common.PathImageProcessingDirectory;
            this.TxtApprovalProcessingDirectory.Text  = common.PathApprovalProcessingDirectory;
            this.TxtImageLogProcessingDirectory.Text  = common.PathImageLogProcessingDirectory;
            this.TxtPrintingByFileSpoolDirectory.Text = common.PathPrintingByFileSpoolDirectory;
            this.TxtLogDirectory.Text                 = common.PathLogDirectory;
            this.CmbLogLevel.Level                    = common.LogLevel;
        }

        public override void Clear ()
        {
            this.TxtRootDataDirectory.Text            = string.Empty;
            this.TxtSpoolDirectory.Text               = string.Empty;
            this.TxtErrorSpoolDirectory.Text          = string.Empty;
            this.TxtMetadataDirectory.Text            = string.Empty;
            this.TxtPrintJobDirectory.Text            = string.Empty;
            this.TxtContingencyDirectory.Text         = string.Empty;
            this.TxtFontDataDirectory.Text            = string.Empty;
            this.TxtWatermarkImageDirectory.Text      = string.Empty;
            this.TxtImageProcessingDirectory.Text     = string.Empty;
            this.TxtApprovalProcessingDirectory.Text  = string.Empty;
            this.TxtImageLogProcessingDirectory.Text  = string.Empty;
            this.TxtPrintingByFileSpoolDirectory.Text = string.Empty;
            this.TxtLogDirectory.Text                 = string.Empty;
            this.CmbLogLevel.Level                    = CommonEnvironment.LogLevelType.Unknown;
        }

        #endregion Methods
    }
}