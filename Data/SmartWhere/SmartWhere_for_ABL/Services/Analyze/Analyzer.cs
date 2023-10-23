namespace FXKIS.SmartWhere.Analyzer
{
    using System;
    using System.Collections.Concurrent;
    using System.Diagnostics;
    using System.IO;
    using System.Threading;

    using log4net;

    using Common.Environment;
    using Common.Extension;

    using Approval;
    using CommonIF;
    using Metadata;

    using PDL.Analyze;



    public class Analyzer
    {
        #region Constants
        
        #endregion Constants



        #region Constants :: Values

        private const string ValueSimplex         = @"S";
        private const string ValueDuplexLongEdge  = @"DL";
        private const string ValueDuplexShortEdge = @"DS";
        private const string ValueColor           = @"C";
        private const string ValueBlackWhite      = @"B";
        private const string ValueImageLogLinkage = @"M";
        private const string ValueFlagYes         = @"Y";
        private const string ValueFlagNo          = @"N";

        #endregion Constants :: Values



        #region Constants :: about PrintJob File

        private const string ExtensionJSON  = ".json";
        private const string ExtensionPDF   = ".pdf";
        private const string FormatJsonName = "{0}_{1}_{2}_{3:00}.json";
        private const string DriverTypeMMD2 = "swPrn_MMD2";

        private const int ExecutePrintingModuleWaitingCycleMS = 1000;
        private const int VerifyExecuteProcessCycleMS         = 500;

        #endregion Constants :: about PrintJob File



        #region Properties

        public  SmartWhereEnvironment Environment            { get; private set; }
        private Thread                ThreadManaging         { get; set; }
        private Thread                ThreadPrintJobFile     { get; set; }
        private Thread                ThreadVerifyExecutable { get; set; }
        public  CancellationToken     CancelToken            { get; private set; }

        #endregion Properties



        #region Collections
        public  ConcurrentQueue<AnalyzedSpoolInfo>     QueueSpool          { get; private set; }
        private ConcurrentQueue<string>                QueuePrintJobFile   { get; set; }
        private ConcurrentQueue<ExeProcessInformation> QueuePrintingModule { get; set; }
        private ConcurrentQueue<AnalyzedSpoolThread>   QueueManagedThread  { get; set; }

        #endregion Collections



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Analyzer));

        #endregion Variables :: Log4net



        #region Constructors

        public Analyzer (SmartWhereEnvironment env, ConcurrentQueue<AnalyzedSpoolInfo> queueSpool, CancellationToken token)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (queueSpool == null)
            {
                throw new ArgumentNullException("ConcurrentQueue<AnalyzedSpoolInfo> queueSpool");
            }

            this.Environment    = env;
            this.ThreadManaging = null;
            this.CancelToken    = token;

            this.QueueSpool          = queueSpool;
            this.QueuePrintJobFile   = new ConcurrentQueue<string>();
            this.QueuePrintingModule = new ConcurrentQueue<ExeProcessInformation>();
            this.QueueManagedThread  = new ConcurrentQueue<AnalyzedSpoolThread>();
        }

        #endregion Constructors



        #region Methods

        public void Start (object stateInfo)
        {
            AnalyzedSpoolInfo spool = null;

            bool isCountEqualFirst = false;
            bool isCountEqualSecond = false;
            bool isCountEqualThird = false;

            try
            {
                this.ThreadManaging = new Thread(this.ManageThreads);
                this.ThreadManaging.Start();

                this.ThreadPrintJobFile = new Thread(this.ExecutePrintingModule);
                this.ThreadPrintJobFile.Start();

                this.ThreadVerifyExecutable = new Thread(this.VerifyExecuteProcess);
                this.ThreadVerifyExecutable.Start();


                /////////////////////////////////////////////////////////////////////////////////
                // LOOP for Analyze spoolfile
                /////////////////////////////////////////////////////////////////////////////////

                while (this.CancelToken.IsCancellationRequested == false)
                {
                    isCountEqualFirst = false;
                    isCountEqualSecond = false;
                    isCountEqualThird = false;

                    Thread.Sleep(this.Environment.Analyzer.ThreadGap);

                    if (this.QueueManagedThread.Count == this.Environment.Analyzer.ThreadLimitCountHeavy)
                    {
                        isCountEqualFirst = true;
                        System.Threading.Thread.Sleep(100);

                        if (this.QueueManagedThread.Count == this.Environment.Analyzer.ThreadLimitCountHeavy)
                        {
                            isCountEqualSecond = true;
                            System.Threading.Thread.Sleep(100);

                            if (this.QueueManagedThread.Count == this.Environment.Analyzer.ThreadLimitCountHeavy)
                            {
                                isCountEqualThird = true;
                                System.Threading.Thread.Sleep(100);
                            }
                        }
                        //Logger.InfoFormat("Thread Count is {0}, Limit is {1}", this.QueueManagedThread.Count, this.Environment.Analyzer.ThreadLimitCountHeavy);                     

                        continue;
                    }

           
                    if (this.QueueSpool.IsEmpty == true)
                    {
                        continue;
                    }

                    if (this.QueueSpool.TryDequeue(out spool) == false)
                    {
                        continue;
                    }

                    if (isCountEqualFirst == true && isCountEqualSecond == true && isCountEqualThird == true)
                    {
                        Logger.InfoFormat("Thread Count is {0}, Limit is {1}", this.QueueManagedThread.Count, this.Environment.Analyzer.ThreadLimitCountHeavy);
                        continue;
                    }



                    /////////////////////////////////////////////////////////////////////////////////
                    // Start a Thread "Recv Spoolinfo from Recv Service"
                    /////////////////////////////////////////////////////////////////////////////////

                    try
                    {
                        Thread thread = new Thread(new ParameterizedThreadStart(this.ProcessAnalyzing));

                        AnalyzedSpoolThread threadAnalyzed = new AnalyzedSpoolThread(spool);

                        threadAnalyzed.Start(thread);

                        this.QueueManagedThread.Enqueue(threadAnalyzed);
                    }
                    catch (Exception ex)
                    {
                        Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "Spoolfile Analyzing"), ex);
                    }

                    /////////////////////////////////////////////////////////////////////////////////
                }

                /////////////////////////////////////////////////////////////////////////////////
            }
            catch (ThreadAbortException)
            {
                if (this.ThreadManaging != null)
                {
                    this.ThreadManaging.Abort();
                }

                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Spoolfile Analyzing");
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "Spoolfile Analyzing"), ex);
            }
        }

        public void ProcessAnalyzing (object stateInfo)
        {
            if (stateInfo == null)
            {
                throw new ArgumentNullException("object stateInfo");
            }

            if ((stateInfo is AnalyzedSpoolInfo) == false)
            {
                throw new ArgumentException("Argument type is Invalid. not AnalyzedSpoolInfo");
            }

            AnalyzedSpoolInfo spool = stateInfo as AnalyzedSpoolInfo;

            try
            {
                if (spool.SpoolFile.Exists == false)
                {
                    Logger.ErrorFormat("Analyzed Spoolfile is not exists (PATH: {0}, CLIENT: {1})", spool.SpoolFile.Name, spool.ClientIPAddress);
                    return;
                }

                try
                {
                    using (PrnExtractor extractor = new PrnExtractor(spool.SpoolFile))
                    {
                        /////////////////////////////////////////////////////////////////////////////////
                        // Extract a data from PCL-XL spool file
                        /////////////////////////////////////////////////////////////////////////////////

                        PrnExtractedData data = extractor.Extract(this.Environment.Database);

                        if (data == null)
                        {
                            Logger.ErrorFormat("Failed to Analyze a Spoolfile (PATH: {0}, CLIENT: {1})", spool.SpoolFile.Name, spool.ClientIPAddress);
                            return;
                        }

                        Logger.DebugFormat("Policy (User: {0})\n{1}", data.Policy.UserID, data.Policy.ToString());



                        /////////////////////////////////////////////////////////////////////////////////
                        // Create a Prn metadata using Extract data
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        PrnMetadata metadata = PrnMetadata.CreateMetadata(data);

                        if (metadata == null)
                        {
                            Logger.ErrorFormat("Failed to Create a Spoolfile (PATH: {0}, CLIENT: {1})", spool.SpoolFile.Name, spool.ClientIPAddress);
                            return;
                        }

                        metadata.PrnInfo.UUID          = Guid.NewGuid().ToString();
                        metadata.PrnInfo.SpoolName     = spool.SpoolFile.Name;
                        metadata.PrnInfo.ReceivedTime  = spool.SpoolFile.CreationTime;
                        metadata.PrnInfo.UserIPAddress = spool.ClientIPAddress;



                        /////////////////////////////////////////////////////////////////////////////////
                        // Save a Metadata
                        /////////////////////////////////////////////////////////////////////////////////

                        string nameMetadata    = string.Format("{0}.json", Path.GetFileNameWithoutExtension(spool.SpoolFile.Name));
                        string pathMetadataDir = Path.Combine(this.Environment.Common.PathMetadataDirectory, spool.ClientIPAddress);

                        if (Path.IsPathRooted(pathMetadataDir) == false)
                        {
                            pathMetadataDir = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathMetadataDir);
                        }

                        if (Directory.Exists(pathMetadataDir) == false)
                        {
                            Directory.CreateDirectory(pathMetadataDir);
                        }

                        string pathMetadata = Path.Combine(pathMetadataDir, nameMetadata);

                        bool isSuccessLocal = FileObjectManagement.SaveJson(pathMetadata, metadata);

                        if (isSuccessLocal == false)
                        {
                            Logger.ErrorFormat("Failed to Save a Metadata (PATH_SPOOL: {0}, CLIENT: {1}, PATH_META: {2})", spool.SpoolFile.Name, spool.ClientIPAddress, nameMetadata);
                            return;
                        }

                        Logger.InfoFormat("Succeed to Save a Metadata (PATH_SPOOL: {0}, CLIENT: {1}, PATH_META: {2})", spool.SpoolFile.Name, spool.ClientIPAddress, nameMetadata);



                        /////////////////////////////////////////////////////////////////////////////////
                        // IF User is target of exception printing, THEN Call a Printing Module directly
                        /////////////////////////////////////////////////////////////////////////////////

                        if (data.IsExceptional == true)
                        {
                            // Create a Job Information file
                            string pathJson = this.WritePrintJob(data.Policy.Exceptional.Address, metadata.PrnInfo, data.Policy.Exceptional.UseImageLog, data.Policy.PrintOption.ForceBlackWhite);

                            // Enqueue a Job Information file for Call a Printing Module
                            this.QueuePrintJobFile.Enqueue(pathJson);

                            Logger.DebugFormat("Printing Job File Enqueue :: (PATH_SPOOL: {0}, CLIENT: {1}, JOBFILE_PATH: {2})", spool.SpoolFile.Name, spool.ClientIPAddress, pathJson);
                            return;
                        }



                        /////////////////////////////////////////////////////////////////////////////////
                        // Send a Approval data to Web Service
                        /////////////////////////////////////////////////////////////////////////////////

                        bool isApproval = metadata.IsApproval;

                        metadata.PrnInfo.SetApproval(isApproval);

                        if (isApproval == true)
                        {
                            string message = string.Empty;

                            ApprovalRequestor.ResultType result = metadata.RequestApproval(this.Environment, ref message);

                            switch (result)
                            {
                                case ApprovalRequestor.ResultType.Success:
                                    Logger.InfoFormat("Succeed to Send a Approval SOAP data (URI: {0})", this.Environment.Approval.WebServiceURI);
                                    break;

                                case ApprovalRequestor.ResultType.Skip:
                                    Logger.ErrorFormat("Skip the Send a Approval SOAP data (URI: {0}, MESSAGE: {1})", this.Environment.Approval.WebServiceURI, message);
                                    break;

                                case ApprovalRequestor.ResultType.Failed:
                                    Logger.ErrorFormat("Failed to Send a Approval SOAP data (URI: {0}, MESSAGE: {1})", this.Environment.Approval.WebServiceURI, message);
                                    break;

                                case ApprovalRequestor.ResultType.Exception:
                                    Logger.ErrorFormat("Failed to Send a Approval SOAP data (EXCEPTION // URI: {0}, MESSAGE: {1})", this.Environment.Approval.WebServiceURI, message);
                                    break;

                                default:
                                    Logger.ErrorFormat("Failed to Send a Approval SOAP data (UNKNOWN // URI: {0}, MESSAGE: {1})", this.Environment.Approval.WebServiceURI, message);
                                    break;
                            }
                        }

                        /////////////////////////////////////////
                        
                        
                            

                        /////////////////////////////////////////////////////////////////////////////////
                        // Insert a PrnInfo row to SmartWhere Database
                        /////////////////////////////////////////////////////////////////////////////////

                        PrnInfoDatabaseManager db = new PrnInfoDatabaseManager(this.Environment.Database);
                        
                        bool isSuccessToDB = db.Insert(metadata.PrnInfo, data.Policy.PrintOption, this.Environment.PostScheduler.ServerIndex);

                        if (isSuccessToDB == false)
                        {
                            Logger.ErrorFormat("Failed to Insert a PrnInfo Row (PATH: {0}, CLIENT: {1}, UUID: {2})", spool.SpoolFile.Name, spool.ClientIPAddress, metadata.PrnInfo.UUID);
                            return;
                        }

                        Logger.InfoFormat("Succeed to Insert a PrnInfo Row (PATH: {0}, CLIENT: {1}, UUID: {2})", spool.SpoolFile.Name, spool.ClientIPAddress, metadata.PrnInfo.UUID);
                    }
                }
                catch (ThreadAbortException)
                {
                    try
                    {
                        // Move a spoolfile to ErrSpool directory
                        if (spool.SpoolFile != null && string.IsNullOrWhiteSpace(spool.SpoolFile.FullName) == false)
                        {
                            this.Environment.Common.MoveErrorSpoolDirectory(spool.SpoolFile.FullName);
                        }
                    }
                    catch { }
                    
                    Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Spoolfile Analyzing");
                }
                catch (Exception ex)
                {
                    try
                    {
                        // Move a spoolfile to ErrSpool directory
                        if (spool.SpoolFile != null && string.IsNullOrWhiteSpace(spool.SpoolFile.FullName) == false)
                        {
                            this.Environment.Common.MoveErrorSpoolDirectory(spool.SpoolFile.FullName);
                        }
                    }
                    catch { }

                    Logger.Error("Unhandled Exception Occured during Analyze a Spoolfile", ex);
                }
            }
            catch (Exception ex)
            {
                try
                {
                    // Move a spoolfile to ErrSpool directory
                    if (spool.SpoolFile != null && string.IsNullOrWhiteSpace(spool.SpoolFile.FullName) == false)
                    {
                        this.Environment.Common.MoveErrorSpoolDirectory(spool.SpoolFile.FullName);
                    }
                }
                catch { }

                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Spoolfile Analyzing"), ex);
            }
        }

        private string WritePrintJob (string deviceIP, PrnInformation prn, bool useImageLog, bool forceBlackWhite)
        {
            ///////////////////////////////////////////////////////////////////////////////////
            // Initialize & Validation
            ///////////////////////////////////////////////////////////////////////////////////

            if (string.IsNullOrWhiteSpace(deviceIP) == true)
            {
                throw new ArgumentNullException("string deviceIP");
            }

            if (prn == null)
            {
                throw new ArgumentNullException("PrnInformation prn");
            }

            string userID      = string.Empty;



            ///////////////////////////////////////////////////////////////////////////////////
            // Processing
            ///////////////////////////////////////////////////////////////////////////////////

            PrintJobData job = new PrintJobData()
            {
                UUID            = prn.UUID,
                SpoolFileName   = prn.SpoolName,
                ClientIPAddress = prn.UserIPAddress,
                DocumentName    = prn.DocumentName,
                Copies          = prn.Copies,
                Nup             = prn.Nup,
                DriverType      = Analyzer.DriverTypeMMD2,
                PrnSave         = false
            };

            switch (prn.ColorMode)
            {
                case PrnInformation.ColorType.Color:
                    job.Color = PrintJobData.ColorType.Color;
                    break;

                case PrnInformation.ColorType.Grayscale:
                    job.Color = PrintJobData.ColorType.BlackWhite;
                    break;

                default:
                    job.Color = PrintJobData.ColorType.Unknown;
                    break;
            }

            if (forceBlackWhite == true)
            {
                job.Color = PrintJobData.ColorType.BlackWhite;
            }


            switch (prn.DuplexMode)
            {
                case PrnInformation.DuplexType.Simplex:
                    job.Duplex = PrintJobData.DuplexType.Simplex;
                    break;

                case PrnInformation.DuplexType.DuplexLongEdge:
                    job.Duplex = PrintJobData.DuplexType.DuplexLongEdge;
                    break;

                case PrnInformation.DuplexType.DuplexShortEdge:
                    job.Duplex = PrintJobData.DuplexType.DuplexShortEdge;
                    break;

                default:
                    job.Duplex = PrintJobData.DuplexType.Unknown;
                    break;
            }

            PrintJobInformation jobInfo = new PrintJobInformation()
            {
                JobTicket       = string.Empty,
                UserID          = userID,
                PrintIPAddress  = deviceIP,
                ImageLogLinkage = useImageLog,
                Contingency     = false
            };

            // Add a each Job data
            jobInfo.JobList.Add(job);



            ///////////////////////////////////////////////////////////////////////////////////
            // Save
            ///////////////////////////////////////////////////////////////////////////////////

            string pathJson = Path.Combine(this.Environment.Common.PathPrintJobDirectory,
                                           string.Format(Analyzer.FormatJsonName, userID, PrintJobData.PrintDriverType.MMD2.ToString(), DateTime.Now.ToString("yyyyMMddHHmmssfff"), 01));

            if (Path.IsPathRooted(pathJson) == false)
            {
                pathJson = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathJson);
            }
                                    
            // Save
            FileObjectManagement.SaveJson(pathJson, jobInfo);

            return pathJson;

            ///////////////////////////////////////////////////////////////////////////////////
        }

        public void ExecutePrintingModule ()
        {
            ///////////////////////////////////////////////////////////

            string pathModule = this.Environment.PrintingModule.NameForMMD2;
            string pathJson   = string.Empty;

            if (Path.IsPathRooted(pathModule) == false)
            {
                pathModule = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathModule);
            }

            ///////////////////////////////////////////////////////////

            while (this.CancelToken.IsCancellationRequested == false)
            {
                Thread.Sleep(1);

                try
                {
                    if (this.QueuePrintingModule.Count >= this.Environment.PostScheduler.PrintingModuleCount)
                    {
                        Thread.Sleep(Analyzer.ExecutePrintingModuleWaitingCycleMS);
                        continue;
                    }

                    if (this.QueuePrintJobFile.TryDequeue(out pathJson) == false)
                    {
                        continue;
                    }

                    Logger.DebugFormat("PrintJob File Dequeue (PATH: {0})", pathJson);

                    if (File.Exists(pathJson) == false)
                    {
                        Logger.WarnFormat("PrintJob file is not exists (PATH: {0})", pathJson);
                        continue;
                    }

                    ////////////////////////////////////////////////////////////////////////

                    ProcessStartInfo startinfo = new ProcessStartInfo()
                    {
                        CreateNoWindow  = true,
                        UseShellExecute = false,
                        FileName        = pathModule,
                        WindowStyle     = ProcessWindowStyle.Hidden,
                        Arguments       = pathJson
                    };

                    Process process = Process.Start(startinfo);

                    ExeProcessInformation info = new ExeProcessInformation(process, DateTime.Now, pathJson);

                    this.QueuePrintingModule.Enqueue(info);

                    Logger.DebugFormat("Printing Module Process Start & Enqueue :: (PROCESS_ID: {0}, JOBFILE_PATH: {1})", process.Id, pathJson);
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Execute a Printing Module"), ex);
                }
            }

            ///////////////////////////////////////////////////////////
        }

        public void VerifyExecuteProcess ()
        {
            ExeProcessInformation info = null;

            while (this.CancelToken.IsCancellationRequested == false)
            {
                Thread.Sleep(1);

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
                        Logger.InfoFormat("Printing Module Process is timed out. (PROCESS_ID: {0}, JOBFILE_PATH: {1}, EXECUTED_TIME: {2}, EXPIRATION_TIME: {3} min)", processID, info.JobFilePath, info.ExecutedTime.ToString("yyyy/MM/dd HH:mm:ss.fff"), this.Environment.PostScheduler.PrintingModuleTimeoutMin);

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
                        Logger.DebugFormat("Printing Module Process have been already closed. (PROCESS_ID: {0}, JOBFILE_PATH: {1})", processID, info.JobFilePath);

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
                finally
                {
                    Thread.Sleep(Analyzer.VerifyExecuteProcessCycleMS);
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
                Logger.Error(string.Format("EXCEPTION Occured :: during {0} (PROCESS_ID: {1}, JOBFILE_PATH: {2})", "Close a Process Object", processID, info.JobFilePath), ex);
            }

            try
            {
                File.Delete(info.JobFilePath);

                Logger.DebugFormat("PrintJob File Deleted (JOBFILE_PATH: {0})", info.JobFilePath);
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0} (PROCESS_ID: {1}, JOBFILE_PATH: {2}, )", "Delete a PrintJob file", processID, info.JobFilePath), ex);
            }
        }

        public void ManageThreads ()
        {
            AnalyzedSpoolThread threadAnalyzed = null;

            try
            {
                while (this.CancelToken.IsCancellationRequested == false) 
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (this.QueueManagedThread.IsEmpty == true)
                        {
                            continue;
                        }

                        try
                        {
                            if (this.QueueManagedThread.TryDequeue(out threadAnalyzed) == false)
                            {
                                continue;
                            }

                            if (threadAnalyzed.IsAlive == false)
                            {
                                continue;
                            }

                            // timeout 
                            if (threadAnalyzed.CreateTime.IsOverThanNow(0, 0, this.Environment.Analyzer.AnalyzeTimeoutMin, 0) == true)
                            {
                                try
                                {
                                    // Move a spoolfile to ErrSpool directory
                                    if (threadAnalyzed != null && threadAnalyzed.SpoolInfo != null && threadAnalyzed.SpoolInfo.SpoolFile != null && string.IsNullOrWhiteSpace(threadAnalyzed.SpoolInfo.SpoolFile.FullName) == false)
                                    {
                                        this.Environment.Common.MoveErrorSpoolDirectory(threadAnalyzed.SpoolInfo.SpoolFile.FullName);
                                    }
                                }
                                catch { }

                                threadAnalyzed.Abort();

                                Thread.Sleep(1000);

                                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Analyze Thread Managing");
                                continue;
                            }

                            this.QueueManagedThread.Enqueue(threadAnalyzed);
                        }
                        catch (ThreadAbortException)
                        {
                            throw;
                        }
                        catch
                        {
                            continue;
                        }
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Analyze Thread Managing"), ex);
                    }
                }
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Analyze Thread Managing");
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Analyze Thread Managing"), ex);
            }
        }

        #endregion Methods
    }
}