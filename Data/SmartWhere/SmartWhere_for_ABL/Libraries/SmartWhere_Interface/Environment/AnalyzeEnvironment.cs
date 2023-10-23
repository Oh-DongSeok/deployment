namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class AnalyzeEnvironment : EnvironmentBase
    {
        #region Constants :: Default Values

        public const string DefaultHost        = "127.0.0.1";
        public const int    DefaultPort        = 8888;
        public const int    DefaultPortHeavy   = 8889;
        public const bool   DefaultUseApproval = false;                

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        // PROPERTY "ThreadLimitCount" :: default 10 ea (range: 3 ~ 20 cnt)
        public const int MinimumThreadLimitCount =  3;
        public const int DefaultThreadLimitCount = 10;
        public const int MaximumThreadLimitCount = 20;

        // PROPERTY "ThreadLimitCountHeavy" :: default 2 ea (no range)
        public const int MinimumThreadLimitCountHeavy = 1;
        public const int DefaultThreadLimitCountHeavy = 2;
        public const int MaximumThreadLimitCountHeavy = 5;

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

        // PROPERTY "AnalyzeTimeoutMin" :: default 10.0 min (range: 1.0 ~ 60.0 min)
        public const int MinimumAnalyzeTimeoutMin =  1; //  10.0 min
        public const int DefaultAnalyzeTimeoutMin =  10; //  60.0 min
        public const int MaximumAnalyzeTimeoutMin = 60; // 360.0 min

        // PROPERTY "AnalyzeTimeoutMinHeavy" :: default 60.0 min (range: 10.0 ~ 360.0 min)
        public const int MinimumAnalyzeTimeoutMinHeavy = 10; //  10.0 min
        public const int DefaultAnalyzeTimeoutMinHeavy = 60; //  60.0 min
        public const int MaximumAnalyzeTimeoutMinHeavy = 360; // 360.0 min

        // PROPERTY "SpoolRecvTimeoutSec" :: default 30.0 sec (range: 1.0 ~ 600.0 sec)
        public const int MinimumSpoolRecvTimeoutSec =   1;
        public const int DefaultSpoolRecvTimeoutSec =  30;
        public const int MaximumSpoolRecvTimeoutSec = 600;

        //PROPERTY "ThreadTimeGap" :: default 2.0sec (range: 0.5 ~ 5.0 sec)
        public const int MinimumThreadGap = 500;
        public const int DefaultThreadGap = 2000;
        public const int MaximumThreadGap = 5000;

        //PROPERTY "SizeLimit" :: default 50MB (range: 0 ~ 2GB)
        public const long MinimumSizeLimit = 0;
        public const long DefaultSizeLimit = 52428800;
        public const long MaximumSizeLimit = 2147483648;

        //PROPERTY "AbortSizeLimit" :: default 200MB (range: 100 ~ 2GB)
        public const long MinimumAbortSizeLimit = 104857600;
        public const long DefaultAbortSizeLimit = 209715200;
        public const long MaximumAbortSizeLimit = 2147483648;

        #endregion Constants :: Ranges



        #region Properties

        public string Host             { get; set; }
        public int    Port
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
        private int _Port = AnalyzeEnvironment.DefaultPort;

        public int PortHeavy
        {
            get
            {
                return this._PortHeavy;
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

                this._PortHeavy = value;
            }
        }
        private int _PortHeavy = AnalyzeEnvironment.DefaultPort;

        public long SizeLimit
        {
            get
            {
                return this._SizeLimit;
            }
            set
            {
                if (value < MinimumSizeLimit)
                {
                    throw new ArgumentOutOfRangeException("long value", value, string.Format("Size value is less than ({0} < {1})", value, MinimumAbortSizeLimit));
                }

                if (value > MaximumSizeLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Size value is greater than ({0} > {1})", value, MaximumSizeLimit));
                }

                this._SizeLimit = value;
            }
        }
        private long _SizeLimit = AnalyzeEnvironment.DefaultPort;

        public long AbortSizeLimit
        {
            get
            {
                return this._AbortSizeLimit;
            }
            set
            {
                if (value < MinimumAbortSizeLimit)
                {
                    throw new ArgumentOutOfRangeException("long value", value, string.Format("Size value is less than  ({0} < {1})", value, MinimumAbortSizeLimit));
                }

                if (value > MaximumAbortSizeLimit)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Size value is greater than ({0} > {1})", value, MaximumAbortSizeLimit));
                }

                this._AbortSizeLimit = value;
            }
        }
        private long _AbortSizeLimit = AnalyzeEnvironment.DefaultAbortSizeLimit;

        public int ThreadGap
        {
            get
            {
                return this._ThreadGap;
            }
            set
            {
                if (value < MinimumThreadGap)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Size value is less than {0} ({1} < {2})", MinimumThreadGap, value, MinimumThreadGap));
                }

                if (value > MaximumThreadGap)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Size value is greater than {0} ({1} > {2})", MaximumThreadGap,value, MaximumThreadGap));
                }

                this._ThreadGap = value;
            }
        }
        private int _ThreadGap = AnalyzeEnvironment.DefaultThreadGap;

        public bool   UseApproval      { get; set; }

        public int    ThreadLimitCount
        {
            get
            {
                return this._ThreadLimitCount;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumThreadLimitCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumThreadLimitCount));
                }

                if (value > AnalyzeEnvironment.MaximumThreadLimitCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumThreadLimitCount));
                }

                this._ThreadLimitCount = value;
            }
        }
        private int _ThreadLimitCount = AnalyzeEnvironment.DefaultThreadLimitCount;

        public int ThreadLimitCountHeavy
        {
            get
            {
                return this._ThreadLimitCountHeavy;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumThreadLimitCountHeavy)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumThreadLimitCountHeavy));
                }

                if (value > AnalyzeEnvironment.MaximumThreadLimitCountHeavy)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumThreadLimitCountHeavy));
                }

                this._ThreadLimitCountHeavy = value;
            }
        }
        private int _ThreadLimitCountHeavy = AnalyzeEnvironment.DefaultThreadLimitCountHeavy;

        public int    ListenRetryCount
        {
            get
            {
                return _ListenRetryCount;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumListenRetryCount));
                }

                if (value > AnalyzeEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = AnalyzeEnvironment.DefaultListenRetryCount;

        public int    ListenRetryIntervalMS
        {
            get
            {
                return _ListenRetryIntervalMS;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > AnalyzeEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = AnalyzeEnvironment.DefaultListenRetryIntervalMS;

        public int    AcceptWaitingTimeoutMS
        {
            get
            {
                return this._AcceptWaitingTimeoutMS;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumAcceptWaitingTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumAcceptWaitingTimeoutMS));
                }

                if (value > AnalyzeEnvironment.MaximumAcceptWaitingTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumAcceptWaitingTimeoutMS));
                }

                this._AcceptWaitingTimeoutMS = value;
            }
        }
        private int _AcceptWaitingTimeoutMS = AnalyzeEnvironment.DefaultAcceptWaitingTimeoutMS;

        public int AnalyzeTimeoutMin
        {
            get
            {
                return this._AnalyzeTimeoutMin;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumAnalyzeTimeoutMin)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumAnalyzeTimeoutMin));
                }

                if (value > AnalyzeEnvironment.MaximumAnalyzeTimeoutMin)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumAnalyzeTimeoutMin));
                }

                this._AnalyzeTimeoutMin = value;
            }
        }
        private int _AnalyzeTimeoutMin = AnalyzeEnvironment.DefaultAnalyzeTimeoutMin;

        public int AnalyzeTimeoutMinHeavy
        {
            get
            {
                return this._AnalyzeTimeoutMinHeavy;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumAnalyzeTimeoutMinHeavy)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumAnalyzeTimeoutMinHeavy));
                }

                if (value > AnalyzeEnvironment.MaximumAnalyzeTimeoutMinHeavy)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumAnalyzeTimeoutMinHeavy));
                }

                this._AnalyzeTimeoutMinHeavy = value;
            }
        }
        private int _AnalyzeTimeoutMinHeavy = AnalyzeEnvironment.DefaultAnalyzeTimeoutMin;

        public int SpoolRecvTimeoutSec
        {
            get
            {
                return this._SpoolRecvTimeoutSec;
            }
            set
            {
                if (value < AnalyzeEnvironment.MinimumSpoolRecvTimeoutSec)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, AnalyzeEnvironment.MinimumSpoolRecvTimeoutSec));
                }

                if (value > AnalyzeEnvironment.MaximumSpoolRecvTimeoutSec)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, AnalyzeEnvironment.MaximumSpoolRecvTimeoutSec));
                }

                this._SpoolRecvTimeoutSec = value;
            }
        }
        private int _SpoolRecvTimeoutSec = AnalyzeEnvironment.DefaultSpoolRecvTimeoutSec;

        #endregion Properties



        #region Constructors

        public AnalyzeEnvironment ()
        {
            this.Host                   = AnalyzeEnvironment.DefaultHost;
            this.Port                   = AnalyzeEnvironment.DefaultPort;
            this.PortHeavy              = AnalyzeEnvironment.DefaultPortHeavy;
            this.UseApproval            = AnalyzeEnvironment.DefaultUseApproval;
            this.ThreadLimitCount       = AnalyzeEnvironment.DefaultThreadLimitCount;
            this.ThreadLimitCountHeavy  = AnalyzeEnvironment.DefaultThreadLimitCountHeavy;
            this.ListenRetryCount       = AnalyzeEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS  = AnalyzeEnvironment.DefaultListenRetryIntervalMS;
            this.AcceptWaitingTimeoutMS = AnalyzeEnvironment.DefaultAcceptWaitingTimeoutMS;
            this.AnalyzeTimeoutMin      = AnalyzeEnvironment.DefaultAnalyzeTimeoutMin;
            this.SpoolRecvTimeoutSec    = AnalyzeEnvironment.DefaultSpoolRecvTimeoutSec;
            this.SizeLimit              = AnalyzeEnvironment.DefaultSizeLimit;
            this.ThreadGap              = AnalyzeEnvironment.DefaultThreadGap;
            this.AbortSizeLimit         = AnalyzeEnvironment.DefaultAbortSizeLimit;

        }

        #endregion Constructors
    }
}