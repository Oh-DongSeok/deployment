namespace FXKIS.SmartWhere.Analyzer
{
    using System;
    using System.Collections.Concurrent;
    using System.IO;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;

    using log4net;

    using CommonIF;



    public partial class AnalyzeService : ServiceBase
    {
        #region Constants

        public const string LogConfigFileName  = "LogConfig-AnalyzeService.xml";
        public const string ServiceDisplayName = "SmartWhere v3.0 Analyze Service";
        
        #endregion Constants



        #region Properties :: Collections

        public ConcurrentQueue<AnalyzedSpoolInfo> QueueSpoolFile { get; private set; }

        #endregion Properties :: Collections



        #region Properties

        private SmartWhereEnvironment   Environment  { get; set; }
        private CancellationTokenSource CancelSource { get; set; }

        #endregion Properties



        #region Properties :: Primary Thread (Task)

        private Thread ThreadRecvSpool { get; set; }
        private Thread ThreadAnalyze   { get; set; }

        #endregion  Properties :: Primary Thread (Task)



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(AnalyzeService));

        #endregion Variables :: Log4net



        #region Constructors

        public AnalyzeService ()
        {
            this.InitializeComponent();

            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Event Handler Methods

        protected override void OnStart (string[] args)
        {
            try
            {
                // Load a Environment
                this.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);

                // Initialize a Logger
                this.InitializeLogger();

                // Initialize Thread objects
                SpoolReceiver recv    = new SpoolReceiver (this.Environment, this.QueueSpoolFile, this.CancelSource.Token);
                Analyzer      analyze = new Analyzer      (this.Environment, this.QueueSpoolFile, this.CancelSource.Token);

                recv.ListenFailed += this.Recv_ListenFailed;

                // Start a Thread "Recv Spoolinfo from Recv Service"
                this.ThreadRecvSpool = new Thread(recv.Start);
                this.ThreadRecvSpool.Start();

                // Start a Thread "Analyze a Spool"
                this.ThreadAnalyze = new Thread(analyze.Start);
                this.ThreadAnalyze.Start();

                Logger.InfoFormat("START \"{0}\"", AnalyzeService.ServiceDisplayName);
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "OnStart()"), ex);

                this.ExitCode = (int)GetLastError();
                this.Stop();
                throw;
            }
        }

        protected override void OnStop () 
        {
            try
            {
                if (this.CancelSource != null)
                {
                    this.CancelSource.Cancel();
                }

                Logger.InfoFormat("CLOSE \"{0}\"", AnalyzeService.ServiceDisplayName);
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "SERVICE STOPPING"), ex);
            }
        }

        private void Recv_ListenFailed (object sender, EventArgs e)
        {
            this.Stop();
        }

        #endregion Event Handler Methods



        #region Methods
        
        private void InitializeProperties ()
        {
            this.Environment     = null;
            this.ThreadRecvSpool = null;
            this.ThreadAnalyze   = null;

            this.CancelSource = new CancellationTokenSource();
        }

        private void InitializeCollections ()
        {
            this.QueueSpoolFile = new ConcurrentQueue<AnalyzedSpoolInfo>();
        }

        private void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            this.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, AnalyzeService.LogConfigFileName)));

            // Set a Log Level to Logger
            this.Environment.ApplyLogLevel();
        }

        #endregion Methods



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion Methods :: Native Methods
    }
}