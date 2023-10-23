namespace FXKIS.SmartWhere.PrintingModule.Mac
{
    using FXKIS.Common.Environment;
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;
    using System.Linq;
    using System.Net.Sockets;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Xml;
    using XmlLibrary;

    public class PrintProcessor
    {
        private const string RegexExtractNup    = "@PJL SET JOBATTR=\"@NLPP=(.+)\"";
        private const string SecretKeyForAES256 = "<//SmartWhere_v3.0//_developed_by_[FXKIS_SEC::20157001::Chosm]>";

        private const string ExtensionPDF  = ".pdf";
        private const string ExtensionJson = ".json";

        public const string XmlTemplateFileName = "XmlTemplate.xml";

        private const string PjlStrJoau = "@PJL SET JOBATTR=\"@JOAU=";
        private const string PjlStrJoet = "@PJL SET JOBATTR=\"@JOET={0}\"";
        private const string SuccessStr = "SUCCESS";
        private const string FailStr    = "FAIL";

        public SmartWhereEnvironment Environment { get; private set; }

        public FileInfo TempSpool { get; set; }
        public FileInfo TempPDF { get; set; }


        public static readonly ILog Logger = LogManager.GetLogger(typeof(PrintProcessor));

        public PrintProcessor(SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.Environment = env;

            this.TempSpool = null;
            this.TempPDF   = null;      
        }

        public bool TryExtractValue(string input, string pattern, out string value)
        {
            Match match = Regex.Match(input, pattern);

            if (match == null || match.Success == false || match.Groups == null || match.Groups.Count < 2 || match.Groups[1] == null)
            {
                value = string.Empty;
                return false;
            }

            value = match.Groups[1].Value;
            return true;
        }

        public void PrintJob(string jobInfoName)
        {
            string jobInfoPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathPrintJobDirectory, jobInfoName);
            
            PrintJobInformation jobInfo = this.LoadJobInfo(jobInfoPath);

            if (jobInfo == null)
            {
                throw new ArgumentNullException("PrintJobInformation jobInfo");
            }

            bool isSuccess = false;

            Logger.InfoFormat("PrintingModule START ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);

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

                    // 가공할 spool 파일
                    string modiSpool = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName+ "TEMP");

                    this.TempSpool = new FileInfo(modiSpool);
                    if (this.TempSpool.Exists == true)
                    {
                        this.TempSpool.Delete();
                    }
                    spoolFile.CopyTo(modiSpool);


                    // 메타데이터 확인
                    string metadataPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathMetadataDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + ".json");
                    
                    PrnMetadata metadata = FileObjectManagement.LoadJson<PrnMetadata>(metadataPath);

                    if (metadata == null)
                    {
                        throw new ArgumentNullException("PrnMetadata metadata");
                    }

                    // pdf 파일
                    FileInfo pdfFile = new FileInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + ".pdf"));

                    if(pdfFile.Exists == false)
                    {
                        throw new FileNotFoundException("Is not PDF file.");
                    }

                    // 가공할  pdf 파일
                    this.TempPDF = new FileInfo(Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, jobData.SpoolFileName + "TEMP.pdf"));
                    if (this.TempPDF.Exists == true)
                    {
                        this.TempPDF.Delete();
                    }
                    pdfFile.CopyTo(this.TempPDF.FullName);
                    
                    //// pdf파일일때
                    //// Meta File의 가공정책을 PDF Format에 적용
                    PdfProcessor pdfProcessor = new PdfProcessor(metadata, jobData, this.TempSpool, this.TempPDF);
                    
                    isSuccess = pdfProcessor.Start();
                    if (isSuccess == false)
                    {
                        break;
                    }


                    // xml데이터 존재 안함..

                    //pjl로 확인,..
                    string data = string.Empty;
                    string nup = string.Empty;
                    using (FileStream fs = this.TempSpool.OpenRead())
                    {
                        using (StreamReader sr = new StreamReader(fs, Encoding.UTF8))
                        {
                            do
                            {
                                data = sr.ReadLine();

                                if (this.TryExtractValue(data, PrintProcessor.RegexExtractNup, out nup) == true)
                                {
                                    int nupNum = 0;

                                    if (int.TryParse(nup, out nupNum) == false)
                                    {
                                        string tempNum = nup.Substring(1);
                                        if (int.TryParse(tempNum, out nupNum) == false)
                                        {
                                            throw new ArgumentOutOfRangeException("nup");
                                        }
                                    }

                                    if (nupNum == 0)
                                    {
                                        throw new ArgumentOutOfRangeException("nup");
                                    }

                                    nup = nupNum.ToString();
                                    break;
                                }
                            } while (sr.EndOfStream == false);
                        }
                    }

                    int numberUpJobData = jobData.Nup;

                    Logger.InfoFormat("numberUpJobData : {0} ", numberUpJobData);

                    if (nup == "1" && numberUpJobData > 1)
                    {
                        nup = numberUpJobData.ToString();
                        MakeSpool make = new MakeSpool(jobData,metadata, nup, this.TempSpool, this.TempPDF);
                        isSuccess = make.StartJob();
                        if (isSuccess == false)
                        {
                            break;
                        }
                    }
                    else if(nup == "1" && metadata.Policy.PrintOption.Force2Up == true)
                    {
                        MakeSpool make = new MakeSpool(jobData, metadata, nup, this.TempSpool, this.TempPDF);
                        isSuccess = make.StartJob();
                        if (isSuccess == false)
                        {
                            break;
                        }
                    }
                    else
                    {
                        // numberUp 안바뀔때
                        // xml가공
                        XmlProcessor xmlProcessor = new XmlProcessor(metadata, jobData);

                        // PrintJobData의 실패시 종료(실패 후의 JobList는 시도 안함)
                        isSuccess = xmlProcessor.Start(this.TempSpool);
                        if (isSuccess == false)
                        {
                            break;
                        }
                    }
                    
                    isSuccess = this.PrintSpool(spoolFile, jobInfo);

                    this.TempPDF.Delete();
                    this.TempSpool.Delete();

                    //PrintJob 실패시 종료(실패 후의 JobList는 시도 안함)
                    if (isSuccess == false)
                    {
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);

                    if (this.TempSpool.Exists == true)
                    {
                        this.TempSpool.Delete();
                    }

                    if (this.TempPDF.Exists == true)
                    {
                        this.TempPDF.Delete();
                    }
                }
            }
            
            if (isSuccess == true)
            {
                Console.WriteLine(PrintProcessor.SuccessStr);
                Logger.InfoFormat("PrintingModule Success ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);

                PrintProcessor.DeleteSuccessSpool(jobInfo);
            }
            else
            {
                Console.WriteLine(PrintProcessor.FailStr);
                Logger.InfoFormat("PrintingModule Fail ( PATH: {0} // UserID: {1} // PrintIPAddress: {2})", jobInfoName, jobInfo.UserID, jobInfo.PrintIPAddress);
            }
        }


        public PrintJobInformation LoadJobInfo(string jobInfoPath)
        {
            FileInfo jobInfoFi = new FileInfo(jobInfoPath);

            if (jobInfoFi.Exists == false)
            {
                throw new FileNotFoundException("PrintJobInformation not found", jobInfoFi.Name);
            }

            return FileObjectManagement.LoadJson<PrintJobInformation>(jobInfoPath);
        }

        /// <summary>
        /// spoolFile에 jobTicket 추가 후 프린터 전송
        /// </summary>
        /// <returns>프린트 성공 여부</returns>
        public bool PrintSpool(FileInfo spoolFile, PrintJobInformation jobInfo)
        {
            try
            {
                byte data = 0;
                List<byte> listByte = new List<byte>();

                string dataString = string.Empty;
                byte[] arrData;
                using (FileStream fs = this.TempSpool.OpenRead())
                {
                    using (BinaryReader br = new BinaryReader(fs))
                    {
                        using (TcpClient client = new TcpClient(jobInfo.PrintIPAddress, Program.Environment.PrintingModule.PortForMac))
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
                                            if (dataString.Contains(PrintProcessor.PjlStrJoau) == true)
                                            {
                                                if (string.IsNullOrWhiteSpace(jobInfo.JobTicket) == false)
                                                {
                                                    arrData = Encoding.UTF8.GetBytes(string.Format(PrintProcessor.PjlStrJoet, jobInfo.JobTicket));

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

            IEnumerable<string> listUsedUUID = from job in jobInfo.JobList where job.PrnSave == true select job.UUID;
            IEnumerable<string> listDeletedUUID = from job in jobInfo.JobList where job.PrnSave == false select job.UUID;

            string strUsedUUIDs = string.Empty;
            string strDeletedUUIDs = string.Empty;

            //////////////////////////////////////////////////////////////////////////////

            try
            {
                strUsedUUIDs = string.Format("'{0}'", string.Join("','", listUsedUUID));

                using (SqlConnection conn = Program.Environment.Database.CreateSqlConnection(PrintProcessor.SecretKeyForAES256))
                {
                    string query = string.Format("UPDATE PRNINFO SET USEYN = 'Y' WHERE UUID IN ({0})", strUsedUUIDs);

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.ExecuteNonQuery();
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
                strDeletedUUIDs = string.Format("'{0}'", string.Join("','", listDeletedUUID));

                using (SqlConnection conn = Program.Environment.Database.CreateSqlConnection(PrintProcessor.SecretKeyForAES256))
                {
                    string query = string.Format("DELETE FROM PRNINFO WHERE UUID IN ({0})", strDeletedUUIDs);

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.ExecuteNonQuery();
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
                    metaPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathMetadataDirectory, jobData.ClientIPAddress, 
                        Path.GetFileNameWithoutExtension(jobData.SpoolFileName) + PrintProcessor.ExtensionJson);

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
                    pdfPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory, jobData.ClientIPAddress, 
                        jobData.SpoolFileName + PrintProcessor.ExtensionPDF);

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
    }
}
