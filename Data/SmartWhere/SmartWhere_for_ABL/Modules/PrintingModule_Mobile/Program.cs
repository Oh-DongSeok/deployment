namespace FXKIS.SmartWhere.PrintingModule.Mobile
{
    using Common.Environment;
    using CommonIF;
    using FXKIS.SmartWhere.DBBridge;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;
    using System.Linq;
    using System.Net.Sockets;
    using System.Text;

    public class Program
    {
        #region Constants

        private const string SecretKeyForAES256 = "<//SmartWhere_v3.0//_developed_by_[FXKIS_SEC::20157001::Chosm]>";
        private const string SecretKeyForBridge = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        private const string FormatQueryUpdateUseYN   = @"UPDATE PRNINFO SET USEYN = 'Y' WHERE uuId IN ({0})";
        private const string FormatQueryDeletePrnInfo = @"DELETE FROM PRNINFO WHERE uuId IN ({0})";

        private const string ExtensionPDF      = ".PDF";
        private const string ExtensionMetadata = ".json";

        public const string PjlStrJoau  = "@PJL SET JOBATTR=\"@JOAU=";
        public const string PjlStrJoet  = "@PJL SET JOBATTR=\"@JOET={0}\"";
        public const string SuccessStr  = "SUCCESS";
        public const string FailStr     = "FAIL";

        public const string LogConfigFileName = @"LogConfig-PrintingModule_Mobile.xml";

        #endregion Constants


        #region Properties

        public static SmartWhereEnvironment Environment { get; set; }

        #endregion Properties


        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Program));

        #endregion Variables :: Log4net


        #region Methods

        public static void Main(string[] args)
        {
            try
            {
                Program.Initialize();

                Program.InitializeLogger();

                // 파라미터
                if (args.Length != 1)
                {
                    throw new FormatException("Error in parameter format");
                }

                // PrintJobInformation 파일
                string jobInfoName = args[0];

                string jobInfoPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathPrintJobDirectory, jobInfoName);

                PrintJobInformation jobInfo = Program.LoadJobInfo(jobInfoPath);
                         
                if (jobInfo == null)
                {
                    throw new ArgumentNullException("PrintJobInformation jobInfo");
                }

                Logger.InfoFormat("SmartWhere_PrintingModule_Mobile START");
                
                // Print
                Program.PrintJob(jobInfo, jobInfoName);

            }
            catch (Exception ex)
            {
                Logger.Fatal(ex);
            }

            Logger.InfoFormat("SmartWhere_PrintingModule_Mobile STOP");
        }


        static void Initialize()
        {
            // 설정파일
            Program.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);

            if (Program.Environment == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment is empty or invalid");
            }
        }


        private static void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            Program.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Program.LogConfigFileName)));

            // Set a Log Level to Logger
            Program.Environment.ApplyLogLevel();
        }


        static PrintJobInformation LoadJobInfo(string jobInfoPath)
        {
            FileInfo jobInfoFi = new FileInfo(jobInfoPath);

            if (jobInfoFi.Exists == false)
            {
                throw new FileNotFoundException("PrintJobInformation not found", jobInfoFi.Name);
            }

            return FileObjectManagement.LoadJson<PrintJobInformation>(jobInfoPath);
        }



        static void PrintJob(PrintJobInformation jobInfo, string jobInfoName)
        {
            bool isSuccess = false;

            Logger.InfoFormat("PrintingModule START ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);

            FileInfo tempSpoolFile = null;
            FileInfo tempPdfFile = null;

            // PrintJobInformation의 JobList에 해당하는 PrintJobData 하나씩 처리
            foreach (PrintJobData jobData in jobInfo.JobList)
            {
                try
                {
                    // PrintJobData 확인
                    if (jobData == null)
                    {
                        throw new ArgumentNullException("PrintJobData jobData");
                    }

                    Logger.InfoFormat("Get jobData ( PATH : {0} // UserID: {1} // PrintIPAddress: {2})", jobData.SpoolFileName, jobInfo.UserID, jobInfo.PrintIPAddress);


                    //PrintJobData의 spoolFile 확인
                    string spoolFilePath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName);

                    FileInfo spoolFile = new FileInfo(spoolFilePath);
                    if (spoolFile.Exists == false)
                    {
                        throw new FileNotFoundException("SpoolFile not found", spoolFile.FullName);
                    }

                    // 가공할  spool 파일
                    tempSpoolFile = new FileInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + "TEMP"));
                    if (tempSpoolFile.Exists == true)
                    {
                        tempSpoolFile.Delete();
                    }
                    spoolFile.CopyTo(tempSpoolFile.FullName);



                    // 메타데이터 확인
                    string metadataPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathMetadataDirectory, jobData.ClientIPAddress, jobData.SpoolFileName+".json");


                    PrnMetadata metadata = FileObjectManagement.LoadJson<PrnMetadata>(metadataPath);
                    
                    if(metadata == null)
                    {
                        throw new ArgumentNullException("PrnMetadata metadata");
                    }
                    
                    switch (jobData.Driver)
                    {
                        case PrintJobData.PrintDriverType.Mobile:
                            {
			                    // pdf파일
			                    FileInfo pdfFile = new FileInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + ".pdf"));

			                    // 가공할  pdf 파일
			                    tempPdfFile = new FileInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + "TEMP.pdf"));
			                    if (tempPdfFile.Exists == true)
			                    {
			                        tempPdfFile.Delete();
			                    }
			                    pdfFile.CopyTo(tempPdfFile.FullName);
					
                                // Meta File의 가공정책을 PDF Format에 적용
                                PdfModify pdfModify = new PdfModify(metadata, jobData, tempSpoolFile, tempPdfFile);
                                isSuccess = pdfModify.Start();
                                if (isSuccess == false)
                                {
                                    break;
                                }

                                // xml가공
                                XmlModify xmlModify = new XmlModify(metadata, jobData);

                                // PrintJobData의 실패시 종료(실패 후의 JobList는 시도 안함)
                                isSuccess = xmlModify.Start(tempSpoolFile);
                                if (isSuccess == false)
                                {
                                    break;
                                }
                                
                                isSuccess = Program.PrintSpool(tempSpoolFile, jobInfo);

		                        //가공한 파일 삭제
		                        tempPdfFile.Delete();
		                        tempSpoolFile.Delete();

                                // PrintJob 실패시 종료(실패 후의 JobList는 시도 안함)
                                if (isSuccess == false)
                                {
                                    break;
                                }
                            }
                            break;

                        case PrintJobData.PrintDriverType.MobilePCL:
                            {
                                isSuccess = Program.PrintSpool(spoolFile, jobInfo);

                                // PrintJob 실패시 종료(실패 후의 JobList는 시도 안함)
                                if (isSuccess == false)
                                {
                                    break;
                                }
                            }
                            break;

                        case PrintJobData.PrintDriverType.MMD2:
                        case PrintJobData.PrintDriverType.Unknown:
                        default:
                            throw new FileNotFoundException("Unsupported DriverType");
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);

                    if (tempSpoolFile.Exists == true)
                    {
                        tempSpoolFile.Delete();
                    }

                    if (tempPdfFile.Exists == true)
                    {
                        tempPdfFile.Delete();
                    }
                }
            }

            if (isSuccess == true)
            {
                Console.WriteLine(Program.SuccessStr);
                Logger.InfoFormat("PrintingModule Success ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);

                Program.DeleteSuccessSpool(jobInfo);
            }
            else
            {
                Console.WriteLine(Program.FailStr);
                Logger.InfoFormat("PrintingModule Fail ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);
            }
        }


        /// <summary>
        /// spoolFile에 jobTicket 추가 후 프린터 전송
        /// </summary>
        /// <returns>프린트 성공 여부</returns>
        static bool PrintSpool(FileInfo spoolFile, PrintJobInformation jobInfo)
        {           
            try
            {
                byte data = 0;
                List<byte> listByte = new List<byte>();

                string dataString = string.Empty;
                byte[] arrData;
                using (FileStream fs = spoolFile.OpenRead())
                {
                    using (BinaryReader br = new BinaryReader(fs))
                    {
                        using (TcpClient client = new TcpClient(jobInfo.PrintIPAddress, Program.Environment.PrintingModule.PortForMobile))
                        {
                            using (NetworkStream ns = client.GetStream())
                            {
                                using (BinaryWriter bw = new BinaryWriter(ns))
                                {
                                    do
                                    {
                                        data = br.ReadByte();
                                        listByte.Add(data);

                                        if (data == 0x0a)
                                        {
                                            bw.Write(listByte.ToArray());
                                            bw.Flush();
                                            dataString = Encoding.UTF8.GetString(listByte.ToArray());

                                            listByte.Clear();
                                            
                                            // JobTicket 삽입
                                            if (dataString.Contains(Program.PjlStrJoau) == true) 
                                            {
                                                if(string.IsNullOrWhiteSpace(jobInfo.JobTicket) == false)
                                                {
                                                    arrData = Encoding.UTF8.GetBytes(string.Format(Program.PjlStrJoet, jobInfo.JobTicket));

                                                    bw.Write(arrData);
                                                    bw.Write((byte)0x0d);
                                                    bw.Write((byte)0x0a);

                                                    bw.Flush();
                                                }
                                            }
                                        }
                                    } while (fs.Position < fs.Length);
                                }
                            } 
                        }
                    }
                }
                Logger.DebugFormat("PrintJob Success ( PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", spoolFile.Name, jobInfo.UserID, jobInfo.PrintIPAddress);
                return true;
            }
            catch (Exception)
            {
                Logger.DebugFormat("PrintJob Fail ( PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", spoolFile.Name, jobInfo.UserID, jobInfo.PrintIPAddress);
                return false;
            }
        }


        /// <summary>
        /// jobList의 spool모두 성공 시 PrintJobData의 PrnSave의 T/F에 따라 파일 삭제
        /// </summary>    
        static void DeleteSuccessSpool(PrintJobInformation jobInfo)
        {
            if (jobInfo == null)
            {
                throw new ArgumentNullException("PrintJobInformation jobInfo");
            }

            if (jobInfo.JobList.Count < 1)
            {
                return;
            }

            //////////////////////////////////////////////////////////////////////////////

            IEnumerable<string> listUsedUUID    = from job in jobInfo.JobList where job.PrnSave == true  select job.UUID;
            IEnumerable<string> listDeletedUUID = from job in jobInfo.JobList where job.PrnSave == false select job.UUID;

            string strUsedUUIDs    = string.Format("'{0}'", string.Join("','", listUsedUUID));
            string strDeletedUUIDs = string.Format("'{0}'", string.Join("','", listDeletedUUID));

            //////////////////////////////////////////////////////////////////////////////

            try
            {
                if (listUsedUUID.Count() > 0)
                {
                    string query = string.Format(Program.FormatQueryUpdateUseYN, strUsedUUIDs);

                    using (BridgeRequestor requestor = new BridgeRequestor(Program.Environment.Database.Host, Program.Environment.Database.Port))
                    {
                        BridgeRequest request = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, query);
                        BridgeResponse response = requestor.RequestToResponse(request, Program.SecretKeyForBridge);

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

            if (listDeletedUUID == null || listDeletedUUID.Count() < 1)
            {
                return;
            }

            try
            {
                string query = string.Format(Program.FormatQueryDeletePrnInfo, strDeletedUUIDs);

                using (BridgeRequestor requestor = new BridgeRequestor(Program.Environment.Database.Host, Program.Environment.Database.Port))
                {
                    BridgeRequest  request  = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, query);
                    BridgeResponse response = requestor.RequestToResponse(request, Program.SecretKeyForBridge);

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

            //////////////////////////////////////////////////////////////////////////////

            IEnumerable<PrintJobData> listDeletedJob = from job in jobInfo.JobList where job.PrnSave == false select job;

            if (listDeletedJob == null || listDeletedJob.Count() < 1)
            {
                return;
            }

            foreach (PrintJobData jobData in listDeletedJob)
            {
                string jobPath  = string.Empty;
                string metaPath = string.Empty;
                string pdfPath  = string.Empty;

                try
                {
                    jobPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName);

                    FileInfo fileJob = new FileInfo(jobPath);
                    fileJob.Delete();

                    Logger.DebugFormat("Spoolfile delete success (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", fileJob.Name, jobInfo.UserID, jobInfo.PrintIPAddress);
                }
                catch (Exception ex)
                {
                    Logger.Debug(string.Format("Spoolfile delete fail (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", jobPath, jobInfo.UserID, jobInfo.PrintIPAddress), ex);
                }

                try
                {
                    metaPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathMetadataDirectory, jobData.ClientIPAddress, Path.GetFileNameWithoutExtension(jobData.SpoolFileName) + Program.ExtensionMetadata);

                    FileInfo fileJob = new FileInfo(metaPath);
                    fileJob.Delete();

                    Logger.DebugFormat("Spoolfile's Metadata delete success (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", fileJob.Name, jobInfo.UserID, jobInfo.PrintIPAddress);
                }
                catch (Exception ex)
                {
                    Logger.Debug(string.Format("Spoolfile's Metadata delete fail (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", metaPath, jobInfo.UserID, jobInfo.PrintIPAddress), ex);
                }

                try
                {
                    pdfPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + Program.ExtensionPDF);

                    FileInfo filePDF = new FileInfo(pdfPath);
                    filePDF.Delete();

                    Logger.DebugFormat("Spoolfile's PDF delete success (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", filePDF.Name, jobInfo.UserID, jobInfo.PrintIPAddress);
                }
                catch (Exception ex)
                {
                    Logger.Debug(string.Format("Spoolfile's PDF delete fail (PATH : {0} // UserID: {1} // PrintIPAddress: {2}))", pdfPath, jobInfo.UserID, jobInfo.PrintIPAddress), ex);
                }
            }
        }

        #endregion Methods
    }
}