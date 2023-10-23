namespace FXKIS.SmartWhere.PrintingModule
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using System.IO;
    using System.Net.Sockets;

    using log4net;

    using Common.Environment;

    using CommonIF;

    using PDL.Process;
    using Metadata;
    using ImageLog;
    using FXKIS.SmartWhere.DBBridge;

    public class PrintProcessor
    {
        #region Constants

        public const string ExtensionMetadata = ".json";

        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        private const string FormatQueryUpdateUseYN   = @"UPDATE PRNINFO SET USEYN = 'Y' WHERE uuId in ({0})";
        private const string FormatQueryDeletePrnInfo = @"DELETE FROM PRNINFO WHERE uuId IN ({0})";

        #endregion Constants



        #region Properties

        public SmartWhereEnvironment Environment { get; private set; }

        private string PathSpoolDirectory
        {
            get
            {
                if (this.Environment == null || this.Environment.Common == null)
                {
                    return string.Empty;
                }

                string path = this.Environment.Common.PathSpoolDirectory;
                
                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    return string.Empty;
                }

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                path = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, path);

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }
        }

        private string PathMetadataDirectory
        {
            get
            {
                if (this.Environment == null || this.Environment.Common == null)
                {
                    return string.Empty;
                }

                string path = this.Environment.Common.PathMetadataDirectory;

                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    return string.Empty;
                }

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                path = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, path);

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }
        }

        private string PathPrintJobDirectory
        {
            get
            {
                if (this.Environment == null || this.Environment.Common == null)
                {
                    return string.Empty;
                }

                string path = this.Environment.Common.PathPrintJobDirectory;

                if (string.IsNullOrWhiteSpace(path) == true)
                {
                    return string.Empty;
                }

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                path = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, path);

                if (Path.IsPathRooted(path) == true)
                {
                    return path;
                }

                return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }
        }

        private int Port
        {
            get
            {
                if (this.Environment == null || this.Environment.PrintingModule == null)
                {
                    return -1;
                }

                return this.Environment.PrintingModule.PortForMMD2;
            }
        }

        #endregion Properties



        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(PrintProcessor));

        #endregion Variables



        #region Constructors

        public PrintProcessor (SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.Environment = env;
        }

        #endregion Constructors



        #region Methods
        
        public bool Process (string pathJobInfo)
        {
            if (string.IsNullOrWhiteSpace(pathJobInfo) == true)
            {
                throw new ArgumentNullException("string pathJobInfo");
            }

            PrintJobInformation jobInfo = null;

            string clientIP = string.Empty;
            try
            {
                // Load a PrintJob Information
                jobInfo = this.LoadJobInformation(pathJobInfo);

                if (jobInfo == null)
                {
                    throw new InvalidDataException("Failed to Get a PrintJob Information");
                }

                Logger.InfoFormat("SmartWhere_PrintingModule START (PRINTJOB_PATH: {0})", pathJobInfo);

                List<Stream> listStream = new List<Stream>();

                List<PrintJobData> listFinishJob = new List<PrintJobData>();

                // LOOP for PRINT PROCESSING
                foreach (PrintJobData jobData in jobInfo.JobList)
                {
                    string pathSpool    = string.Empty;
                    string pathMetadata = string.Empty;

                    clientIP = jobData.ClientIPAddress;

                    try
                    {
                        /////////////////////////////////////////////////////////////////////////////////
                        // Get Paths (Spool / Metadata)
                        /////////////////////////////////////////////////////////////////////////////////

                        this.GetProcessingPaths(jobData.SpoolFileName, jobData.ClientIPAddress, out pathSpool, out pathMetadata);



                        /////////////////////////////////////////////////////////////////////////////////
                        // Get a Metadata
                        /////////////////////////////////////////////////////////////////////////////////

                        PrnMetadata metadata = FileObjectManagement.LoadJson<PrnMetadata>(pathMetadata);

                        if (metadata == null)
                        {
                            throw new InvalidDataException(string.Format("Failed to Get a Metadata (PATH: {0})", pathMetadata));
                        }



                        /////////////////////////////////////////////////////////////////////////////////
                        // PJL    -> line 단위로 읽어서 바로 쓰기
                        // PCL-XL -> 오프셋 나오기 전까지 바로 쓰기, 오프셋 나오면 삽입 or 가공
                        /////////////////////////////////////////////////////////////////////////////////

                        TcpClient client = null;

                        try
                        {
                            if (this.Environment.PrintingModule.UsePrintingByDevice == false && this.Environment.PrintingModule.UsePrintingByFile == false)
                            {
                                throw new InvalidDataException("PrintingModule's Setting is invalid. Please Check a Properties \"UsePrintingByDevice\" & \"UsePrintingByFile\" of CommonEnvironment");
                            }



                            /////////////////////////////////////////////////////////////////////////////////
                            // Open and Add a Network Stream (Printing by Device)
                            /////////////////////////////////////////////////////////////////////////////////

                            if (this.Environment.PrintingModule.UsePrintingByDevice == true)
                            {
                                client = new TcpClient(jobInfo.PrintIPAddress, this.Environment.PrintingModule.PortForMMD2);

                                listStream.Add(client.GetStream());
                            }



                            /////////////////////////////////////////////////////////////////////////////////
                            // Open and Add a File Stream (Printing by File)
                            /////////////////////////////////////////////////////////////////////////////////

                            if (this.Environment.PrintingModule.UsePrintingByFile == true)
                            {
                                string fileName = string.Format("{0}___{1}", DateTime.Now.ToString("yyyyMMddHHmmssFFF"), jobData.SpoolFileName);

                                string path = Path.Combine(this.Environment.Common.PathPrintingByFileSpoolDirectory, fileName);

                                if (Path.IsPathRooted(path) == false)
                                {
                                    path = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, path);
                                }

                                if (File.Exists(path) == true)
                                {
                                    File.Delete(path);
                                }

                                listStream.Add(new FileStream(path, FileMode.CreateNew));
                            }

                            string pathFontDir            = this.Environment.Common.PathFontDataDirectory;
                            string pathWatermarkImageDir  = this.Environment.Common.PathWatermarkImageDirectory;
                            string pathImageProcessingDir = this.Environment.Common.PathImageProcessingDirectory;

                            if (Path.IsPathRooted(pathFontDir) == false)
                            {
                                pathFontDir = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathFontDir);
                            }

                            if (Path.IsPathRooted(pathWatermarkImageDir) == false)
                            {
                                pathWatermarkImageDir = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathWatermarkImageDir);
                            }

                            if (Path.IsPathRooted(pathImageProcessingDir) == false)
                            {
                                pathImageProcessingDir = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathImageProcessingDir);
                            }



                            /////////////////////////////////////////////////////////////////////////////////
                            // Processing
                            /////////////////////////////////////////////////////////////////////////////////

                            using (PrnProcessor process = new PrnProcessor(jobData, metadata, listStream.ToArray(), pathSpool, pathFontDir, pathWatermarkImageDir, pathImageProcessingDir, jobInfo.JobTicket))
                            {
                                process.Process();
                            }

                            listFinishJob.Add(jobData);



                            /////////////////////////////////////////////////////////////////////////////////
                            // Send a Approval data to Web Service
                            /////////////////////////////////////////////////////////////////////////////////

                            if (jobInfo.ImageLogLinkage == true)
                            {
                                string message = string.Empty;

                                ImageLogRequestor.ResultType result = metadata.RequestImageLog(this.Environment, ref message);

                                switch (result)
                                {
                                    case ImageLogRequestor.ResultType.Success:
                                        Logger.InfoFormat("Succeed to Send a ImageLog SOAP data (SERVER: {0}:{1})", this.Environment.ImageLog.ServerHost, this.Environment.ImageLog.ServerPort);
                                        break;

                                    case ImageLogRequestor.ResultType.Skip:
                                        Logger.ErrorFormat("Skip the Send a ImageLog SOAP data (SERVER: {0}:{1}, MESSAGE: {2})", this.Environment.ImageLog.ServerHost, this.Environment.ImageLog.ServerPort, message);
                                        break;

                                    case ImageLogRequestor.ResultType.Failed:
                                        Logger.ErrorFormat("Failed to Send a ImageLog SOAP data (SERVER: {0}:{1}, MESSAGE: {2})", this.Environment.ImageLog.ServerHost, this.Environment.ImageLog.ServerPort, message);
                                        break;

                                    case ImageLogRequestor.ResultType.Exception:
                                        Logger.ErrorFormat("Failed to Send a ImageLog SOAP data (EXCEPTION // SERVER: {0}:{1}, MESSAGE: {2})", this.Environment.ImageLog.ServerHost, this.Environment.ImageLog.ServerPort, message);
                                        break;

                                    default:
                                        Logger.ErrorFormat("Failed to Send a ImageLog SOAP data (UNKNOWN // SERVER: {0}:{1}, MESSAGE: {2})", this.Environment.ImageLog.ServerHost, this.Environment.ImageLog.ServerPort, message);
                                        break;
                                }
                            }

                            /////////////////////////////////////////////////////////////////////////////////
                        }
                        finally
                        {
                            // Close & Clear Streams (Printing by Device/File)
                            try
                            {
                                listStream.CloseAll();
                            }
                            catch { }

                            listStream.Clear();

                            // Close TCP Client
                            try
                            {
                                if (client != null)
                                {
                                    client.Close();
                                }
                            }
                            catch { }

                            // Delete Spool data
                            try
                            {
                                bool deleteDatabase = (jobInfo.IsExceptional == false);

                                this.DeletePrintJob(listFinishJob, deleteDatabase);
                            }
                            catch { }
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(string.Format("SmartWhere_PrintingModule STOP - Exception Occured during PrintJobData Processing (PRINTJOB_PATH: {0}, SPOOL_NAME: {1}, CLIENT_IP: {2})", pathJobInfo, pathSpool, clientIP), ex);
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("Exception Occured during PrintJob Processing (PRINTJOB_PATH: {0})", pathJobInfo), ex);
                return false;
            }

            Logger.InfoFormat("SmartWhere_PrintingModule FINISH (PRINTJOB_PATH: {0})", pathJobInfo);
            return true;
        }

        private void DeletePrintJob (List<PrintJobData> listPrintJob, bool deleteDatabase = true)
        {        
            if (listPrintJob == null || listPrintJob.Count < 1)
            {
                throw new ArgumentNullException("List<PrintJobData> listPrintJob");
            }

            if (listPrintJob.Count < 1)
            {
                return;
            }

            //////////////////////////////////////////////////////////////////////////////

            if (deleteDatabase == true)
            {
                IEnumerable<string> listUsedUUID    = from job in listPrintJob where job.PrnSave == true  select job.UUID;
                IEnumerable<string> listDeletedUUID = from job in listPrintJob where job.PrnSave == false select job.UUID;

                string strUsedUUIDs    = string.Format("'{0}'", string.Join("','", listUsedUUID));
                string strDeletedUUIDs = string.Format("'{0}'", string.Join("','", listDeletedUUID));

                //////////////////////////////////////////////////////////////////////////////

                try
                {
                    if (listUsedUUID.Count() > 0)
                    {
                        string query = string.Format(PrintProcessor.FormatQueryUpdateUseYN, strUsedUUIDs);

                        using (BridgeRequestor requestor = new BridgeRequestor(Program.Environment.Database.Host, Program.Environment.Database.Port))
                        {
                            BridgeRequest request   = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, query);
                            BridgeResponse response = requestor.RequestToResponse(request, PrintProcessor.SecretKeyForAES256);
                            if (response == null)
                            {
                                throw new InvalidOperationException(string.Format("RESPONSE of PRNINFO Row Update is NULL ({0}:{1})", Program.Environment.Database.Host, Program.Environment.Database.Host));
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("PRNINFO Row Update fail (UUIDs: {0})", strUsedUUIDs), ex);
                }
            
                //////////////////////////////////////////////////////////////////////////////

                if (listDeletedUUID.Count() < 1)
                {
                    return;
                }

                try
                {
                    string query = string.Format(PrintProcessor.FormatQueryDeletePrnInfo, strDeletedUUIDs);

                    using (BridgeRequestor requestor = new BridgeRequestor(Program.Environment.Database.Host, Program.Environment.Database.Port))
                    {
                        BridgeRequest  request  = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, query);
                        BridgeResponse response = requestor.RequestToResponse(request, PrintProcessor.SecretKeyForAES256);
                        if (response == null)
                        {
                            throw new InvalidOperationException(string.Format("RESPONSE of PRNINFO Row Delete is NULL ({0}:{1})", Program.Environment.Database.Host, Program.Environment.Database.Host));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("PRNINFO Row Delete fail (UUIDs: {0})", strDeletedUUIDs), ex);
                    return;
                }
            }

            //////////////////////////////////////////////////////////////////////////////

            IEnumerable<PrintJobData> listDeletedJob = from job in listPrintJob where job.PrnSave == false select job;

            if (listDeletedJob == null || listDeletedJob.Count() < 1)
            {
                return;
            }

            foreach (PrintJobData jobData in listDeletedJob)
            {
                string pathSpool    = string.Empty;
                string pathMetadata = string.Empty;

                try
                {
                    pathSpool = Path.Combine(this.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName);

                    if (Path.IsPathRooted(pathSpool) == false)
                    {
                        pathSpool = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathSpool);
                    }

                    if (File.Exists(pathSpool) == false)
                    {
                        throw new FileNotFoundException("Spool file is not exists", pathSpool);
                    }

                    File.Delete(pathSpool);
                    Logger.DebugFormat("Spool file delete success (PATH: {0})", pathSpool);
                }
                catch (Exception ex)
                {
                    Logger.Debug(string.Format("Spool file delete fail (PATH: {0})", pathSpool), ex);
                }

                try
                {
                    pathMetadata = Path.Combine(this.Environment.Common.PathMetadataDirectory, jobData.ClientIPAddress, Path.GetFileNameWithoutExtension(jobData.SpoolFileName) + PrintProcessor.ExtensionMetadata);

                    if (Path.IsPathRooted(pathMetadata) == false)
                    {
                        pathMetadata = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathMetadata);
                    }

                    if (File.Exists(pathMetadata) == false)
                    {
                        throw new FileNotFoundException("Metadata file is not exists", pathMetadata);
                    }

                    File.Delete(pathMetadata);
                    Logger.DebugFormat("Metadata file delete success (PATH: {0})", pathMetadata);
                }
                catch (Exception ex)
                {
                    Logger.Debug(string.Format("Metadata file delete fail (PATH: {0})", pathMetadata), ex);
                }
            }

            //////////////////////////////////////////////////////////////////////////////
        }

        private void GetProcessingPaths (string spoolName, string clientIP, out string pathSpool, out string pathMetadata)
        {
            if (string.IsNullOrWhiteSpace(spoolName) == true)
            {
                throw new ArgumentNullException("string spoolName");
            }

            if (string.IsNullOrWhiteSpace(clientIP) == true)
            {
                throw new ArgumentNullException("string clientIP");
            }
            
            pathSpool    = Path.Combine(this.PathSpoolDirectory,    clientIP, spoolName);
            pathMetadata = Path.Combine(this.PathMetadataDirectory, clientIP, spoolName + PrintProcessor.ExtensionMetadata);

            if (string.IsNullOrWhiteSpace(pathSpool) == true)
            {
                throw new InvalidDataException("Path of Spool file is empty or invalid");
            }

            if (string.IsNullOrWhiteSpace(pathMetadata) == true)
            {
                throw new InvalidDataException("Path of Metadata file is empty or invalid");
            }

            if (File.Exists(pathSpool) == false)
            {
                throw new FileNotFoundException("Spool file is not exists", pathSpool);
            }

            if (File.Exists(pathMetadata) == false)
            {
                throw new FileNotFoundException("Metadata file is not exists", pathMetadata);
            }
        }

        private PrintJobInformation LoadJobInformation (string jobInfoName)
        {
            if (string.IsNullOrWhiteSpace(jobInfoName) == true)
            {
                throw new ArgumentNullException("string jobInfoName");
            }

            if (string.IsNullOrWhiteSpace(this.PathPrintJobDirectory) == true)
            {
                throw new InvalidDataException("Path of PrintJob Directory is empty or invalid");
            }

            string jobInfoPath = Path.Combine(this.PathPrintJobDirectory, jobInfoName);

            if (File.Exists(jobInfoPath) == false)
            {
                throw new FileNotFoundException("PrintJob Information file is not exists", jobInfoPath);
            }

            return FileObjectManagement.LoadJson<PrintJobInformation>(jobInfoPath);
        }

        #endregion Methods
    }
}