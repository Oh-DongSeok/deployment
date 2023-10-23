namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.IO;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;
    using System.Threading.Tasks;

    using log4net;

    using CommonIF;



    public partial class ReceiveService : ServiceBase
    {
        #region Constants

        public const string LogConfigFileName   = "LogConfig-ReceiveService.xml";
        public const int    TaskWaitTimeoutMS   = 3000;

        #endregion Constants



        #region Variables

        public static ConcurrentQueue<ReceiveSpoolInfo> SpoolQueue    = new ConcurrentQueue<ReceiveSpoolInfo>();
        public static List<Thread>                      ThreadList    = new List<Thread>();
        public static CancellationTokenSource           CancelSource  = new CancellationTokenSource();

        public static SmartWhereEnvironment             Environment   = null;

        public static readonly ILog Logger = LogManager.GetLogger(typeof(ReceiveService));

        #endregion Variables



        #region Constructors

        public ReceiveService()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Event Handler Methods

        protected override void OnStart(string[] args)
        {
            try
            {
                this.InitializeConfig();

                if (ReceiveService.Environment == null)
                {
                    throw new NullReferenceException();
                }

                this.InitializeLogger();

                Logger.DebugFormat("====================SmartWhereSpoolReceive START====================");

                switch (ReceiveService.Environment.Recv.Mode)
                {
                    case ReceiveEnvironment.ReceiveMode.Lpr:

                        this.ReceiveLpr();
                        break;

                    case ReceiveEnvironment.ReceiveMode.Raw:

                        this.ReceiveRaw();
                        break;

                    case ReceiveEnvironment.ReceiveMode.Both:

                        this.ReceiveLpr();
                        this.ReceiveRaw();
                        break;
                }

                Logger.DebugFormat("==================== MODE : {0} ====================", ReceiveService.Environment.Recv.Mode);

                Thread manageSpoolThread = new Thread(this.ManageSpool);
                manageSpoolThread.Start();

                ReceiveService.ThreadList.Add(manageSpoolThread);
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
            if (ReceiveService.CancelSource != null)
            {
                ReceiveService.CancelSource.Cancel();
            }
            Thread.Sleep(1000);

            if (ReceiveService.ThreadList.Count > 0)
            {
                foreach (Thread thread in ReceiveService.ThreadList)
                {
                    if (thread != null)
                    {
                        try
                        {
                            thread.Abort();
                        }
                        catch { }
                    }
                }
            }

            Logger.DebugFormat("====================SmartWhereSpoolReceive STOP====================");
        }

        private void Listen_ListenFailed (object sender, EventArgs e)
        {
            this.Stop();
        }

        #endregion Event Handler Methods



        #region Methods :: Initialize

        public void InitializeConfig ()
        {
            ReceiveService.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);
        }

        private void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            ReceiveService.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ReceiveService.LogConfigFileName)));

            // Set a Log Level to Logger
            ReceiveService.Environment.ApplyLogLevel();
        }

        #endregion Methods :: Initialize



        #region Methods

        public void ReceiveLpr()
        {
            LprListener listen = new LprListener();

            listen.ListenFailed += Listen_ListenFailed;

            Thread lprThread = new Thread(listen.Start);
            lprThread.Start();

            ReceiveService.ThreadList.Add(lprThread);
        }

        public void ReceiveRaw()
        {
            RawListener listen = new RawListener();

            listen.ListenFailed += Listen_ListenFailed;

            Thread rawThread = new Thread(listen.Start);
            rawThread.Start();

            ReceiveService.ThreadList.Add(rawThread);
        }

        public void ManageSpool()
        {
            while (ReceiveService.CancelSource.IsCancellationRequested == false)
            {
                Thread.Sleep(1);

                try
                {
                    if (ReceiveService.SpoolQueue.Count < 1)
                    {
                        continue;
                    }

                    ReceiveSpoolInfo spool = null;
                    bool isSuccess = ReceiveService.SpoolQueue.TryDequeue(out spool);

                    if (spool == null || isSuccess == false)
                    {
                        continue;
                    }

                    Logger.DebugFormat("SpoolQueue Dequeue : {0}({1})", spool.SpoolFile.Name, spool.SpoolFile.Length);

                    AnalyzerSender sender = new AnalyzerSender(spool);

                    Task analyzerSener = Task.Run(() => sender.Send(sender));

                    isSuccess = analyzerSener.Wait(ReceiveService.TaskWaitTimeoutMS);

                    if (isSuccess == false)
                    {
                        sender.Client.Close();
                        sender.AttemptNum = ReceiveService.Environment.Recv.SendAttemptCount;
                    }
                }
                catch (ThreadAbortException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Logger.WarnFormat("ManageSpool Exception : {0}({1})", ex.Message, ex.StackTrace);
                }
            }
        }

        #endregion Methods



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion Methods :: Native Methods
    }
}