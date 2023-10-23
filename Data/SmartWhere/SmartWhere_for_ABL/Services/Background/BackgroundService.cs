namespace FXKIS.SmartWhere.Background
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;
    using System.Linq;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;

    using log4net;

    using Common.Extension;

    using CommonIF;
    using FXKIS.SmartWhere.DBBridge;

    public partial class BackgroundService : ServiceBase
    {
        #region Constants

        public  const string LogConfigFileName  = "LogConfig-BackgroundService.xml";
        public  const string ServiceDisplayName = "SmartWhere v3.0 Background Service";

        private const string ExtensionJSON      = ".json";
        private const string ExtensionPDF       = ".pdf";

        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        #endregion Constants



        #region Properties

        private SmartWhereEnvironment Environment    { get; set; }
        private Thread                ThreadCleaning { get; set; }

        #endregion Properties



        #region Variables :: Service Control

        public CancellationTokenSource CancelSource = new CancellationTokenSource();

        #endregion Variables :: Service Control



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(BackgroundService));

        #endregion Variables :: Log4net



        #region Constructors

        public BackgroundService ()
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

                // Create Directories
                this.CreateDirectories();

                // Start a Thread "Cleaning"
                this.ThreadCleaning = new Thread(this.ProcessCleaning);
                this.ThreadCleaning.Start();

                Logger.InfoFormat("START \"{0}\"", BackgroundService.ServiceDisplayName);
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

                Logger.InfoFormat("CLOSE \"{0}\"", BackgroundService.ServiceDisplayName);
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
            this.Environment  = null;
            this.CancelSource = new CancellationTokenSource();
        }

        private void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            this.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, BackgroundService.LogConfigFileName)));

            // Set a Log Level to Logger
            this.Environment.ApplyLogLevel();
        }

        #endregion Methods :: Initialize

        
        #region Methods :: Primary functions

        public void ProcessCleaning ()
        {
            try
            {
                ConcurrentQueue<PrnInformation> queuePrnInfo    = null;
                List<string>                    listRemovedUUID = new List<string>();

                PrnInformation prn = null;

                while (this.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        // SELECT
                        IEnumerable<PrnInformation> listPrnInfo = this.SelectPrnInformation();

                        if (listPrnInfo == null || listPrnInfo.Count() < 1)
                        {
                            continue;
                        }

                        queuePrnInfo = new ConcurrentQueue<PrnInformation>(listPrnInfo);

                        if (queuePrnInfo == null || queuePrnInfo.IsEmpty == true)
                        {
                            continue;
                        }
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        

                        while (queuePrnInfo.TryDequeue(out prn) == true)
                        {
                            try
                            {
                                // CHECK a IsBackground
                                if (prn.IsBackup == true)
                                {
                                    continue;
                                }

                                //CHECK a ServerIndex
                                if (prn.ServerIdx != this.Environment.PostScheduler.ServerIndex)
                                {
                                    continue;
                                }

                                // COMPARE (RCD_TIME + REMAIN_HOURS vs NOW)
                                if (prn.ReceivedTime.IsOverThanNow(0, prn.RemainHours) == false)
                                {
                                    continue;
                                }

                                Logger.DebugFormat(@"PRN ""{0}"" is over than REMAIN_HOURS (RCD_TIME: {1}, REMAIN_HOURS: {2} hr, UUID: {3})", prn.SpoolName, prn.ReceivedTime, prn.RemainHours, prn.UUID);

                                // REMOVE a Spool files
                                bool isRemoved = this.DeletePrnFiles(prn);

                                if (isRemoved == false)
                                {
                                    Logger.DebugFormat(@"PRN ""{0}""'s remove failed (UUID: {1})", prn.SpoolName, prn.UUID);
                                    continue;
                                }

                                listRemovedUUID.Add(prn.UUID);

                                Logger.InfoFormat(@"PRN ""{0}""'s remove succeed (UUID: {1})", prn.SpoolName, prn.UUID);
                            }
                            catch (Exception ex)
                            {
                                string strErr = "EXCEPTION Occured :: during PROCESS for Cleaning PRN Information";

                                if (prn != null && string.IsNullOrWhiteSpace(prn.UUID) == false)
                                {
                                    strErr += string.Format(" (UUID: {0})", prn.UUID);
                                }

                                Logger.Error(strErr, ex);
                            }
                        }

                        if (listRemovedUUID.Count < 1)
                        {
                            continue;
                        }

                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        // REMOVE PrnInfo Rows
                        this.DeletePrnInformation(listRemovedUUID);
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    }
                    catch (Exception ex)
                    {
                        Logger.Error("EXCEPTION Occured :: during PROCESS for Cleaning PRN Information", ex);
                    }
                    finally
                    {
                        listRemovedUUID.Clear();

                        if (this.CancelSource.IsCancellationRequested == false)
                        {
                            Thread.Sleep(this.Environment.Background.CleaningIntervalMinutes * 60 * 1000);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("EXCEPTION Occured :: during PROCESS for Cleaning PRN Information", ex);
            }
            finally
            {
                this.CancelSource.Cancel();
            }
        }

        #endregion Methods :: Primary functions



        #region Methods

        private void CreateDirectories ()
        {
            this.CreateDirectory(this.Environment.Common.PathSpoolDirectory);
            this.CreateDirectory(this.Environment.Common.PathErrorSpoolDirectory);
            this.CreateDirectory(this.Environment.Common.PathMetadataDirectory);
            this.CreateDirectory(this.Environment.Common.PathPrintJobDirectory);
            this.CreateDirectory(this.Environment.Common.PathContingencyDirectory);
            this.CreateDirectory(this.Environment.Common.PathFontDataDirectory);
            this.CreateDirectory(this.Environment.Common.PathWatermarkImageDirectory);
            this.CreateDirectory(this.Environment.Common.PathImageProcessingDirectory);
            this.CreateDirectory(this.Environment.Common.PathApprovalProcessingDirectory);
            this.CreateDirectory(this.Environment.Common.PathImageLogProcessingDirectory);
            this.CreateDirectory(this.Environment.Common.PathPrintingByFileSpoolDirectory);
            this.CreateDirectory(this.Environment.Common.PathLogDirectory);
        }

        private void CreateDirectory (string pathDirectory)
        {
            if (string.IsNullOrWhiteSpace(pathDirectory) == true)
            {
                throw new ArgumentNullException("string pathDirectory");
            }

            try
            {
                if (Path.IsPathRooted(pathDirectory) == false)
                {
                    if (Directory.Exists(this.Environment.Common.PathSmartWhereDataRootDirectory) == false)
                    {
                        throw new DirectoryNotFoundException(string.Format("SmartWhere Data Root Directory is not exists (PATH: {0})", this.Environment.Common.PathSmartWhereDataRootDirectory));
                    }

                    pathDirectory = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathDirectory);
                }

                FileSystemEx.CreateDirectory(pathDirectory);
            }
            catch (Exception ex)
            {
                Logger.Warn(string.Format("Directory Creation failed (PATH: {0})", pathDirectory), ex);
            }
        }

        private bool DeletePrnFiles (PrnInformation prn)
        {
            if (prn == null)
            {
                throw new ArgumentNullException("PrnInformation prn");
            }

            bool isSuccess = false;

            // [Spool] Directory (Spoolfile)
            isSuccess = this.DeletePrnFile(Path.Combine(this.Environment.Common.PathSpoolDirectory, prn.UserIPAddress, prn.SpoolName));

            if (isSuccess == false)
            {
                return false;
            }

            // [Metadata] Directory (.JSON)
            isSuccess = this.DeletePrnFile(Path.Combine(this.Environment.Common.PathMetadataDirectory, prn.UserIPAddress, prn.SpoolName + BackgroundService.ExtensionJSON));

            if (isSuccess == false)
            {
                return false;
            }

            switch (prn.Driver)
            {
                // [Spool] Directory (.PDF)
                case PrintJobData.PrintDriverType.Mobile:
                case PrintJobData.PrintDriverType.MacOS:
                    return this.DeletePrnFile(Path.Combine(this.Environment.Common.PathSpoolDirectory, prn.UserIPAddress, prn.SpoolName + BackgroundService.ExtensionPDF));

                default:
                    return isSuccess;
            }
        }

        private bool DeletePrnFile (string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            try
            {
                if (Path.IsPathRooted(path) == false)
                {
                    path = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, path);
                }

                if (File.Exists(path) == true)
                {
                    File.Delete(path);
                }
                else
                {
                    throw new FileNotFoundException("File delete failed", path);
                }

                Logger.InfoFormat(@"SPOOL FILE delete succeed (PATH: {0})", path);

                return true;
            }
            catch (Exception ex)
            {
                Logger.Warn(string.Format(@"SPOOL FILE delete failed (PATH: {0})", path), ex);

                return false;
            }
        }

        public IEnumerable<PrnInformation> SelectPrnInformation()
        {
            List<PrnInformation> listPrnInfo = new List<PrnInformation>();

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadData, DatabaseConstants.Query.SelectPrnInfo);

            using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
            {
                BridgeResponse response = requestor.RequestToResponse(requestBridge, BackgroundService.SecretKeyForAES256);
                
                foreach (ResponseRowData row in response.ListRowData)
                {
                    PrnInformation prn = new PrnInformation();

                    foreach (var pair in row.DictionaryRowData)
                    {
                        try
                        {
                            string value = pair.Value.ToString();

                            switch (pair.Key.ToUpper())
                            {
                                case DatabaseConstants.Column.PrnInfo.UUID:
                                    prn.UUID = value;
                                    break;

                                case DatabaseConstants.Column.PrnInfo.RcdTime:
                                    prn.ReceivedTime = DateTime.Parse(value);
                                    break;

                                case DatabaseConstants.Column.PrnInfo.SpoolName:
                                    prn.SpoolName = value;
                                    break;

                                case DatabaseConstants.Column.PrnInfo.UserIPAddress:
                                    prn.UserIPAddress = value;
                                    break;
                                
                                case DatabaseConstants.Column.PrnInfo.DriverType:

                                    switch (value.ToUpper())
                                    {
                                        case CommonIF.Constants.DriverType.MMD2:
                                            prn.Driver = PrintJobData.PrintDriverType.MMD2;
                                            break;

                                        case CommonIF.Constants.DriverType.Mobile:
                                            prn.Driver = PrintJobData.PrintDriverType.Mobile;
                                            break;

                                        case CommonIF.Constants.DriverType.MobilePCL:
                                            prn.Driver = PrintJobData.PrintDriverType.MobilePCL;
                                            break;

                                        case CommonIF.Constants.DriverType.MacOS:
                                            prn.Driver = PrintJobData.PrintDriverType.MacOS;
                                            break;

                                        default:
                                            prn.Driver = PrintJobData.PrintDriverType.Unknown;
                                            break;
                                    }
                                    break;

                                case DatabaseConstants.Column.PrnInfo.BackupStatus:
                                    prn.IsBackup = (int.Parse(value) > 0);
                                    break;

                                case DatabaseConstants.Column.PrnInfo.RemainHours:
                                    prn.RemainHours = int.Parse(value);
                                    break;

                                case DatabaseConstants.Column.PrnInfo.ServerIdx:
                                    prn.ServerIdx = int.Parse(value);
                                    break;
                                


                                default:
                                    continue;
                            }
                        }
                        catch
                        {
                            continue;
                        }
                    }

                    if (prn == null)
                    {
                        continue;
                    }

                    listPrnInfo.Add(prn);
                }
            }
            return listPrnInfo;
        }


        public void DeletePrnInformation(List<string> listRemovedUUID)
        {
            if (listRemovedUUID == null || listRemovedUUID.Count < 1)
            {
                throw new ArgumentNullException("List<string> listRemovedUUID");
            }

            int affectedRows = 0;

            List<string> lisParamValue = new List<string>();

            string query = DatabaseConstants.Query.FormatDeletePrnInfoByUuidList;

            foreach (string value in listRemovedUUID)
            {                
                string parmaValue = "'" + value + "'";
                lisParamValue.Add(parmaValue);
            }

            query = query.Replace(DatabaseConstants.Parameter.AddArray, string.Join(", ", lisParamValue));

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, query);
            
            using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
            {
                BridgeResponse response = requestor.RequestToResponse(requestBridge, BackgroundService.SecretKeyForAES256);
                affectedRows = response.AffectedRows;
            }

            if (affectedRows != listRemovedUUID.Count)
            {
                Logger.WarnFormat("Row of PrnInfo remove failed - affected rows' count is different from rows' count to be removed (AFFECTED: {0}, TO BE REMOVED: {1})", affectedRows, listRemovedUUID.Count);
            }

            Logger.InfoFormat("Row of PrnInfo remove succeed - affected rows' count = {0}", affectedRows);
        }


        #endregion Methods



        #region Methods :: Native Methods

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion Methods :: Native Methods
    }
}
