namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageMobile.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageMobile : PageBase
    {
        #region Constructors

        public PageMobile () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumInsertAttemptCnt.Minimum = MobileEnvironment.MinimumInsertAttemptCount;
            this.NumInsertAttemptCnt.Maximum = MobileEnvironment.MaximumInsertAttemptCount;

            this.NumRemainDays.Minimum = MobileEnvironment.MinimumRemainDays;
            this.NumRemainDays.Maximum = MobileEnvironment.MaximumRemainDays;

            this.NumHttpListenStartingRetryCount.Minimum = MobileEnvironment.MinimumListenRetryCount;
            this.NumHttpListenStartingRetryCount.Maximum = MobileEnvironment.MaximumListenRetryCount;

            this.NumHttpListenStartingRetryIntervalMS.Minimum = MobileEnvironment.MinimumListenRetryIntervalMS;
            this.NumHttpListenStartingRetryIntervalMS.Maximum = MobileEnvironment.MaximumListenRetryIntervalMS;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Port
            if (this.NumPort.HasValue == false)
            {
                message = @"""Port"" of DatabaseEnvironment is empty";
                return false;
            }

            // Buffer Size
            if (this.NumBufferSize.Value == null || this.NumBufferSize.Value.HasValue == false)
            {
                message = @"""BufferSize"" of MobileEnvironment is empty";
                return false;
            }

            // Read Timeout
            if (this.NumReadTimeout.Value == null || this.NumReadTimeout.Value.HasValue == false)
            {
                message = @"""ReadTimeout"" of MobileEnvironment is empty";
                return false;
            }

            // Wait Timeout
            if (this.NumWaitTimeout.Value == null || this.NumWaitTimeout.Value.HasValue == false)
            {
                message = @"""WaitTimeout"" of MobileEnvironment is empty";
                return false;
            }

            // Insert Attempt Count
            if (this.NumInsertAttemptCnt.Value == null || this.NumInsertAttemptCnt.Value.HasValue == false)
            {
                message = @"""InsertAttemptCount"" of MobileEnvironment is empty";
                return false;
            }

            // Insert Timeout
            if (this.NumInsertTimeout.Value == null || this.NumInsertTimeout.Value.HasValue == false)
            {
                message = @"""InsertTimeout"" of MobileEnvironment is empty";
                return false;
            }

            // Remain Days
            if (this.NumRemainDays.Value == null || this.NumRemainDays.Value.HasValue == false)
            {
                message = @"""RemainDays"" of MobileEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryCount
            if (this.NumHttpListenStartingRetryCount.Value == null || this.NumHttpListenStartingRetryCount.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryCount"" of MobileEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryIntervalMS
            if (this.NumHttpListenStartingRetryIntervalMS.Value == null || this.NumHttpListenStartingRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryIntervalMS"" of MobileEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(MobileEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not MobileEnvironment");
            }

            MobileEnvironment env = new MobileEnvironment();

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

            if ((env is MobileEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not MobileEnvironment");
            }

            MobileEnvironment mobile = env as MobileEnvironment;

            this.NumPort.Port                               = mobile.Port;
            this.NumBufferSize.Value                        = mobile.BufferSize;
            this.NumReadTimeout.Value                       = mobile.ReadTimeoutMS;
            this.NumWaitTimeout.Value                       = mobile.WaitTimeoutMS;
            this.NumInsertAttemptCnt.Value                  = mobile.InsertAttemptCount;
            this.NumInsertTimeout.Value                     = mobile.InsertTimeoutMS;
            this.NumRemainDays.Value                        = mobile.RemainDays;
            this.NumHttpListenStartingRetryCount.Value      = mobile.ListenRetryCount;
            this.NumHttpListenStartingRetryIntervalMS.Value = mobile.ListenRetryIntervalMS;
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
