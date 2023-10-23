namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class MacOSEnvironment : EnvironmentBase
    {
        #region Constants :: Default Values

        public const int DefaultPort                     = 8515;
        public const int DefaultBufferSize               = 524288;
        public const int DefaultReadTimeoutMS            = 5000;
        public const int DefaultWaitTimeoutMS            = 3000;
        public const int DefaultInsertAttemptCount       = 3;
        public const int DefaultInsertTimeoutMS          = 1000;
        public const int DefaultRemainDays               = 1;
        public const int DefaultExternalProcessTimeoutMS = 300000;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumInsertAttemptCount = 1;
        public const int MaximumInsertAttemptCount = 10;

        public const int MinimumRemainDays = 1;
        public const int MaximumRemainDays = 1000;

        // PROPERTY "ListenRetryCount" :: default 5 cnt (range: 1 ~ 20 cnt)
        public const int MinimumListenRetryCount = 1;
        public const int DefaultListenRetryCount = 5;
        public const int MaximumListenRetryCount = 20;

        // PROPERTY "ListenRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumListenRetryIntervalMS = 100; //  0.1 sec
        public const int DefaultListenRetryIntervalMS = 100; //  0.1 sec
        public const int MaximumListenRetryIntervalMS = 10000; // 10.0 sec

        #endregion Constants :: Ranges



        #region Properties

        public int Port
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
        private int _Port = MacOSEnvironment.DefaultPort;

        public int BufferSize    { get; set; }
        public int ReadTimeoutMS { get; set; }
        public int WaitTimeoutMS { get; set; }

        public int ListenRetryCount
        {
            get
            {
                return this._ListenRetryCount;
            }
            set
            {
                if (value < MacOSEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, MacOSEnvironment.MinimumListenRetryCount));
                }

                if (value > MacOSEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, MacOSEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = MacOSEnvironment.DefaultListenRetryCount;

        public int ListenRetryIntervalMS
        {
            get
            {
                return this._ListenRetryIntervalMS;
            }
            set
            {
                if (value < MacOSEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, MacOSEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > MacOSEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, MacOSEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = MacOSEnvironment.DefaultListenRetryIntervalMS;

        public int InsertAttemptCount
        {
            get
            {
                return this._InsertAttemptCount;
            }
            set
            {
                if (value < MacOSEnvironment.MinimumInsertAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is less than Minimum value ({0} < {1})", value, MacOSEnvironment.MinimumInsertAttemptCount));
                }

                if (value > MacOSEnvironment.MaximumInsertAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is greater than Maximum value ({0} > {1})", value, MacOSEnvironment.MaximumInsertAttemptCount));
                }

                this._InsertAttemptCount = value;
            }
        }
        private int _InsertAttemptCount = MacOSEnvironment.DefaultInsertAttemptCount;

        public int InsertTimeoutMS { get; set; }
        public int RemainDays
        {
            get
            {
                return this._RemainDays;
            }
            set
            {
                if (value < MacOSEnvironment.MinimumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is less than Minimum value ({0} < {1})", value, MacOSEnvironment.MinimumRemainDays));
                }

                if (value > MacOSEnvironment.MaximumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is greater than Maximum value ({0} > {1})", value, MacOSEnvironment.MaximumRemainDays));
                }

                this._RemainDays = value;
            }
        }
        private int _RemainDays = MacOSEnvironment.DefaultRemainDays;

        public string VeryPdfOption { get; set; }
        public int ExternalProcessTimeoutMS { get; set; }

        #endregion Properties



        #region Constructors

        public MacOSEnvironment()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties()
        {
            this.Port                     = MacOSEnvironment.DefaultPort;
            this.BufferSize               = MacOSEnvironment.DefaultBufferSize;
            this.ReadTimeoutMS            = MacOSEnvironment.DefaultReadTimeoutMS;
            this.WaitTimeoutMS            = MacOSEnvironment.DefaultWaitTimeoutMS;
            this.ListenRetryCount         = MacOSEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS    = MacOSEnvironment.DefaultListenRetryIntervalMS;
            this.InsertAttemptCount       = MacOSEnvironment.DefaultInsertAttemptCount;
            this.InsertTimeoutMS          = MacOSEnvironment.DefaultInsertTimeoutMS;
            this.RemainDays               = MacOSEnvironment.DefaultRemainDays;
            this.VeryPdfOption            = string.Empty;
            this.ExternalProcessTimeoutMS = MacOSEnvironment.DefaultExternalProcessTimeoutMS;
        }

        #endregion Methods
    }
}