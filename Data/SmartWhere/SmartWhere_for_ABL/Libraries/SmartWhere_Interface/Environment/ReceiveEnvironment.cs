namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class ReceiveEnvironment : EnvironmentBase
    {
        #region Enumerations

        public enum ReceiveMode
        {
            Lpr = 1,
            Raw,
            Both
        }

        #endregion Enumerations



        #region Constants :: Default Values

        public const ReceiveMode DefaultMode              = ReceiveMode.Both;
        public const int         DefaultPortRaw           = 9100;
        public const int         DefaultListenThreadCount = 32;
        public const int         DefaultConnectTimeoutMS  = 3000;
        public const int         DefaultReadTimeoutMS     = 5000;
        public const int         DefaultCleanTimeoutMin   = 10;
        public const int         DefaultCleanIntervalMS   = 1000;
        public const int         DefaultBufferSize        = 524288; // 512 KB
        public const int         DefaultSendAttemptCount  = 3;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumSendAttemptCount = 3;
        public const int MaximumSendAttemptCount = 10;

        // PROPERTY "ListenRetryCount" :: default 5 cnt (range: 1 ~ 20 cnt)
        public const int MinimumListenRetryCount =  1;
        public const int DefaultListenRetryCount =  5;
        public const int MaximumListenRetryCount = 20;

        // PROPERTY "ListenRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumListenRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultListenRetryIntervalMS =   100; //  0.1 sec
        public const int MaximumListenRetryIntervalMS = 10000; // 10.0 sec

        #endregion Constants :: Ranges



        #region Properties

        public ReceiveMode Mode              { get; set; }
        public int         PortRaw
        {
            get
            {
                return this._Port;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 0 ({0} < {1})", value, 0));
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than 65535 ({0} > {1})", value, 65535));
                }

                this._Port = value;
            }
        }
        private int _Port = ReceiveEnvironment.DefaultPortRaw;


        public int         ListenThreadCount { get; set; }
        public int         ConnectTimeoutMS  { get; set; }
        public int         ReadTimeoutMS     { get; set; }

        public int ListenRetryCount
        {
            get
            {
                return this._ListenRetryCount;
            }
            set
            {
                if (value < ReceiveEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ReceiveEnvironment.MinimumListenRetryCount));
                }

                if (value > ReceiveEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ReceiveEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = ReceiveEnvironment.DefaultListenRetryCount;

        public int ListenRetryIntervalMS
        {
            get
            {
                return this._ListenRetryIntervalMS;
            }
            set
            {
                if (value < ReceiveEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ReceiveEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > ReceiveEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ReceiveEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = ReceiveEnvironment.DefaultListenRetryIntervalMS;

        public int         CleanTimeoutMin   { get; set; }
        public int         CleanIntervalMS   { get; set; }
        public int         BufferSize        { get; set; }
                           
        public int         SendAttemptCount
        {
            get
            {
                return this._SendAttemptNum;
            }
            set
            {
                if (value < ReceiveEnvironment.MinimumSendAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is less than Minimum value ({0} < {1})", value, ReceiveEnvironment.MinimumSendAttemptCount));
                }

                if (value > ReceiveEnvironment.MaximumSendAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is greater than Maximum value ({0} > {1})", value, ReceiveEnvironment.MaximumSendAttemptCount));
                }

                this._SendAttemptNum = value;
            }
        }
        private int _SendAttemptNum = ReceiveEnvironment.DefaultSendAttemptCount;

        #endregion Properties



        #region Constructors

        public ReceiveEnvironment ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Mode                  = ReceiveEnvironment.DefaultMode;
            this.PortRaw               = ReceiveEnvironment.DefaultPortRaw;
            this.ListenThreadCount     = ReceiveEnvironment.DefaultListenThreadCount;
            this.ConnectTimeoutMS      = ReceiveEnvironment.DefaultConnectTimeoutMS;
            this.ReadTimeoutMS         = ReceiveEnvironment.DefaultReadTimeoutMS;
            this.ListenRetryCount      = ReceiveEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS = ReceiveEnvironment.DefaultListenRetryIntervalMS;
            this.CleanTimeoutMin       = ReceiveEnvironment.DefaultCleanTimeoutMin;
            this.CleanIntervalMS       = ReceiveEnvironment.DefaultCleanIntervalMS;
            this.BufferSize            = ReceiveEnvironment.DefaultBufferSize;
            this.SendAttemptCount      = ReceiveEnvironment.DefaultSendAttemptCount;
            
        }

        #endregion Methods
    }
}