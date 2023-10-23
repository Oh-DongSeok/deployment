namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.IO;

    using Common.Extension;



    /// <summary>
    /// PageReceiveService.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageReceiveService : PageBase
    {
        #region Constructors

        public PageReceiveService ()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            // MAX THREAD
            this.NumMaxThread.Minimum = null;
            this.NumMaxThread.Maximum = null;

            // CONNECTION TIMEOUT (MS)
            this.NumConnectionTimeout.Minimum = null;
            this.NumConnectionTimeout.Maximum = null;

            // MANAGE CLIENT INTERVAL (MS)
            this.NumManageClientInterval.Minimum = null;
            this.NumManageClientInterval.Maximum = null;

            // CLIENT REMOVE TIMEOUT (MIN)
            this.NumClientRemoveTimeout.Minimum = null;
            this.NumClientRemoveTimeout.Maximum = null;

            // LISTENER READ TIMEOUT (MS)
            this.NumListenerReadTimeout.Minimum = null;
            this.NumListenerReadTimeout.Maximum = null;

            // BUFFER SIZE (BYTE)
            this.NumBufferSize.Minimum = null;
            this.NumBufferSize.Maximum = null;

            // SEND ATTEMPT COUNT
            this.NumSendAttemptCnt.Minimum = ReceiveEnvironment.MinimumSendAttemptCount;
            this.NumSendAttemptCnt.Maximum = ReceiveEnvironment.MaximumSendAttemptCount;

            this.NumHttpListenStartingRetryCount.Minimum = ReceiveEnvironment.MinimumListenRetryCount;
            this.NumHttpListenStartingRetryCount.Maximum = ReceiveEnvironment.MaximumListenRetryCount;

            this.NumHttpListenStartingRetryIntervalMS.Minimum = ReceiveEnvironment.MinimumListenRetryIntervalMS;
            this.NumHttpListenStartingRetryIntervalMS.Maximum = ReceiveEnvironment.MaximumListenRetryIntervalMS;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // MODE
            if (this.CmbMode.SelectedItem == null)
            {
                message = @"""Mode"" of ReceiveEnvironment is empty";
                return false;
            }

            // RAW PORT
            if (this.NumRawPort.HasValue == false)
            {
                message = @"""PortRawListener"" of ReceiveEnvironment is empty";
                return false;
            }

            // MAX THREAD
            if (this.NumMaxThread.Value == null || this.NumMaxThread.Value.HasValue == false)
            {
                message = @"""ListenThread"" of ReceiveEnvironment is empty";
                return false;
            }

            // CONNECTION TIMEOUT (MS)
            if (this.NumConnectionTimeout.Value == null || this.NumConnectionTimeout.Value.HasValue == false)
            {
                message = @"""ConnectTimeoutMS"" of ReceiveEnvironment is empty";
                return false;
            }

            // MANAGE CLIENT INTERVAL (MS)
            if (this.NumManageClientInterval.Value == null || this.NumManageClientInterval.Value.HasValue == false)
            {
                message = @"""ManageClientIntervalMS"" of ReceiveEnvironment is empty";
                return false;
            }

            // CLIENT REMOVE TIMEOUT (MIN)
            if (this.NumClientRemoveTimeout.Value == null || this.NumClientRemoveTimeout.Value.HasValue == false)
            {
                message = @"""ClientRemoveTimeoutMin"" of ReceiveEnvironment is empty";
                return false;
            }

            // LISTENER READ TIMEOUT (MS)
            if (this.NumListenerReadTimeout.Value == null || this.NumListenerReadTimeout.Value.HasValue == false)
            {
                message = @"""ListenerReadTimeoutMS"" of ReceiveEnvironment is empty";
                return false;
            }

            // BUFFER SIZE (BYTE)
            if (this.NumBufferSize.Value == null || this.NumBufferSize.Value.HasValue == false)
            {
                message = @"""BufferSize"" of ReceiveEnvironment is empty";
                return false;
            }

            // SEND ATTEMPT COUNT
            if (this.NumSendAttemptCnt.Value == null || this.NumSendAttemptCnt.Value.HasValue == false)
            {
                message = @"""SendAttemptNum"" of ReceiveEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryCount
            if (this.NumHttpListenStartingRetryCount.Value == null || this.NumHttpListenStartingRetryCount.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryCount"" of ReceiveEnvironment is empty";
                return false;
            }

            // HttpListenStartingRetryIntervalMS
            if (this.NumHttpListenStartingRetryIntervalMS.Value == null || this.NumHttpListenStartingRetryIntervalMS.Value.HasValue == false)
            {
                message = @"""HttpListenStartingRetryIntervalMS"" of ReceiveEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(ReceiveEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not ReceiveEnvironment");
            }

            ReceiveEnvironment env = new ReceiveEnvironment();

            if (this.CmbMode.SelectedItem == this.CmbitemLPR)
            {
                env.Mode = ReceiveEnvironment.ReceiveMode.Lpr;
            }
            else if (this.CmbMode.SelectedItem == this.CmbitemRaw)
            {
                env.Mode = ReceiveEnvironment.ReceiveMode.Raw;
            }
            else if (this.CmbMode.SelectedItem == this.CmbitemBoth)
            {
                env.Mode = ReceiveEnvironment.ReceiveMode.Both;
            }
            else
            {
                throw new InvalidDataException("Receive Mode's value is invalid");
            }

            env.PortRaw               = this.NumRawPort.Port;
            env.ListenThreadCount     = this.NumMaxThread.Value.Value;
            env.ConnectTimeoutMS      = this.NumConnectionTimeout.Value.Value;
            env.CleanIntervalMS       = this.NumManageClientInterval.Value.Value;
            env.CleanTimeoutMin       = this.NumClientRemoveTimeout.Value.Value;
            env.ReadTimeoutMS         = this.NumListenerReadTimeout.Value.Value;
            env.BufferSize            = this.NumBufferSize.Value.Value;
            env.SendAttemptCount      = this.NumSendAttemptCnt.Value.Value;
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

            if ((env is ReceiveEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is Invalid - not ReceiveEnvironment");
            }

            ReceiveEnvironment recv = env as ReceiveEnvironment;

            switch (recv.Mode)
            {
                case ReceiveEnvironment.ReceiveMode.Lpr:
                    this.CmbMode.SelectedItem = this.CmbitemLPR;
                    break;

                case ReceiveEnvironment.ReceiveMode.Raw:
                    this.CmbMode.SelectedItem = this.CmbitemRaw;
                    break;

                case ReceiveEnvironment.ReceiveMode.Both:
                    this.CmbMode.SelectedItem = this.CmbitemBoth;
                    break;

                default:
                    this.CmbMode.SelectedItem = null;
                    break;
            }

            this.NumRawPort.Port                            = recv.PortRaw;
            this.NumMaxThread.Value                         = recv.ListenThreadCount;
            this.NumConnectionTimeout.Value                 = recv.ConnectTimeoutMS;
            this.NumManageClientInterval.Value              = recv.CleanIntervalMS;
            this.NumClientRemoveTimeout.Value               = recv.CleanTimeoutMin;
            this.NumListenerReadTimeout.Value               = recv.ReadTimeoutMS;
            this.NumBufferSize.Value                        = recv.BufferSize;
            this.NumSendAttemptCnt.Value                    = recv.SendAttemptCount;
            this.NumHttpListenStartingRetryCount.Value      = recv.ListenRetryCount;
            this.NumHttpListenStartingRetryIntervalMS.Value = recv.ListenRetryIntervalMS;
        }

        public override void Clear ()
        {
            this.CmbMode.SelectedItem                       = null;
            this.NumMaxThread.Value                         = null;
            this.NumConnectionTimeout.Value                 = null;
            this.NumManageClientInterval.Value              = null;
            this.NumClientRemoveTimeout.Value               = null;
            this.NumListenerReadTimeout.Value               = null;
            this.NumBufferSize.Value                        = null;
            this.NumSendAttemptCnt.Value                    = null;
            this.NumHttpListenStartingRetryCount.Value      = null;
            this.NumHttpListenStartingRetryIntervalMS.Value = null;

            this.NumRawPort.Clear();
        }

        #endregion Methods
    }
}
