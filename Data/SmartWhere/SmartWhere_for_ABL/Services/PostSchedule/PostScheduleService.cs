namespace FXKIS.SmartWhere.PostSchedule
{
    using System;
    using System.Collections.Concurrent;
    using System.IO;
    using System.Net.Sockets;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;
    using System.Threading.Tasks;

    using log4net;

    using Common.Environment;
    using Common.Extension;

    using CommonIF;
    using System.Diagnostics;

    public partial class PostScheduleService : ServiceBase
    {
        #region Constants

        private const string EnvironmentFileName = "SmartWhere_Environment.json";
        private const string LogConfigFileName   = "LogConfig-PostScheduleService.xml";
        private const string ExtensionExecutable = ".EXE";

        #endregion Constants



        #region Properties :: Collections

        public ConcurrentQueue<TcpClient>               QueueClient  { get; private set; }
        public ConcurrentQueue<PrintJobFileInformation> QueueJobFile { get; private set; }

        #endregion Properties :: Collections



        #region Properties

        private SmartWhereEnvironment   Environment  { get; set; }
        private CancellationTokenSource CancelSource { get; set; }

        #endregion Properties



        #region Properties :: Primary Thread (Task)

        private Task TaskHttpServer            { get; set; }
        private Task TaskHttpProcess           { get; set; }
        private Task TaskExecutePrintingModule { get; set; }

        #endregion  Properties :: Primary Thread (Task)



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(PostScheduleService));

        #endregion Variables :: Log4net



        #region Constructors

        public PostScheduleService ()
        {
            this.InitializeComponent();

            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Event Handler Methods :: Start & Stop

        protected override void OnStart(string[] args)
        {
            try
            {
                ////////////////////////////////////////////////////////////////////////
                // Initialize
                ////////////////////////////////////////////////////////////////////////

                this.InitializeEnvironments();

                Logger.Info("============ POST PROCESS SCHEDULER [START] ============");



                ////////////////////////////////////////////////////////////////////////
                //
                // TASK [HttpServer] : Receive a Connection from Client
                //
                //======================================================================
                //
                //   1. CLIENT to SERVER의 Connection을 수신 (C/S to POST-SCHEDULER)
                //
                //   2. 수신된 Connection을 Enqueue
                //
                ////////////////////////////////////////////////////////////////////////

                CSHttpServer httpServer = new CSHttpServer(this.QueueClient, this.Environment);

                httpServer.ListenFailed += this.HttpServer_ListenFailed;

                this.TaskHttpServer = Task.Factory.StartNew(() => httpServer.StartAsync(this.CancelSource));



                ////////////////////////////////////////////////////////////////////////
                //
                // TASK [HttpProcess] : Request to Response, Process for Request
                //
                //======================================================================
                //
                //   1. 수신된 Connection을 Dequeue
                //
                //   2. Connection에서 Request Message 수신
                //
                //   3. Request Message를 Parsing -> Request 종류에 따른 처리
                //      - GetUsagePrnCnt
                //      - GetPrnListPolicy
                //      - RegisterCard
                //      - DeleteSelected
                //      - PrintAll      ┰━> (event: PrintExecuted) PrintJob 파일 생성 -> PrintJob 파일의 경로를 Enqueue
                //      - PrintSelected ┛
                //
                //   4. 처리 결과에 대한 Response Message를 작성 -> Response Message 송신
                //
                //   5. Connection Close
                //
                ////////////////////////////////////////////////////////////////////////

                CSHttpProcess httpProcess = new CSHttpProcess(this.QueueClient, this.QueueJobFile, this.Environment);

                this.TaskHttpProcess = Task.Factory.StartNew(() => httpProcess.StartAsync(this.CancelSource));



                ////////////////////////////////////////////////////////////////////////
                //
                // TASK [ExecutePrintingModule] : Execute a Printing Module for Print Job(s)
                //
                //======================================================================
                //
                //   - Printing Module 실행 스레드
                //      1. PrintJob 파일의 경로를 Dequeue
                //      2. "module_filename ini_filename" 실행 -> 실행 프로세스의 객체를 Enqueue
                //
                //   - Printing Module 프로세스 관리 스레드
                //      1. 실행 프로세스 객체를 Dequeue
                //      2. 실행 프로세스 객체의 실행 제한시간 참조
                //          - IF time over     : Terminate
                //          - IF time not over : Re-enqueue
                //
                ////////////////////////////////////////////////////////////////////////

                ExecutePrintingModule executePrintingModule = new ExecutePrintingModule(this.QueueJobFile, this.Environment);

                this.TaskExecutePrintingModule = Task.Factory.StartNew(() => executePrintingModule.StartAsync(this.CancelSource));
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "OnStart()"), ex);

                this.ExitCode = (int)GetLastError();
                this.Stop();
                throw;
            }

            Logger.Info(">>>>>>>>>>>>>>>>>>>>>   OnStart() : Success");
        }

        protected override void OnStop()
        {
            this.KillProcessByName(this.Environment.PrintingModule.NameForMMD2);
            this.KillProcessByName(this.Environment.PrintingModule.NameForMobile);
            this.KillProcessByName(this.Environment.PrintingModule.NameForMac);
            
            try
            {
                if (this.CancelSource != null)
                {
                    CancelSource.Cancel();
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "OnStop()"), ex);

                this.ExitCode = (int)GetLastError();
            }

            Logger.Info(">>>>>>>>>>>>>>>>>>>>>   OnStop() : Success");
        }

        #endregion Event Handler Methods :: Start & Stop



        #region Event Handler Methods

        private void HttpServer_ListenFailed (object sender, EventArgs e)
        {
            this.Stop();
        }

        #endregion Event Handler Methods



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Environment = null;

            this.TaskHttpServer            = null;
            this.TaskHttpProcess           = null;
            this.TaskExecutePrintingModule = null;

            this.CancelSource = new CancellationTokenSource();
        }

        private void InitializeCollections ()
        {
            this.QueueClient  = new ConcurrentQueue<TcpClient>();
            this.QueueJobFile = new ConcurrentQueue<PrintJobFileInformation>();
        }

        private void InitializeEnvironments ()
        {
            //////////////////////////////////////////////////////////////////
            // LOAD a Environment file
            //////////////////////////////////////////////////////////////////

            try
            {
                this.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);
            }
            catch { }

            //////////////////////////////////////////////////////////////////
            // IF env file is not exists, THEN create a default env file.
            //////////////////////////////////////////////////////////////////

            bool newEnv = false;
            string path = string.Empty;

            if (this.Environment == null)
            {
                newEnv = true;

                this.Environment = new SmartWhereEnvironment();

                path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PostScheduleService.EnvironmentFileName);
            }

            //////////////////////////////////////////////////////////////////
            // Apply log level (Environment file -> log4net configure)
            //////////////////////////////////////////////////////////////////

            this.InitializeLogger();

            this.Environment.ApplyLogLevel();

            //////////////////////////////////////////////////////////////////
            // IF env file is not exists, THEN save a default env file.
            //////////////////////////////////////////////////////////////////

            if (newEnv == true)
            {
                Logger.WarnFormat("Failed to Load a Environment file. Create a new Environment file. (PATH: {0})", path);

                FileObjectManagement.SaveJson(path, this.Environment, true);
            }

            //////////////////////////////////////////////////////////////////
            // CHECK Printing Module executable files (MMD2) / Mobile)
            //////////////////////////////////////////////////////////////////

            if (this.Environment.PrintingModule.UseMMD2 == true)
            {
                this.CheckExecutableFile(this.Environment.PrintingModule.NameForMMD2, "\"MMD2 Printing Module\"");
            }

            if (this.Environment.PrintingModule.UseMobile == true)
            {
                this.CheckExecutableFile(this.Environment.PrintingModule.NameForMobile, "\"Mobile Printing Module\"");
            }

            //if (this.Environment.PrintingModule.UseMac == true)
            //{
            //    this.CheckExecutableFile(this.Environment.PrintingModule.NameForMac, "\"MacOS Printing Module\"");
            //}

            Logger.DebugFormat("Initialize a ServiceEnvironment:\n{0}", SerializationEx.ObjectToJson(this.Environment));
        }

        private void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            this.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PostScheduleService.LogConfigFileName)));

            // Set a Log Level to Logger
            this.Environment.ApplyLogLevel();
        }

        #endregion Methods :: Initialize



        #region Methods

        private void CheckExecutableFile (string fileName, string title = null)
        {
            if (title == null)
            {
                title = "";
            }
            else
            {
                title += " ";
            }

            string pathExecutable = fileName;

            if (string.IsNullOrWhiteSpace(pathExecutable) == true)
            {
                throw new InvalidDataException(string.Format("Path of {0} executable file is empty.", title));
            }

            if (Path.IsPathRooted(pathExecutable) == false)
            {
                pathExecutable = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathExecutable);
            }

            FileInfo fiExecutable = new FileInfo(pathExecutable);

            if (fiExecutable == null || fiExecutable.Exists == false)
            {
                throw new FileNotFoundException(string.Format("{0} executable file is not exists.", title), pathExecutable);
            }

            if (fiExecutable.Extension == null || fiExecutable.Extension.ToUpper() != PostScheduleService.ExtensionExecutable)
            {
                throw new InvalidDataException(string.Format("Extension of {0} executable file is invalid.", title));
            }
        }

        private void KillProcessByName(string psName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(psName) == true)
                {
                    return;
                }
                
                psName = Path.GetFileNameWithoutExtension(psName);

                Process[] processList = Process.GetProcessesByName(psName);
                if (processList.Length > 0)
                {
                    foreach (Process ps in processList)
                    {
                        try
                        {
                            ps.Kill();
                            Logger.InfoFormat("Process kill succeed (Name: {0})", psName);
                        }
                        catch (Exception)
                        {
                            Logger.Error(string.Format("Process kill failed (Name: {0})", psName));
                        }
                       
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during Kill the process forcibly by Name {0}", psName),ex);
            }
           
        }

        #endregion Methods



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion Methods :: Native Methods
    }
}
