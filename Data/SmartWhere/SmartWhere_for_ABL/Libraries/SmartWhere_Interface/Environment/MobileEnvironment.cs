namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class MobileEnvironment : EnvironmentBase
    {
        #region Constants :: Default Values

        public const int DefaultPort                     = 9515;
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
        public const int MinimumListenRetryCount =  1;
        public const int DefaultListenRetryCount =  5;
        public const int MaximumListenRetryCount = 20;

        // PROPERTY "ListenRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumListenRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultListenRetryIntervalMS =   100; //  0.1 sec
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
        private int _Port = MobileEnvironment.DefaultPort;

        public int BufferSize         { get; set; }
        public int ReadTimeoutMS      { get; set; }
        public int WaitTimeoutMS      { get; set; }

        public int ListenRetryCount
        {
            get
            {
                return this._ListenRetryCount;
            }
            set
            {
                if (value < MobileEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, MobileEnvironment.MinimumListenRetryCount));
                }

                if (value > MobileEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, MobileEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = MobileEnvironment.DefaultListenRetryCount;

        public int ListenRetryIntervalMS
        {
            get
            {
                return this._ListenRetryIntervalMS;
            }
            set
            {
                if (value < MobileEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, MobileEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > MobileEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, MobileEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = MobileEnvironment.DefaultListenRetryIntervalMS;

        public int InsertAttemptCount
        {
            get
            {
                return this._InsertAttemptCount;
            }
            set
            {
                if (value < MobileEnvironment.MinimumInsertAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is less than Minimum value ({0} < {1})", value, MobileEnvironment.MinimumInsertAttemptCount));
                }

                if (value > MobileEnvironment.MaximumInsertAttemptCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is greater than Maximum value ({0} > {1})", value, MobileEnvironment.MaximumInsertAttemptCount));
                }

                this._InsertAttemptCount = value;
            }
        }
        private int _InsertAttemptCount = MobileEnvironment.DefaultInsertAttemptCount;

        public int InsertTimeoutMS    { get; set; }
        public int RemainDays
        {
            get
            {
                return this._RemainDays;
            }
            set
            {
                if (value < MobileEnvironment.MinimumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is less than Minimum value ({0} < {1})", value, MobileEnvironment.MinimumRemainDays));
                }

                if (value > MobileEnvironment.MaximumRemainDays)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Value is greater than Maximum value ({0} > {1})", value, MobileEnvironment.MaximumRemainDays));
                }

                this._RemainDays = value;
            }
        }
        private int _RemainDays = MobileEnvironment.DefaultRemainDays;

        public string VeryPdfOption            { get; set; }
        public int    ExternalProcessTimeoutMS { get; set; }

        #endregion Properties



        #region Constructors

        public MobileEnvironment ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Port                     = MobileEnvironment.DefaultPort;
            this.BufferSize               = MobileEnvironment.DefaultBufferSize;
            this.ReadTimeoutMS            = MobileEnvironment.DefaultReadTimeoutMS;
            this.WaitTimeoutMS            = MobileEnvironment.DefaultWaitTimeoutMS;
            this.ListenRetryCount         = MobileEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS    = MobileEnvironment.DefaultListenRetryIntervalMS;
            this.InsertAttemptCount       = MobileEnvironment.DefaultInsertAttemptCount;
            this.InsertTimeoutMS          = MobileEnvironment.DefaultInsertTimeoutMS;
            this.RemainDays               = MobileEnvironment.DefaultRemainDays;
            this.VeryPdfOption            = string.Empty;
            this.ExternalProcessTimeoutMS = MobileEnvironment.DefaultExternalProcessTimeoutMS;
        }

        #endregion Methods
    }
}