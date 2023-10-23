namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageAnalyzerService.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageAnalyzerService : PageBase
    {
        #region Constructors

        public PageAnalyzerService ()
        {
            this.InitializeComponent();
            
            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumThreadTimeout.Minimum = AnalyzeEnvironment.MinimumAnalyzeTimeoutMin;
            this.NumThreadTimeout.Maximum = AnalyzeEnvironment.MaximumAnalyzeTimeoutMin;

            this.NumThreadLimitCount.Minimum = AnalyzeEnvironment.MinimumThreadLimitCount;
            this.NumThreadLimitCount.Maximum = AnalyzeEnvironment.MaximumThreadLimitCount;

            this.NumListenRetryCount.Minimum = AnalyzeEnvironment.MinimumListenRetryCount;
            this.NumListenRetryCount.Maximum = AnalyzeEnvironment.MaximumListenRetryCount;

            this.NumListenRetryInterval.Minimum = AnalyzeEnvironment.MinimumListenRetryIntervalMS;
            this.NumListenRetryInterval.Maximum = AnalyzeEnvironment.MaximumListenRetryIntervalMS;

            this.NumAcceptTimeout.Minimum = AnalyzeEnvironment.MinimumAcceptWaitingTimeoutMS;
            this.NumAcceptTimeout.Maximum = AnalyzeEnvironment.MaximumAcceptWaitingTimeoutMS;

            this.NumSpoolRecvTimeout.Minimum = AnalyzeEnvironment.MinimumSpoolRecvTimeoutSec;
            this.NumSpoolRecvTimeout.Maximum = AnalyzeEnvironment.MaximumSpoolRecvTimeoutSec;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Host
            if (string.IsNullOrWhiteSpace(this.TxtHost.Text) == true)
            {
                message = @"""Host"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Port
            if (this.NumPort.HasValue == false)
            {
                message = @"""Port"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Use Approval
            if (this.ChkUseApproval.IsChecked == null || this.ChkUseApproval.IsChecked.HasValue == false)
            {
                message = @"""UseApproval"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Thread Timeout
            if (this.NumThreadTimeout.Value == null || this.NumThreadTimeout.Value.HasValue == false)
            {
                message = @"""ThreadTimeout"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Thread Limit Count
            if (this.NumThreadLimitCount.Value == null || this.NumThreadLimitCount.Value.HasValue == false)
            {
                message = @"""ThreadLimitCount"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Listen Retry Count
            if (this.NumListenRetryCount.Value == null || this.NumListenRetryCount.Value.HasValue == false)
            {
                message = @"""ListenRetryCount"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Listen Retry Interval
            if (this.NumListenRetryInterval.Value == null || this.NumListenRetryInterval.Value.HasValue == false)
            {
                message = @"""ListenRetryInterval"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Accept Timeout
            if (this.NumAcceptTimeout.Value == null || this.NumAcceptTimeout.Value.HasValue == false)
            {
                message = @"""AcceptTimeout"" of AnalyzeEnvironment is empty";
                return false;
            }

            // Accept Timeout
            if (this.NumSpoolRecvTimeout.Value == null || this.NumSpoolRecvTimeout.Value.HasValue == false)
            {
                message = @"""SpoolRecvTimeout"" of AnalyzeEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(AnalyzeEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not AnalyzeEnvironment");
            }

            AnalyzeEnvironment env = new AnalyzeEnvironment();

            env.Host                   = this.TxtHost.Text;
            env.Port                   = this.NumPort.Port;
            env.UseApproval            = this.ChkUseApproval.IsChecked.Value;
            env.AnalyzeTimeoutMin      = this.NumThreadTimeout.Value.Value;
            env.ThreadLimitCount       = this.NumThreadLimitCount.Value.Value;
            env.ListenRetryCount       = this.NumListenRetryCount.Value.Value;
            env.ListenRetryIntervalMS  = this.NumListenRetryInterval.Value.Value;
            env.AcceptWaitingTimeoutMS = this.NumAcceptTimeout.Value.Value;
            env.SpoolRecvTimeoutSec    = this.NumSpoolRecvTimeout.Value.Value;

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is AnalyzeEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not AnalyzeEnvironment");
            }

            AnalyzeEnvironment analyzer = env as AnalyzeEnvironment;

            this.TxtHost.Text                 = analyzer.Host;
            this.NumPort.Port                 = analyzer.Port;
            this.ChkUseApproval.IsChecked     = analyzer.UseApproval;
            this.NumThreadTimeout.Value       = analyzer.AnalyzeTimeoutMin;
            this.NumThreadLimitCount.Value    = analyzer.ThreadLimitCount;
            this.NumListenRetryCount.Value    = analyzer.ListenRetryCount;
            this.NumListenRetryInterval.Value = analyzer.ListenRetryIntervalMS;
            this.NumAcceptTimeout.Value       = analyzer.AcceptWaitingTimeoutMS;
            this.NumSpoolRecvTimeout.Value    = analyzer.SpoolRecvTimeoutSec;
        }

        public override void Clear ()
        {
            this.TxtHost.Text                 = string.Empty;
            this.ChkUseApproval.IsChecked     = false;
            this.NumThreadTimeout.Value       = null;
            this.NumThreadLimitCount.Value    = null;
            this.NumListenRetryCount.Value    = null;
            this.NumListenRetryInterval.Value = null;
            this.NumAcceptTimeout.Value       = null;
            this.NumSpoolRecvTimeout.Value    = null;

            this.NumPort.Clear();
        }

        #endregion Methods
    }
}
