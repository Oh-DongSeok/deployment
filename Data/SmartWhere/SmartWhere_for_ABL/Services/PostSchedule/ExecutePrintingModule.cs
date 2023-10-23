namespace FXKIS.SmartWhere.PostSchedule
{
    using System;
    using System.Collections.Concurrent;
    using System.Diagnostics;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;

    using log4net;

    using Common.Extension;

    using CommonIF;



    public class ExecutePrintingModule
    {
        #region Constants
        
        private const int ExecutePrintingModuleWaitingCycleMS = 1000;
        private const int VerifyExecuteProcessCycleMS         = 500;

        #endregion Constants



        #region Properties :: Collections

        private ConcurrentQueue<PrintJobFileInformation> QueueJobFile        { get; set; }
        private ConcurrentQueue<ExeProcessInformation>   QueuePrintingModule { get; set; }

        #endregion Properties :: Collections



        #region Properties

        private SmartWhereEnvironment   Environment              { get; set; }
        private Task                    TaskVerifyExecuteProcess { get; set; }
        private CancellationTokenSource CancelToken              { get; set; }

        #endregion Properties



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(ExecutePrintingModule));

        #endregion Variables :: Log4net



        #region Constructors

        public ExecutePrintingModule (ConcurrentQueue<PrintJobFileInformation> queueJobFile, SmartWhereEnvironment env)
        {
            if (queueJobFile == null)
            {
                throw new ArgumentNullException("ConcurrentQueue<PrintJobFileInformation> queueJobFile");
            }

            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.QueueJobFile        = queueJobFile;
            this.QueuePrintingModule = new ConcurrentQueue<ExeProcessInformation>();
            this.Environment         = env;
        }

        #endregion Constructors



        #region Methods

        public async Task StartAsync (CancellationTokenSource cancelToken)
        {
            this.CancelToken = cancelToken;

            this.TaskVerifyExecuteProcess = Task.Factory.StartNew(() => this.VerifyExecuteProcess());

            ///////////////////////////////////////////////////////////

            string pathModule       = string.Empty;
            string pathModuleMMD2   = this.Environment.PrintingModule.NameForMMD2;
            string pathModuleMobile = this.Environment.PrintingModule.NameForMobile;
            string pathModuleMacOS  = this.Environment.PrintingModule.NameForMac;

            if (Path.IsPathRooted(pathModuleMMD2) == false)
            {
                pathModuleMMD2 = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathModuleMMD2);
            }

            if (Path.IsPathRooted(pathModuleMobile) == false)
            {
                pathModuleMobile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathModuleMobile);
            }

            if (Path.IsPathRooted(pathModuleMacOS) == false)
            {
                pathModuleMacOS = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathModuleMacOS);
            }

            ///////////////////////////////////////////////////////////

            PrintJobFileInformation jobFile = null;

            while (this.CancelToken.IsCancellationRequested == false)
            {
                await Task.Delay(1);

                try
                {
                    ////////////////////////////////////////////////////////////////////////

                    if (this.QueuePrintingModule.Count >= this.Environment.PostScheduler.PrintingModuleCount)
                    {
                        await Task.Delay(ExecutePrintingModule.ExecutePrintingModuleWaitingCycleMS, this.CancelToken.Token);
                        continue;
                    }

                    if (this.QueueJobFile.TryDequeue(out jobFile) == false)
                    {
                        continue;
                    }

                    Logger.DebugFormat("PrintJob File Dequeue (PATH: {0}, DRIVER: {1})", jobFile.Path, jobFile.Driver);

                    if (File.Exists(jobFile.Path) == false)
                    {
                        Logger.WarnFormat("PrintJob file is not exists (PATH: {0}, DRIVER: {1})", jobFile.Path, jobFile.Driver);
                        continue;
                    }

                    ////////////////////////////////////////////////////////////////////////

                    switch (jobFile.Driver)
                    {
                        case PrintJobData.PrintDriverType.MMD2:
                            pathModule = pathModuleMMD2;
                            break;

                        case PrintJobData.PrintDriverType.Mobile:
                        case PrintJobData.PrintDriverType.MobilePCL:
                            pathModule = pathModuleMobile;
                            break;

                        case PrintJobData.PrintDriverType.MacOS:
                            pathModule = pathModuleMacOS;
                            break;

                        default:
                            Logger.WarnFormat("Driver of PrintJob file is invalid (PATH: {0}, DRIVER: {1})", jobFile.Path, jobFile.Driver);
                            continue;
                    }

                    ProcessStartInfo startinfo = new ProcessStartInfo()
                    {
                        CreateNoWindow  = true,
                        UseShellExecute = false,
                        FileName        = pathModule,
                        WindowStyle     = ProcessWindowStyle.Hidden,
                        Arguments       = jobFile.Path
                    };

                    Process process = Process.Start(startinfo);

                    ExeProcessInformation info = new ExeProcessInformation(process, DateTime.Now, jobFile);

                    this.QueuePrintingModule.Enqueue(info);

                    Logger.DebugFormat("Printing Module Process Start & Enqueue :: (PROCESS_ID: {0}, JOBFILE_PATH: {1}, JOBFILE_DRIVER: {2})", process.Id, jobFile.Path, jobFile.Driver);

                    ////////////////////////////////////////////////////////////////////////
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Execute a Printing Module"), ex);
                }
            }
        }

        private async Task VerifyExecuteProcess ()
        {
            ExeProcessInformation info = null;

            while (this.CancelToken.IsCancellationRequested == false)
            {
                await Task.Delay(ExecutePrintingModule.VerifyExecuteProcessCycleMS, this.CancelToken.Token);

                int processID = -1;

                try
                {
                    if (this.QueuePrintingModule.Count < 1)
                    {
                        continue;
                    }

                    info = null;

                    if (this.QueuePrintingModule.TryDequeue(out info) == false)
                    {
                        continue;
                    }

                    ////////////////////////////////////////////////////////////////////////

                    Process exeProcess = Process.GetProcessById(info.ProcessInfo.Id);

                    processID = info.ProcessInfo.Id;
                    
                    // Print.exe 실행 프로세스 Timed-out
                    if (info.ExecutedTime.IsOverThanNow(0, 0, this.Environment.PostScheduler.PrintingModuleTimeoutMin, 0) == true)
                    {
                        Logger.InfoFormat("Printing Module Process is timed out. (PROCESS_ID: {0}, JOBFILE_PATH: {1}, JOBFILE_DRIVER: {2}, EXECUTED_TIME: {3}, EXPIRATION_TIME: {4} min)", processID, info.PrintJobFile.Path, info.PrintJobFile.Driver, info.ExecutedTime.ToString("yyyy/MM/dd HH:mm:ss.fff"), this.Environment.PostScheduler.PrintingModuleTimeoutMin);

                        exeProcess.Kill();

                        this.ClearProcessAndFile(info);

                        continue;
                    }

                    // Re-enqueue (not Timed-out, 관리 대상 Process)
                    this.QueuePrintingModule.Enqueue(info);
                }
                catch (ArgumentException)
                {
                    if (info != null)
                    {
                        Logger.DebugFormat("Printing Module Process have been already closed. (PROCESS_ID: {0}, JOBFILE_PATH: {1}, JOBFILE_DRIVER: {2})", processID, info.PrintJobFile.Path, info.PrintJobFile.Driver);

                        this.ClearProcessAndFile(info);
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Verify a Printing Module Process"), ex);

                    if (info != null)
                    {
                        this.ClearProcessAndFile(info);
                    }
                }
            }
        }

        private void ClearProcessAndFile (ExeProcessInformation info)
        {
            int processID = -1;

            try
            {
                processID = info.ProcessInfo.Id;

                info.ProcessInfo.Close();
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0} (PROCESS_ID: {1}, JOBFILE_PATH: {2}, JOBFILE_DRIVER: {3})", "Close a Process Object", processID, info.PrintJobFile.Path, info.PrintJobFile.Driver), ex);
            }

            //TODO :: PrintJobFile Delete 부분
            try
            {
                File.Delete(info.PrintJobFile.Path);

                Logger.DebugFormat("PrintJob File Deleted (JOBFILE_PATH: {0}, JOBFILE_DRIVER: {1})", info.PrintJobFile.Path, info.PrintJobFile.Driver);
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0} (PROCESS_ID: {1}, JOBFILE_PATH: {2}, JOBFILE_DRIVER: {3})", "Delete a PrintJob file", processID, info.PrintJobFile.Path, info.PrintJobFile.Driver), ex);
            }
        }

        #endregion Methods
    }
}