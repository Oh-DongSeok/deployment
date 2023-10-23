namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageApproval.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageApproval : PageBase
    {
        #region Constructors

        public PageApproval () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumConvertRetryCount.Minimum = ApprovalEnvironment.MinimumConvertRetryCount;
            this.NumConvertRetryCount.Maximum = ApprovalEnvironment.MaximumConvertRetryCount;

            this.NumConvertRetryIntervalMS.Minimum = ApprovalEnvironment.MinimumConvertRetryIntervalMS;
            this.NumConvertRetryIntervalMS.Maximum = ApprovalEnvironment.MaximumConvertRetryIntervalMS;

            this.NumHttpTimeoutMS.Minimum = ApprovalEnvironment.MinimumHttpTimeoutMS;
            this.NumHttpTimeoutMS.Maximum = ApprovalEnvironment.MaximumHttpTimeoutMS;
        }

        public override bool VerifyInputValue (ref string message)
        {
            //// Path For PDF Converter
            //if (string.IsNullOrWhiteSpace(this.TxtPathPdfConverterExecutable.Text) == true)
            //{
            //    message = @"""TxtPathPdfConverterExecutable"" of ApprovalEnvironment is empty";
            //    return false;
            //}

            //// Reference For PDF Converter
            //if (string.IsNullOrWhiteSpace(this.TxtPathPdfConverterReference.Text) == true)
            //{
            //    message = @"""TxtPathPdfConverterReference"" of ApprovalEnvironment is empty";
            //    return false;
            //}

            //// Web Service URI
            //if (string.IsNullOrWhiteSpace(this.TxtWebServiceURI.Text) == true)
            //{
            //    message = @"""TxtWebServiceURI"" of ApprovalEnvironment is empty";
            //    return false;
            //}

            // Convert Retry Count
            if (this.NumConvertRetryCount.Value == null || this.NumConvertRetryCount.Value.HasValue == false)
            {
                message = @"""ConvertRetryCount"" of ApprovalEnvironment is empty";
                return false;
            }

            // Convert Retry Interval
            if (this.NumConvertRetryIntervalMS.Value == null || this.NumConvertRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""ConvertRetryIntervalMS"" of ApprovalEnvironment is empty";
                return false;
            }

            // HTTP Timeout
            if (this.NumHttpTimeoutMS.Value == null || this.NumHttpTimeoutMS.Value.HasValue == false)
            {
                message = @"""HttpTimeoutMS"" of ApprovalEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(ApprovalEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not ApprovalEnvironment");
            }

            ApprovalEnvironment env = new ApprovalEnvironment();

            env.PathPdfConverterExecutable = this.TxtPathPdfConverterExecutable.Text;
            env.PathPdfConverterReference  = this.TxtPathPdfConverterReference.Text;
            env.WebServiceURI              = this.TxtWebServiceURI.Text;
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

            if ((env is ApprovalEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not ApprovalEnvironment");
            }

            ApprovalEnvironment approval = env as ApprovalEnvironment;

            this.TxtPathPdfConverterExecutable.Text = approval.PathPdfConverterExecutable;
            this.TxtPathPdfConverterReference.Text  = approval.PathPdfConverterReference;
            this.TxtWebServiceURI.Text              = approval.WebServiceURI;
            this.NumConvertRetryCount.Value         = approval.ConvertRetryCount;
            this.NumConvertRetryIntervalMS.Value    = approval.ConvertRetryIntervalMS;
            this.NumHttpTimeoutMS.Value             = approval.HttpTimeoutMS;
        }

        public override void Clear ()
        {
            this.TxtPathPdfConverterExecutable.Text = string.Empty;
            this.TxtPathPdfConverterReference.Text  = string.Empty;
            this.TxtWebServiceURI.Text              = string.Empty;
            this.NumConvertRetryCount.Value         = null;
            this.NumConvertRetryIntervalMS.Value    = null;
            this.NumHttpTimeoutMS.Value             = null;
        }

        #endregion Methods
    }
}