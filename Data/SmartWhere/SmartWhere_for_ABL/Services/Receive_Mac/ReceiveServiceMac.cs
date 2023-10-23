namespace FXKIS.SmartWhere.Receive.Mac
{
    using FXKIS.SmartWhere.CommonIF;
    using log4net;
    using System;
    using System.IO;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;


    public partial class ReceiveServiceMac : ServiceBase
    {
        #region Constants

        public const string LogConfigFileName = "LogConfig-ReceiveService_Mac.xml";
        public const int    StopTimeoutMS     = 1000;

        #endregion Constants



        #region Variables

        public static CancellationTokenSource CancelSource = new CancellationTokenSource();
        public static Thread Listener = null;

        public static SmartWhereEnvironment Environment = null;

        public static readonly ILog Logger = LogManager.GetLogger(typeof(ReceiveServiceMac));

        #endregion Variables



        #region Constructors

        public ReceiveServiceMac()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Event Handler Methods

        protected override void OnStart(string[] args)
        {
            try
            {
                Logger.Debug("MobilePrintingReceiveServer OnStart");

                this.InitializeConfig();

                if (ReceiveServiceMac.Environment == null)
                {
                    throw new NullReferenceException();
                }

                this.InitializeLogger();

                LprListener lpr = new LprListener();

                lpr.ListenFailed += Lpr_ListenFailed;

                ReceiveServiceMac.Listener = new Thread(lpr.Start);

                ReceiveServiceMac.Listener.Start();
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "OnStart()"), ex);

                this.ExitCode = (int)GetLastError();
                this.Stop();
                throw;
            }
        }

        protected override void OnStop()
        {
            if (ReceiveServiceMac.CancelSource != null)
            {
                ReceiveServiceMac.CancelSource.Cancel();
            }

            Thread.Sleep(ReceiveServiceMac.StopTimeoutMS);

            if (ReceiveServiceMac.Listener != null)
            {
                ReceiveServiceMac.Listener.Abort();
            }

            Logger.Debug("MobilePrintingReceiveServer OnStop");
        }

        private void Lpr_ListenFailed(object sender, EventArgs e)
        {
            this.Stop();
        }

        #endregion Event Handler Methods



        #region Methods :: Initialize

        public void InitializeConfig()
        {
            ReceiveServiceMac.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);
        }

        private void InitializeLogger()
        {
            // Set a Log Directory to Logger
            ReceiveServiceMac.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ReceiveServiceMac.LogConfigFileName)));

            // Set a Log Level to Logger
            ReceiveServiceMac.Environment.ApplyLogLevel();
        }

        #endregion Methods :: Initialize



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError();

        #endregion Methods :: Native Methods
    }
}
