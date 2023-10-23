namespace FXKIS.SmartWhere.Watch
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;

    using log4net;

    using CommonIF;

    using Common;



    public partial class WatchService : ServiceBase
    {
        #region Constants

        public  const string LogConfigFileName  = "LogConfig-WatchService.xml";
        public  const string ServiceDisplayName = "SmartWhere v3.0 Watch Service";

        private const int    WaitTimeForKillProcessMS = 100;

        #endregion Constants



        #region Properties

        private SmartWhereEnvironment Environment    { get; set; }
        private Thread                ThreadWatching { get; set; }

        #endregion Properties



        #region Variables :: Service Control

        public CancellationTokenSource CancelSource = new CancellationTokenSource();

        #endregion Variables :: Service Control



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(WatchService));

        #endregion Variables :: Log4net



        #region Constructors

        public WatchService ()
        {
            this.InitializeComponent();

            this.InitializeProperties();
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

                // Start a Thread "Watching"
                this.ThreadWatching = new Thread(this.ProcessWatching);
                this.ThreadWatching.Start();

                Logger.InfoFormat("START \"{0}\"", WatchService.ServiceDisplayName);
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

                Logger.InfoFormat("CLOSE \"{0}\"", WatchService.ServiceDisplayName);
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "SERVICE STOPPING"), ex);
            }
        }

        #endregion Event Handler Methods



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Environment = null;
            this.CancelSource = new CancellationTokenSource();
        }

        private void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            this.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, WatchService.LogConfigFileName)));

            // Set a Log Level to Logger
            this.Environment.ApplyLogLevel();
        }

        #endregion Methods :: Initialize



        #region Methods :: Primary functions

        public void ProcessWatching ()
        {
            try
            {
                while (this.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        
                        foreach (var pair in this.Environment.Watcher.DictionaryService)
                        {
                            ServiceInformation info = pair.Value;

                            ServiceController sc = null;

                            try
                            {
                                sc = this.GetServiceController(info.Name);

                                if (sc == null)
                                {
                                    Logger.WarnFormat("Service \"{0}\"'s Controller creation failed. Please check the existence of the Service. (EXE: {1})", info.Name, info.ProcessName);
                                    continue;
                                }

                                //////////////////////////////////////////////////////////////////////////
                                // Check a Service Status is Normal
                                //////////////////////////////////////////////////////////////////////////

                                if (sc.Status == ServiceControllerStatus.Running && Process.GetProcessesByName(info.ProcessName) != null)
                                {
                                    // Normal Status
                                    continue;
                                }

                                //////////////////////////////////////////////////////////////////////////
                                // IF Service is Stop-pending, THEN Kill the Process by Executable name
                                //////////////////////////////////////////////////////////////////////////

                                if (sc.Status == ServiceControllerStatus.StopPending)
                                {
                                    Logger.WarnFormat("Service \"{0}\"'s status is Stop-pedding. Try to kill process forcibly by Executable ({1}).", info.Name, info.ProcessName);

                                    this.KillProcess(info.ProcessName);
                                }

                                //////////////////////////////////////////////////////////////////////////
                                // IF Service is Stop, THEN Kill the Process by Port
                                //////////////////////////////////////////////////////////////////////////

                                if (sc.Status == ServiceControllerStatus.Stopped)
                                {
                                    // KILL PROCESS by PORT
                                    if (info.UseNetwork == true)
                                    {
                                        Logger.WarnFormat("Service \"{0}\"'s status is Stop. Try to kill process forcibly by Port #{1}.", info.Name, info.Port);

                                        this.KillProcess(info.Port);
                                    }

                                    Logger.WarnFormat("Service \"{0}\"'s status is Stop. Try to restart.", info.Name);

                                    // RESTART SERVICE
                                    try
                                    {
                                        sc.Start();

                                        Logger.InfoFormat("Service \"{0}\"' restart succeed.", info.Name);
                                    }
                                    catch (Exception ex)
                                    {
                                        Logger.Error(string.Format("Service \"{0}\"' restart failed.", info.Name), ex);
                                    }
                                }

                                //////////////////////////////////////////////////////////////////
                            }
                            catch (Exception ex)
                            {
                                Logger.Error(string.Format("Service Watching failed - (SERVICE: {0}, PORT: {1})", info.Name, info.Port), ex);
                                continue;
                            }
                        }

                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error("EXCEPTION Occured :: during PROCESS for Watching SmartWhere Services", ex);
                    }
                    finally
                    {
                        if (this.CancelSource.IsCancellationRequested == false)
                        {
                            Thread.Sleep(this.Environment.Watcher.IntervalMS);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("EXCEPTION Occured :: during PROCESS for Watching SmartWhere Services", ex);
            }
            finally
            {
                this.CancelSource.Cancel();
            }
        }

        #endregion Methods :: Primary functions



        #region Methods :: Service & Process

        private ServiceController GetServiceController (string name)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            try
            {
                ServiceController sc = new ServiceController(name);

                ServiceControllerStatus status = sc.Status;

                return sc;
            }
            catch
            {
                return null;
            }
        }

        private void KillProcess (string name)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            try
            {
                Process[] arrProcess = Process.GetProcessesByName(name);

                if (arrProcess == null || arrProcess.Length < 1)
                {
                    return;
                }

                foreach (Process process in arrProcess)
                {
                    int pid = -1;

                    try
                    {
                        pid = process.Id;

                        process.Kill();

                        Logger.InfoFormat("Process kill succeed (EXE: {0}, PID: {1})", name, pid);
                    }
                    catch (Exception ex)
                    {
                        Logger.Warn(string.Format("Process kill failed (EXE: {0}, PID: {1})", name, pid), ex);
                        continue;
                    }
                }

                Thread.Sleep(WatchService.WaitTimeForKillProcessMS);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(string.Format("EXCEPTION Occured :: during Kill the Process (Executable: {0})", name), ex);
            }
        }

        private void KillProcess (int localPort)
        {
            if (localPort < 0)
            {
                throw new ArgumentOutOfRangeException("int localPort", localPort, string.Format("Port value is less than 0 ({0} < {1})", localPort, 0));
            }

            if (localPort > 65535)
            {
                throw new ArgumentOutOfRangeException("int localPort", localPort, string.Format("Port value is greater than 65535 ({0} > {1})", localPort, 65535));
            }

            try
            {
                Process[] arrProcess = DotNetStat.GetProcessesByPort(localPort);

                if (arrProcess == null || arrProcess.Length < 1)
                {
                    return;
                }

                foreach (Process process in arrProcess)
                {
                    int pid = -1;

                    try
                    {
                        pid = process.Id;

                        process.Kill();

                        Logger.InfoFormat("Process kill succeed (PORT: {0}, PID: {1})", localPort, pid);
                    }
                    catch (Exception ex)
                    {
                        Logger.Warn(string.Format("Process kill failed (PORT: {0}, PID: {1})", localPort, pid), ex);
                        continue;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(string.Format("EXCEPTION Occured :: during Kill the Process forcibly by Port #{0}", localPort), ex);
            }
        }

        #endregion Methods :: Service & Process



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion Methods :: Native Methods
    }
}
