namespace FXKIS.SmartWhere.CommonIF
{
    using System.Windows.Controls;



    /// <summary>
    /// LogLevelComboBox.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class LogLevelComboBox : UserControl
    {
        #region Properties

        public CommonEnvironment.LogLevelType Level
        {
            get
            {
                if (this.CmbLogLevel == null || this.CmbLogLevel.SelectedItem == null)
                {
                    return CommonEnvironment.LogLevelType.Unknown;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemNone)
                {
                    return CommonEnvironment.LogLevelType.None;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemDebug)
                {
                    return CommonEnvironment.LogLevelType.Debug;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemInfo)
                {
                    return CommonEnvironment.LogLevelType.Information;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemWarn)
                {
                    return CommonEnvironment.LogLevelType.Warning;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemError)
                {
                    return CommonEnvironment.LogLevelType.Error;
                }

                if (this.CmbLogLevel.SelectedItem == this.CmbitemFatal)
                {
                    return CommonEnvironment.LogLevelType.Fatal;
                }

                return CommonEnvironment.LogLevelType.Unknown;
            }
            set
            {
                switch (value)
                {
                    case CommonEnvironment.LogLevelType.None:
                        this.CmbLogLevel.SelectedItem = this.CmbitemNone;
                        break;

                    case CommonEnvironment.LogLevelType.Debug:
                        this.CmbLogLevel.SelectedItem = this.CmbitemDebug;
                        break;

                    case CommonEnvironment.LogLevelType.Information:
                        this.CmbLogLevel.SelectedItem = this.CmbitemInfo;
                        break;

                    case CommonEnvironment.LogLevelType.Warning:
                        this.CmbLogLevel.SelectedItem = this.CmbitemWarn;
                        break;

                    case CommonEnvironment.LogLevelType.Error:
                        this.CmbLogLevel.SelectedItem = this.CmbitemError;
                        break;

                    case CommonEnvironment.LogLevelType.Fatal:
                        this.CmbLogLevel.SelectedItem = this.CmbitemFatal;
                        break;

                    default:
                        this.CmbLogLevel.SelectedItem = null;
                        break;
                }
            }
        }

        #endregion Properties



        #region Constructors
        public LogLevelComboBox ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors
    }
}
