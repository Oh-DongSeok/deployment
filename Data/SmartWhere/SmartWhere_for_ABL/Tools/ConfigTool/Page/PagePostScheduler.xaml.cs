namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PagePostScheduler.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PagePostScheduler : PageBase
    {
        #region Constructors

        public PagePostScheduler () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumPrintingModuleCount.Minimum               = PostSchedulerEnvironment.MinimumPrintingModuleCount;
            this.NumPrintingModuleCount.Maximum               = PostSchedulerEnvironment.MaximumPrintingModuleCount;

            this.NumPrintingModuleTimeout.Minimum             = PostSchedulerEnvironment.MinimumPrintingModuleTimeoutMin;
            this.NumPrintingModuleTimeout.Maximum             = PostSchedulerEnvironment.MaximumPrintingModuleTimeoutMin;

            this.NumRequestReadingTimeoutMS.Minimum           = PostSchedulerEnvironment.MinimumReadTimeoutMS;
            this.NumRequestReadingTimeoutMS.Maximum           = PostSchedulerEnvironment.MaximumReadTimeoutMS;

            this.NumHttpListenStartingRetryCount.Minimum      = PostSchedulerEnvironment.MinimumListenRetryCount;
            this.NumHttpListenStartingRetryCount.Maximum      = PostSchedulerEnvironment.MaximumListenRetryCount;

            this.NumHttpListenStartingRetryIntervalMS.Minimum = PostSchedulerEnvironment.MinimumListenRetryIntervalMS;
            this.NumHttpListenStartingRetryIntervalMS.Maximum = PostSchedulerEnvironment.MaximumListenRetryIntervalMS;

            this.NumHttpAcceptWaitingTimeoutMS.Minimum        = PostSchedulerEnvironment.MinimumAcceptWaitingTimeoutMS;
            this.NumHttpAcceptWaitingTimeoutMS.Maximum        = PostSchedulerEnvironment.MaximumAcceptWaitingTimeoutMS;

            this.NumDocumentListLimitCount.Minimum            = PostSchedulerEnvironment.MinimumDocumentListLimitCount;
            this.NumDocumentListLimitCount.Maximum            = PostSchedulerEnvironment.MaximumDocumentListLimitCount;

            this.NumServerIndex.Minimum                       = PostSchedulerEnvironment.MinimumServerIndex;
            this.NumServerIndex.Maximum                       = PostSchedulerEnvironment.MaximumServerIndex;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Port
            if (this.NumPort.HasValue == false)
            {
                message = @"""Port"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // PrintingModuleCount
            if (this.NumPrintingModuleCount.Value == null || this.NumPrintingModuleCount.Value.HasValue == false)
            {
                message = @"""PrintingModuleCount"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // PrintingModuleTimeout
            if (this.NumPrintingModuleTimeout.Value == null || this.NumPrintingModuleTimeout.Value.HasValue == false)
            {
                message = @"""PrintingModuleTimeout"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // RequestReadingTimeoutMS
            if (this.NumRequestReadingTimeoutMS.Value == null || this.NumRequestReadingTimeoutMS.Value.HasValue == false)
            {
                message = @"""RequestReadingTimeoutMS"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryCount
            if (this.NumHttpListenStartingRetryCount.Value == null || this.NumHttpListenStartingRetryCount.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryCount"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryIntervalMS
            if (this.NumHttpListenStartingRetryIntervalMS.Value == null || this.NumHttpListenStartingRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryIntervalMS"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // HttpAcceptWaitingTimeoutMS
            if (this.NumHttpAcceptWaitingTimeoutMS.Value == null || this.NumHttpAcceptWaitingTimeoutMS.Value.HasValue == false)
            {
                message = @"""HttpAcceptWaitingTimeoutMS"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // DocumentListLimitCount
            if (this.NumDocumentListLimitCount.Value == null || this.NumDocumentListLimitCount.Value.HasValue == false)
            {
                message = @"""DocumentListLimitCount"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // IsListDescending
            if (this.ChkIsListDescending.IsChecked == null || this.ChkIsListDescending.IsChecked.HasValue == false)
            {
                message = @"""IsListDescending"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // ServerIndex
            if (this.NumServerIndex.Value == null || this.NumServerIndex.Value.HasValue == false)
            {
                message = @"""ServerIndex"" of PostSchedulerEnvironment is empty";
                return false;
            }

            // CertificatePassword
            if (string.IsNullOrWhiteSpace(this.TxtCertificatePassword.Password) == true)
            {
                message = @"""CertificatePassword"" of ServiceEnvironment is empty";
                return false;
            }

            ////////////////////////////////////////////////////////////////
            // Active Directory Domain
            if (string.IsNullOrWhiteSpace(this.TxtActiveDirectoryDomain.Text) == true)
            {
                message = @"""ActiveDirectoryDomain"" of PostSchedulerEnvironment is empty";
                return false;
            }
            // Active Directory Hash Mode
            if (this.CmbActiveDirectoryHash.SelectedItem == null)
            {
                message = @"""ActiveDirectoryHashMode"" of PostSchedulerEnvironment is empty";
                return false;
            }
            // Active Directory Used SSL
            if (this.ChkActiveDirectoryUsedSSL.IsChecked == null || this.ChkActiveDirectoryUsedSSL.IsChecked.HasValue == false)
            {
                message = @"""ActiveDirectoryUsedSSL"" of PostSchedulerEnvironment is empty";
                return false;
            }
            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(PostSchedulerEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not PostSchedulerEnvironment");
            }

            PostSchedulerEnvironment env = new PostSchedulerEnvironment();

            env.Port                     = this.NumPort.Port;
            env.PrintingModuleCount      = this.NumPrintingModuleCount.Value.Value;
            env.PrintingModuleTimeoutMin = this.NumPrintingModuleTimeout.Value.Value;
            env.ReadTimeoutMS            = this.NumRequestReadingTimeoutMS.Value.Value;
            env.ListenRetryCount         = this.NumHttpListenStartingRetryCount.Value.Value;
            env.ListenRetryIntervalMS    = this.NumHttpListenStartingRetryIntervalMS.Value.Value;
            env.AcceptWaitingTimeoutMS   = this.NumHttpAcceptWaitingTimeoutMS.Value.Value;
            env.DocumentListLimitCount   = this.NumDocumentListLimitCount.Value.Value;
            env.IsListDescending         = this.ChkIsListDescending.IsChecked.Value;
            env.ServerIndex              = this.NumServerIndex.Value.Value;
            env.CertificatePassword      = this.TxtCertificatePassword.Password;
            env.ActiveDirectoryDomain    = this.TxtActiveDirectoryDomain.Text;
            env.ActiveDirectoryUsedSSL   = this.ChkActiveDirectoryUsedSSL.IsChecked.Value;

            if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashNormal)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.Normal;
            }
            else if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashMD5)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.MD5;
            }
            else if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashSHA1)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.SHA1;
            }
            else if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashSHA256)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.SHA256;
            }
            else if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashSHA384)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.SHA384;
            }
            else if (this.CmbActiveDirectoryHash.SelectedItem == this.CmbitemActiveDirectoryHashSHA512)
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.SHA512;
            }
            else
            {
                env.ActiveDirectoryHashMode = PostSchedulerEnvironment.ActiveDirectoryHashType.Unknown;
            }

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is PostSchedulerEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not PostSchedulerEnvironment");
            }

            PostSchedulerEnvironment post = env as PostSchedulerEnvironment;
            
            this.NumPort.Port                               = post.Port;
            this.NumPrintingModuleCount.Value               = post.PrintingModuleCount;
            this.NumPrintingModuleTimeout.Value             = post.PrintingModuleTimeoutMin;
            this.NumRequestReadingTimeoutMS.Value           = post.ReadTimeoutMS;
            this.NumHttpListenStartingRetryCount.Value      = post.ListenRetryCount;
            this.NumHttpListenStartingRetryIntervalMS.Value = post.ListenRetryIntervalMS;
            this.NumHttpAcceptWaitingTimeoutMS.Value        = post.AcceptWaitingTimeoutMS;
            this.NumDocumentListLimitCount.Value            = post.DocumentListLimitCount;
            this.ChkIsListDescending.IsChecked              = post.IsListDescending;
            this.NumServerIndex.Value                       = post.ServerIndex;
            this.TxtCertificatePassword.Password            = post.EncryptedCertificatePassword;

            this.TxtActiveDirectoryDomain.Text = post.ActiveDirectoryDomain;
            this.ChkActiveDirectoryUsedSSL.IsChecked = post.ActiveDirectoryUsedSSL;

            switch (post.ActiveDirectoryHashMode)
            {
                case PostSchedulerEnvironment.ActiveDirectoryHashType.Normal:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashNormal;
                    break;

                case PostSchedulerEnvironment.ActiveDirectoryHashType.MD5:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashMD5;
                    break;

                case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA1:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashSHA1;
                    break;

                case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA256:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashSHA256;
                    break;

                case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA384:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashSHA384;
                    break;

                case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA512:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashSHA512;
                    break;

                default:
                    this.CmbActiveDirectoryHash.SelectedItem = this.CmbitemActiveDirectoryHashNormal;
                    break;
            }
        }

        public override void Clear ()
        {
            this.NumPrintingModuleCount.Value               = null;
            this.NumPrintingModuleTimeout.Value             = null;
            this.NumRequestReadingTimeoutMS.Value           = null;
            this.NumHttpListenStartingRetryCount.Value      = null;
            this.NumHttpListenStartingRetryIntervalMS.Value = null;
            this.NumHttpAcceptWaitingTimeoutMS.Value        = null;
            this.NumDocumentListLimitCount.Value            = null;
            this.ChkIsListDescending.IsChecked              = PostSchedulerEnvironment.DefaultIsListDescending;
            this.NumServerIndex.Value                       = null;
            this.TxtCertificatePassword.Password            = string.Empty;

            this.NumPort.Clear();

            this.TxtActiveDirectoryDomain.Text              = string.Empty;
            this.CmbActiveDirectoryHash.SelectedItem        = null;
            this.ChkActiveDirectoryUsedSSL.IsChecked        = PostSchedulerEnvironment.DefaultActiveDirectoryUsedSSL;
        }

        #endregion Methods
    }
}
