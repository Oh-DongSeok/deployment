namespace FXKIS.SmartWhere.CommonIF
{
    using FXKIS.Common.Extension;
    using System;



    public class PostSchedulerEnvironment : EnvironmentBase
    {
        #region Enumerations
        public enum ActiveDirectoryHashType
        {
            Unknown,
            Normal,
            MD5,
            SHA1,
            SHA256,
            SHA512,
            SHA384
        }
        #endregion Enumerations

        #region Constants :: Secret Key for Cryptography

        private const string SecretKeyAES256 = "!!SmartWhere_PostProcessScheduler__##__developed_by_FXKIS_SEC_chosm!!";

        #endregion Constants :: Secret Key for Cryptography

        #region Constants :: Default Values
                                                                                 
        public const int                     DefaultPort                         = 9009;
        public const bool                    DefaultIsListDescending             = false;
        public const string                  DefaultEncryptedCertificatePassword = "Jnz1teRYdtlt2vzt+E9/IxEzezCto9QrKj267KFl9FM="; // => "fujixerox1!"
        public const string                  DefaultActiveDirectoryDomain        = "dc01.fujixerox.net";
        public const ActiveDirectoryHashType DefaultActiveDirectoryHashMode      = ActiveDirectoryHashType.Normal;
        public const bool                    DefaultActiveDirectoryUsedSSL       = false;


        #endregion Constants :: Default Values



        #region Constants :: Default Values & Ranges

        // PROPERTY "PrintingModuleCount" :: default 10 cnt (range: 1 ~ 50 cnt)
        public const int MinimumPrintingModuleCount =  1;
        public const int DefaultPrintingModuleCount = 10;
        public const int MaximumPrintingModuleCount = 50;

        // PROPERTY "PrintingModuleTimeoutMin" :: default 60 min (range: 1 ~ 60 min)
        public const int MinimumPrintingModuleTimeoutMin =   1;
        public const int DefaultPrintingModuleTimeoutMin =  60;
        public const int MaximumPrintingModuleTimeoutMin = 120;

        // PROPERTY "ReadTimeoutMS" :: default 5.0 sec (range: 0.1 ~ 60.0 sec)
        public const int MinimumReadTimeoutMS =   100; //  0.1 sec
        public const int DefaultReadTimeoutMS =  5000; //  5.0 sec
        public const int MaximumReadTimeoutMS = 60000; // 60.0 sec

        // PROPERTY "ListenRetryCount" :: default 5 cnt (range: 1 ~ 20 cnt)
        public const int MinimumListenRetryCount =  1;
        public const int DefaultListenRetryCount =  5;
        public const int MaximumListenRetryCount = 20;

        // PROPERTY "ListenRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumListenRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultListenRetryIntervalMS =   100; //  0.1 sec
        public const int MaximumListenRetryIntervalMS = 10000; // 10.0 sec

        // PROPERTY "AcceptWaitingTimeoutMS" :: default 5.0 sec (range: 0.1 ~ 60.0 sec)
        public const int MinimumAcceptWaitingTimeoutMS =   100; //  0.1 sec
        public const int DefaultAcceptWaitingTimeoutMS =  5000; //  5.0 sec
        public const int MaximumAcceptWaitingTimeoutMS = 60000; // 60.0 sec

        // PROPERTY "DocumentListLimitCount" :: default 80 cnt (range: 40 ~ 80 cnt)
        public const int MinimumDocumentListLimitCount = 40;
        public const int DefaultDocumentListLimitCount = 80;
        public const int MaximumDocumentListLimitCount = 80;

        // PROPERTY "ServerIndex" :: default 0 (range: 0 ~ 9999)
        public const int MinimumServerIndex =    0;
        public const int DefaultServerIndex =    0;
        public const int MaximumServerIndex = 9999;



        #endregion Constants :: Default Values & Ranges



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
        private int _Port = PostSchedulerEnvironment.DefaultPort;

        public int PrintingModuleCount
        {
            get
            {
                return this._PrintingModuleCount;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumPrintingModuleCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumPrintingModuleCount));
                }

                if (value > PostSchedulerEnvironment.MaximumPrintingModuleCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumPrintingModuleCount));
                }

                this._PrintingModuleCount = value;
            }
        }
        private int _PrintingModuleCount = PostSchedulerEnvironment.DefaultPrintingModuleCount;

        public int PrintingModuleTimeoutMin
        {
            get
            {
                return this._PrintingModuleTimeoutMin;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumPrintingModuleTimeoutMin)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumPrintingModuleTimeoutMin));
                }

                if (value > PostSchedulerEnvironment.MaximumPrintingModuleTimeoutMin)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumPrintingModuleTimeoutMin));
                }

                this._PrintingModuleTimeoutMin = value;
            }
        }
        private int _PrintingModuleTimeoutMin = PostSchedulerEnvironment.DefaultPrintingModuleTimeoutMin;

        public int ReadTimeoutMS
        {
            get
            {
                return this._ReadTimeoutMS;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumReadTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumReadTimeoutMS));
                }

                if (value > PostSchedulerEnvironment.MaximumReadTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumReadTimeoutMS));
                }

                this._ReadTimeoutMS = value;
            }
        }
        private int _ReadTimeoutMS = PostSchedulerEnvironment.DefaultReadTimeoutMS;

        public int ListenRetryCount
        {
            get
            {
                return this._ListenRetryCount;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumListenRetryCount));
                }

                if (value > PostSchedulerEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = PostSchedulerEnvironment.DefaultListenRetryCount;

        public int ListenRetryIntervalMS
        {
            get
            {
                return this._ListenRetryIntervalMS;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > PostSchedulerEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = PostSchedulerEnvironment.DefaultListenRetryIntervalMS;

        public int AcceptWaitingTimeoutMS
        {
            get
            {
                return this._HttpAcceptWaitingTimeoutMS;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumAcceptWaitingTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumAcceptWaitingTimeoutMS));
                }

                if (value > PostSchedulerEnvironment.MaximumAcceptWaitingTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumAcceptWaitingTimeoutMS));
                }

                this._HttpAcceptWaitingTimeoutMS = value;
            }
        }
        private int _HttpAcceptWaitingTimeoutMS = PostSchedulerEnvironment.DefaultAcceptWaitingTimeoutMS;

        public int DocumentListLimitCount
        {
            get
            {
                return this._DocumentListLimitCount;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumDocumentListLimitCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumDocumentListLimitCount));
                }

                if (value > PostSchedulerEnvironment.MaximumDocumentListLimitCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumDocumentListLimitCount));
                }

                this._DocumentListLimitCount = value;
            }
        }
        private int _DocumentListLimitCount = PostSchedulerEnvironment.DefaultDocumentListLimitCount;

        public bool IsListDescending { get; set; }

        public int ServerIndex
        {
            get
            {
                return this._ServerIndex;
            }
            set
            {
                if (value < PostSchedulerEnvironment.MinimumServerIndex)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PostSchedulerEnvironment.MinimumServerIndex));
                }

                if (value > PostSchedulerEnvironment.MaximumServerIndex)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PostSchedulerEnvironment.MaximumServerIndex));
                }

                this._ServerIndex = value;
            }
        }
        private int _ServerIndex = PostSchedulerEnvironment.DefaultServerIndex;

        public string CertificatePassword
        {
            private get
            {
                if (string.IsNullOrWhiteSpace(this.EncryptedCertificatePassword) == true)
                {
                    return string.Empty;
                }

                return CryptographyEx.AESDecrypt256FromBase64(this.EncryptedCertificatePassword, PostSchedulerEnvironment.SecretKeyAES256);
            }
            set
            {
                if (string.IsNullOrWhiteSpace(value) == true)
                {
                    throw new ArgumentNullException("string value");
                }

                this.EncryptedCertificatePassword = CryptographyEx.AESEncrypt256ToBase64(value, PostSchedulerEnvironment.SecretKeyAES256);
            }
        }

        public string EncryptedCertificatePassword { get; private set; }
        #endregion Properties


        #region Properties :: Active Directory Verification

        public string                  ActiveDirectoryDomain   { get; set; }
        public ActiveDirectoryHashType ActiveDirectoryHashMode { get; set; }
        public bool                    ActiveDirectoryUsedSSL  { get; set; }

        #endregion Properties :: Active Directory Verification



        #region Constructors

        public PostSchedulerEnvironment ()
        {
            this.Port                         = PostSchedulerEnvironment.DefaultPort;
            this.PrintingModuleCount          = PostSchedulerEnvironment.DefaultPrintingModuleCount;
            this.PrintingModuleTimeoutMin     = PostSchedulerEnvironment.DefaultPrintingModuleTimeoutMin;
            this.ReadTimeoutMS                = PostSchedulerEnvironment.DefaultReadTimeoutMS;
            this.ListenRetryCount             = PostSchedulerEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS        = PostSchedulerEnvironment.DefaultListenRetryIntervalMS;
            this.AcceptWaitingTimeoutMS       = PostSchedulerEnvironment.DefaultAcceptWaitingTimeoutMS;
            this.DocumentListLimitCount       = PostSchedulerEnvironment.DefaultDocumentListLimitCount;
            this.IsListDescending             = PostSchedulerEnvironment.DefaultIsListDescending;
            this.ServerIndex                  = PostSchedulerEnvironment.DefaultServerIndex;
            this.EncryptedCertificatePassword = PostSchedulerEnvironment.DefaultEncryptedCertificatePassword;
            this.ActiveDirectoryDomain        = PostSchedulerEnvironment.DefaultActiveDirectoryDomain;
            this.ActiveDirectoryHashMode      = PostSchedulerEnvironment.DefaultActiveDirectoryHashMode;
            this.ActiveDirectoryUsedSSL       = PostSchedulerEnvironment.DefaultActiveDirectoryUsedSSL;
        }

        public PostSchedulerEnvironment (int port,               int  cntModule,               int moduleTimeoutMin, int readTimeout,
                                         int cntHttpListenRetry, int  intervalHttpListenRetry, int acceptWaitingTimeout,
                                         int cntDocListLimit,    bool isListDesc,              int serverIdx) : this()
        {
            this.Port                     = port;
            this.PrintingModuleCount      = cntModule;
            this.PrintingModuleTimeoutMin = moduleTimeoutMin;
            this.ReadTimeoutMS            = readTimeout;
            this.ListenRetryCount         = cntHttpListenRetry;
            this.ListenRetryIntervalMS    = intervalHttpListenRetry;
            this.AcceptWaitingTimeoutMS   = acceptWaitingTimeout;
            this.DocumentListLimitCount   = cntDocListLimit;
            this.IsListDescending         = isListDesc;
            this.ServerIndex              = serverIdx;
        }

        public PostSchedulerEnvironment (PostSchedulerEnvironment env) : this()
        {
            if (env == null)
            {
                throw new ArgumentNullException("PostSchedulerEnvironment env");
            }

            this.Port                         = env.Port;
            this.PrintingModuleCount          = env.PrintingModuleCount;
            this.PrintingModuleTimeoutMin     = env.PrintingModuleTimeoutMin;
            this.ReadTimeoutMS                = env.ReadTimeoutMS;
            this.ListenRetryCount             = env.ListenRetryCount;
            this.ListenRetryIntervalMS        = env.ListenRetryIntervalMS;
            this.AcceptWaitingTimeoutMS       = env.AcceptWaitingTimeoutMS;
            this.DocumentListLimitCount       = env.DocumentListLimitCount;
            this.IsListDescending             = env.IsListDescending;
            this.ServerIndex                  = env.ServerIndex;
            this.EncryptedCertificatePassword = env.EncryptedCertificatePassword;
            this.ActiveDirectoryDomain        = env.ActiveDirectoryDomain;
            this.ActiveDirectoryHashMode      = env.ActiveDirectoryHashMode;
            this.ActiveDirectoryUsedSSL       = env.ActiveDirectoryUsedSSL;
        }

        #endregion Constructors
    }
}
