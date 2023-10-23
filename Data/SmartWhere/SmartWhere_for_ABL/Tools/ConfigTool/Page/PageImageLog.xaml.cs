namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageImageLog.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageImageLog : PageBase
    {
        #region Constructors

        public PageImageLog () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumConvertRetryCount.Minimum = ImageLogEnvironment.MinimumConvertRetryCount;
            this.NumConvertRetryCount.Maximum = ImageLogEnvironment.MaximumConvertRetryCount;

            this.NumConvertRetryIntervalMS.Minimum = ImageLogEnvironment.MinimumConvertRetryIntervalMS;
            this.NumConvertRetryIntervalMS.Maximum = ImageLogEnvironment.MaximumConvertRetryIntervalMS;

            this.NumHttpTimeoutMS.Minimum = ImageLogEnvironment.MinimumHttpTimeoutMS;
            this.NumHttpTimeoutMS.Maximum = ImageLogEnvironment.MaximumHttpTimeoutMS;
        }

        public override bool VerifyInputValue (ref string message)
        {
            //// Path For PDF Converter
            //if (string.IsNullOrWhiteSpace(this.TxtPathPdfConverterExecutable.Text) == true)
            //{
            //    message = @"""TxtPathPdfConverterExecutable"" of ImageLogEnvironment is empty";
            //    return false;
            //}

            //// Reference For PDF Converter
            //if (string.IsNullOrWhiteSpace(this.TxtPathPdfConverterReference.Text) == true)
            //{
            //    message = @"""TxtPathPdfConverterReference"" of ImageLogEnvironment is empty";
            //    return false;
            //}

            // Server Host
            if (string.IsNullOrWhiteSpace(this.TxtServerHost.Text) == true)
            {
                message = @"""ServerHost"" of ImageLogEnvironment is empty";
                return false;
            }

            // Server Port
            if (this.NumServerPort.HasValue == false)
            {
                message = @"""ServerPort"" of ImageLogEnvironment is empty";
                return false;
            }

            // Convert Retry Count
            if (this.NumConvertRetryCount.Value == null || this.NumConvertRetryCount.Value.HasValue == false)
            {
                message = @"""ConvertRetryCount"" of ImageLogEnvironment is empty";
                return false;
            }

            // Convert Retry Interval
            if (this.NumConvertRetryIntervalMS.Value == null || this.NumConvertRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""ConvertRetryIntervalMS"" of ImageLogEnvironment is empty";
                return false;
            }

            // HTTP Timeout
            if (this.NumHttpTimeoutMS.Value == null || this.NumHttpTimeoutMS.Value.HasValue == false)
            {
                message = @"""HttpTimeoutMS"" of ImageLogEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(ImageLogEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not ImageLogEnvironment");
            }

            ImageLogEnvironment env = new ImageLogEnvironment();

            env.PathPdfConverterExecutable = this.TxtPathPdfConverterExecutable.Text;
            env.PathPdfConverterReference  = this.TxtPathPdfConverterReference.Text;
            env.ServerHost                 = this.TxtServerHost.Text;
            env.ServerPort                 = this.NumServerPort.Port;
            env.ConvertRetryCount          = this.NumConvertRetryCount.Value.Value;
            env.ConvertRetryIntervalMS     = this.NumConvertRetryIntervalMS.Value.Value;
            env.HttpTimeoutMS              = this.NumHttpTimeoutMS.Value.Value;

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is ImageLogEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not ImageLogEnvironment");
            }

            ImageLogEnvironment imagelog = env as ImageLogEnvironment;

            this.TxtPathPdfConverterExecutable.Text = imagelog.PathPdfConverterExecutable;
            this.TxtPathPdfConverterReference.Text  = imagelog.PathPdfConverterReference;
            this.TxtServerHost.Text                 = imagelog.ServerHost;
            this.NumServerPort.Port                 = imagelog.ServerPort;
            this.NumConvertRetryCount.Value         = imagelog.ConvertRetryCount;
            this.NumConvertRetryIntervalMS.Value    = imagelog.ConvertRetryIntervalMS;
            this.NumHttpTimeoutMS.Value             = imagelog.HttpTimeoutMS;
        }

        public override void Clear ()
        {
            this.TxtPathPdfConverterExecutable.Text = string.Empty;
            this.TxtPathPdfConverterReference.Text  = string.Empty;

            this.TxtServerHost.Text = string.Empty;
            this.NumServerPort.Clear();

            this.NumConvertRetryCount.Value         = null;
            this.NumConvertRetryIntervalMS.Value    = null;
            this.NumHttpTimeoutMS.Value             = null;
        }

        #endregion Methods
    }
}