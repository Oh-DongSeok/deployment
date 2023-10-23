
namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageMacOS.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageMacOS : PageBase
    {
        #region Constructors

        public PageMacOS () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumInsertAttemptCnt.Minimum = MacOSEnvironment.MinimumInsertAttemptCount;
            this.NumInsertAttemptCnt.Maximum = MacOSEnvironment.MaximumInsertAttemptCount;

            this.NumRemainDays.Minimum = MacOSEnvironment.MinimumRemainDays;
            this.NumRemainDays.Maximum = MacOSEnvironment.MaximumRemainDays;

            this.NumHttpListenStartingRetryCount.Minimum = MacOSEnvironment.MinimumListenRetryCount;
            this.NumHttpListenStartingRetryCount.Maximum = MacOSEnvironment.MaximumListenRetryCount;

            this.NumHttpListenStartingRetryIntervalMS.Minimum = MacOSEnvironment.MinimumListenRetryIntervalMS;
            this.NumHttpListenStartingRetryIntervalMS.Maximum = MacOSEnvironment.MaximumListenRetryIntervalMS;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Port
            if (this.NumPort.HasValue == false)
            {
                message = @"""Port"" of MacOSEnvironment is empty";
                return false;
            }

            // Buffer Size
            if (this.NumBufferSize.Value == null || this.NumBufferSize.Value.HasValue == false)
            {
                message = @"""BufferSize"" of MacOSEnvironment is empty";
                return false;
            }

            // Read Timeout
            if (this.NumReadTimeout.Value == null || this.NumReadTimeout.Value.HasValue == false)
            {
                message = @"""ReadTimeout"" of MacOSEnvironment is empty";
                return false;
            }

            // Wait Timeout
            if (this.NumWaitTimeout.Value == null || this.NumWaitTimeout.Value.HasValue == false)
            {
                message = @"""WaitTimeout"" of MacOSEnvironment is empty";
                return false;
            }

            // Insert Attempt Count
            if (this.NumInsertAttemptCnt.Value == null || this.NumInsertAttemptCnt.Value.HasValue == false)
            {
                message = @"""InsertAttemptCount"" of MacOSEnvironment is empty";
                return false;
            }

            // Insert Timeout
            if (this.NumInsertTimeout.Value == null || this.NumInsertTimeout.Value.HasValue == false)
            {
                message = @"""InsertTimeout"" of MacOSEnvironment is empty";
                return false;
            }

            // Remain Days
            if (this.NumRemainDays.Value == null || this.NumRemainDays.Value.HasValue == false)
            {
                message = @"""RemainDays"" of MacOSEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryCount
            if (this.NumHttpListenStartingRetryCount.Value == null || this.NumHttpListenStartingRetryCount.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryCount"" of MacOSEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryIntervalMS
            if (this.NumHttpListenStartingRetryIntervalMS.Value == null || this.NumHttpListenStartingRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryIntervalMS"" of MacOSEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(MacOSEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not MacOSEnvironment");
            }

            MacOSEnvironment env = new MacOSEnvironment();

            env.Port                  = this.NumPort.Port;
            env.BufferSize            = this.NumBufferSize.Value.Value;
            env.ReadTimeoutMS         = this.NumReadTimeout.Value.Value;
            env.WaitTimeoutMS         = this.NumWaitTimeout.Value.Value;
            env.InsertAttemptCount    = this.NumInsertAttemptCnt.Value.Value;
            env.InsertTimeoutMS       = this.NumInsertTimeout.Value.Value;
            env.RemainDays            = this.NumRemainDays.Value.Value;
            env.ListenRetryCount      = this.NumHttpListenStartingRetryCount.Value.Value;
            env.ListenRetryIntervalMS = this.NumHttpListenStartingRetryIntervalMS.Value.Value;

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is MacOSEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not MacOSEnvironment");
            }

            MacOSEnvironment mac = env as MacOSEnvironment;

            this.NumPort.Port                               = mac.Port;
            this.NumBufferSize.Value                        = mac.BufferSize;
            this.NumReadTimeout.Value                       = mac.ReadTimeoutMS;
            this.NumWaitTimeout.Value                       = mac.WaitTimeoutMS;
            this.NumInsertAttemptCnt.Value                  = mac.InsertAttemptCount;
            this.NumInsertTimeout.Value                     = mac.InsertTimeoutMS;
            this.NumRemainDays.Value                        = mac.RemainDays;
            this.NumHttpListenStartingRetryCount.Value      = mac.ListenRetryCount;
            this.NumHttpListenStartingRetryIntervalMS.Value = mac.ListenRetryIntervalMS;
        }

        public override void Clear ()
        {
            this.NumBufferSize.Value                        = null;
            this.NumReadTimeout.Value                       = null;
            this.NumWaitTimeout.Value                       = null;
            this.NumInsertAttemptCnt.Value                  = null;
            this.NumInsertTimeout.Value                     = null;
            this.NumRemainDays.Value                        = null;
            this.NumHttpListenStartingRetryCount.Value      = null;
            this.NumHttpListenStartingRetryIntervalMS.Value = null;

            this.NumPort.Clear();
        }

        #endregion Methods
    }
}
