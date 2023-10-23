using FXKIS.Common.Environment;
using FXKIS.Common.Extension;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ABL_Environment
{
    public class PdfReceiveEnvironment
    {
        public const int    DefaultServerIdx     = 0;
        public const string EnvironmentFileName  = "PdfReceive_Environment.json";
        public const string XmlTemplateFileName  = "XmlTemplate.xml";
                                                 
        public const string DefaultHttpHost      = "127.0.0.1";
        public const int    DefaultHttpPort      = 8080;
        public const string DefaultDBBridgeHost  = "13.197.1.105";


        public const int DefaultWaitTimeoutMS    = 3000;
        public const int MaxWaitTimeoutMS        = 5000;
        public const int MinWaitTimeoutMS        = 1000;
                                                 
        public const int DefaultDBBridgePort     = 9559;
        public const int MaxPort                 = 65535;
        public const int MinPort                 = 0;
                                                 
        public const int DefaultLimitClientCnt   = 3000;

        public const int DefaultThreadTimeoutSec = 300;
        public const int MaxThreadTimeoutSec     = 6000;
        public const int MinThreadTimeoutSec     = 10;

        public const int DefaultProcessTimeoutMS = 300000; // 5 minute

        // PROPERTY "ListenRetryCount" :: default 5 cnt (range: 1 ~ 20 cnt)
        public const int MinimumListenRetryCount =  1;
        public const int DefaultListenRetryCount =  5;
        public const int MaximumListenRetryCount = 20;

        // PROPERTY "ListenRetryIntervalMS" :: default 0.1 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumListenRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultListenRetryIntervalMS =   100; //  0.1 sec
        public const int MaximumListenRetryIntervalMS = 10000; // 10.0 sec

        public const int MinimumMemoryReleaseIntervalMS = 600000;   // 10 min
        public const int DefaultMemoryReleaseIntervalMS = 3600000;  //  1 hour
        public const int MaximumMemoryReleaseIntervalMS = 86400000; // 24 hour


        public string VeryPdfOption     { get; set; }
        public int    ServerIdx         { get; set; }
                                        
        public string HttpHost          { get; set; }
        public int    HttpPort          { get; set; }
        public string DBBridgeHost      { get; set; }

        public int DBBridgePort
        {
            get
            {
                return this._DBBridgePort;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinPort)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than {1} ({0} < {1})", value, PdfReceiveEnvironment.MinPort));
                }

                if (value > PdfReceiveEnvironment.MaxPort)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than {1} ({0} > {1})", value, PdfReceiveEnvironment.MaxPort));
                }

                this._DBBridgePort = value;
            }
        }
        private int _DBBridgePort = PdfReceiveEnvironment.DefaultDBBridgePort;

        public int LimitClientCnt { get; set; }

        public int WaitTimeoutMS
        {
            get
            {
                return this._WaitTimeoutMS;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinWaitTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("WaitTimeoutMS value is less than {1} ({0} < {1})", value, PdfReceiveEnvironment.MinWaitTimeoutMS));
                }

                if (value > PdfReceiveEnvironment.MaxWaitTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("WaitTimeoutMS value is greater than {1} ({0} > {1})", value, PdfReceiveEnvironment.MaxWaitTimeoutMS));
                }

                this._WaitTimeoutMS = value;
            }
        }
        private int _WaitTimeoutMS = PdfReceiveEnvironment.DefaultWaitTimeoutMS;


        public int ThreadTimeoutSec
        {
            get
            {
                return this._ThreadTimeoutSec;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinThreadTimeoutSec)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("ThreadTimeoutSec value is less than {1} ({0} < {1})", value, PdfReceiveEnvironment.MinThreadTimeoutSec));
                }

                if (value > PdfReceiveEnvironment.MaxThreadTimeoutSec)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("ThreadTimeoutSec value is greater than {1} ({0} > {1})", value, PdfReceiveEnvironment.MaxThreadTimeoutSec));
                }

                this._ThreadTimeoutSec = value;
            }
        }
        private int _ThreadTimeoutSec = PdfReceiveEnvironment.DefaultThreadTimeoutSec;

        public int ProcessTimeoutMS { get; set; }

        public int ListenRetryCount
        {
            get
            {
                return this._ListenRetryCount;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinimumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PdfReceiveEnvironment.MinimumListenRetryCount));
                }

                if (value > PdfReceiveEnvironment.MaximumListenRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PdfReceiveEnvironment.MaximumListenRetryCount));
                }

                this._ListenRetryCount = value;
            }
        }
        private int _ListenRetryCount = PdfReceiveEnvironment.DefaultListenRetryCount;

        public int ListenRetryIntervalMS
        {
            get
            {
                return this._ListenRetryIntervalMS;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinimumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PdfReceiveEnvironment.MinimumListenRetryIntervalMS));
                }

                if (value > PdfReceiveEnvironment.MaximumListenRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PdfReceiveEnvironment.MaximumListenRetryIntervalMS));
                }

                this._ListenRetryIntervalMS = value;
            }
        }
        private int _ListenRetryIntervalMS = PdfReceiveEnvironment.DefaultListenRetryIntervalMS;


        public int MemoryReleaseIntervalMS
        {
            get
            {
                return this._MemoryReleaseIntervalMS;
            }
            set
            {
                if (value < PdfReceiveEnvironment.MinimumMemoryReleaseIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, PdfReceiveEnvironment.MinimumMemoryReleaseIntervalMS));
                }

                if (value > PdfReceiveEnvironment.MaximumMemoryReleaseIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, PdfReceiveEnvironment.MaximumMemoryReleaseIntervalMS));
                }

                this._MemoryReleaseIntervalMS = value;
            }
        }
        private int _MemoryReleaseIntervalMS = PdfReceiveEnvironment.DefaultMemoryReleaseIntervalMS;

        #region Constructors

        public PdfReceiveEnvironment()
        {
            this.InitializeProperties();
        }

        public PdfReceiveEnvironment(string path) : this()
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            this.Load(path);
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties()
        {                                 
            this.VeryPdfOption           = string.Empty;
            this.ServerIdx               = PdfReceiveEnvironment.DefaultServerIdx;
            this.HttpHost                = PdfReceiveEnvironment.DefaultHttpHost;
            this.HttpPort                = PdfReceiveEnvironment.DefaultHttpPort;
            this.DBBridgeHost            = PdfReceiveEnvironment.DefaultDBBridgeHost;                                  
            this.DBBridgePort            = PdfReceiveEnvironment.DefaultDBBridgePort;
            this.WaitTimeoutMS           = PdfReceiveEnvironment.DefaultWaitTimeoutMS;
            this.LimitClientCnt          = PdfReceiveEnvironment.DefaultLimitClientCnt;
            this.ThreadTimeoutSec        = PdfReceiveEnvironment.DefaultThreadTimeoutSec;
            this.ProcessTimeoutMS        = PdfReceiveEnvironment.DefaultProcessTimeoutMS;
            this.ListenRetryCount        = PdfReceiveEnvironment.DefaultListenRetryCount;
            this.ListenRetryIntervalMS   = PdfReceiveEnvironment.DefaultListenRetryIntervalMS;
            this.MemoryReleaseIntervalMS = PdfReceiveEnvironment.DefaultMemoryReleaseIntervalMS;
        }

        public bool Save(string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            return FileObjectManagement.SaveJson(path, this, true);
        }

        public void Load(string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            PdfReceiveEnvironment env = FileObjectManagement.LoadJson<PdfReceiveEnvironment>(path);

            if (env == null)
            {
                throw new ArgumentException("Environment File is empty or invalid.");
            }

            this.VeryPdfOption           = env.VeryPdfOption;
            this.ServerIdx               = env.ServerIdx;
            this.HttpHost                = env.HttpHost;
            this.HttpPort                = env.HttpPort;
            this.DBBridgeHost            = env.DBBridgeHost;
            this.DBBridgePort            = env.DBBridgePort;
            this.WaitTimeoutMS           = env.WaitTimeoutMS;
            this.LimitClientCnt          = env.LimitClientCnt;
            this.ThreadTimeoutSec        = env.ThreadTimeoutSec;
            this.ProcessTimeoutMS        = env.ProcessTimeoutMS;
            this.ListenRetryCount        = env.ListenRetryCount;
            this.ListenRetryIntervalMS   = env.ListenRetryIntervalMS;
            this.MemoryReleaseIntervalMS = env.MemoryReleaseIntervalMS;
        }

        public override string ToString()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods

    }
}
