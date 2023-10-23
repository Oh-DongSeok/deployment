namespace FXKIS.SmartWhere.Receive.Mac
{
    using FXKIS.Common.Environment;
    using FXKIS.Common.Extension;
    using FXKIS.SmartWhere.Metadata;
    using FXKIS.SmartWhere.Policy;
    using iTextSharp.text.pdf;
    using log4net;
    using PdfLibrary;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading;
    using System.Xml;
    using XmlLibrary;
    using FXKIS.SmartWhere.CommonIF;

    public class SpoolAnalyze
    {
        public SmartWhereEnvironment Environment { get; private set; }

        public static readonly ILog Logger = LogManager.GetLogger(typeof(SpoolAnalyze));

        private const string SecretKeyForAES256 = "<//SmartWhere_v3.0//_developed_by_[FXKIS_SEC::20157001::Chosm]>";

        private const string CommandString      = "INSERT INTO dbo.PRNINFO(rcdTime, uuId, userId, spoolNm, docNm, printNm, totalPages, useYn, jobTime, colorMode, destColorMode, duplexMode, destDuplexMode, nup, destNup, copies, userIp, driverType, jobStatus, printValue, REMAIN_DAY, backupStatus) VALUES(@rcdTime, @uuId, @userId, @spoolNm, @docNm, @printNm, @totalPages, @useYn, @jobTime, @colorMode, @destColorMode, @duplexMode, @destDuplexMode, @nup, @destNup, @copies, @userIp,@driverType, @jobStatus, @printValue, @REMAIN_DAY, @backupStatus)";

        private static readonly byte[] TokenStartPDF = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D }; // %PDF-
        private static readonly byte[] TokenEndPDF   = new byte[] { 0x25, 0x25, 0x45, 0x4F, 0x46 }; // %%EOF

        // todo ::  pdf페이지, 부수, 양단면, 컬러 -> xml
        // PAGEINFO=SIZE, PHYSICALPAGES, JOBCOPIES, DUPLEXTYPE, RENDERMODE 정보 없음
        public const string RegexExtractEnterLanguage = "@PJL ENTER LANGUAGE=(.+)";
        public const string RegexExtractUserId        = "@PJL SET JOBATTR=\"@JOAU=(.+)\"";
        public const string RegexExtractDocNameFirst  = "@PJL SET JOBATTR=\"@ACNA=(.+)\"";
        public const string RegexExtractNup           = "@PJL SET JOBATTR=\"@NLPP=(.+)\"";
        
        private const string ValueOneSided            = "ONESIDED";
        private const string ValueTwoSidedLongEdge    = "TWOSIDEDLONGEDGE";
        private const string ValueTwoSidedShortedge   = "TWOSIDEDSHORTEDGE";
        private const string ValueColor               = "COLOR";
        private const string ValueMonochromeGrayscale = "MONOCHROMEGRAYSCALE";

        public const string DocumentProcessingNode                  = "PwgPrintJobTicket/DocumentProcessing";        
        public const string DocumentProcessingChildCopies           = "Copies";
        public const string DocumentProcessingChildSides            = "Sides";
        public const string DocumentProcessingChildColorEffectsType = "ColorEffectsType";
        
        public const int ToLength = 64;

        public const string Title = "Title";

        public const string UEL = "%-12345X";
        public const string Acna = "@PJL SET JOBATTR=\"@ACNA";


        public const string CodeSet = "@PJL SET STRINGCODESET=CP932\n";
        public const string AcnaSet = "@PJL SET JOBATTR=\"@ACNA={0}\"\n";
        public const string EnterLanguage = "@PJL ENTER LANGUAGE=PDF";

        public string       Status  { get; set; }
        public JobInfo      JobInfo { get; set; }
        public List<string> Reason  { get; set; }
        


        public override string ToString()
        {
            return SerializationEx.ObjectToJson(this);
        }

        public SpoolAnalyze()
        {
            this.Status  = string.Empty;
            this.JobInfo = null;
            this.Reason  = new List<string>();                       
        }

        public void Analyze(object obj)
        {
            try
            {
                string successStr = "success";
                string failStr    = "fail";

                if (obj == null)
                {
                    throw new ArgumentNullException("object obj");
                }

                ReceiveSpoolInfo spoolInfo = (ReceiveSpoolInfo)obj;

                if (spoolInfo == null)
                {
                    throw new ArgumentNullException("ReceiveSpoolInfo");
                }

                JobInfo jobInfo = new JobInfo();

                string path = spoolInfo.SpoolFile.DirectoryName;
                string data = string.Empty;

                string language  = string.Empty;
                string userId    = string.Empty;
                string docName   = string.Empty;
                string nup       = string.Empty;
                
                if(spoolInfo.SpoolFile.Exists == false)
                {
                    throw new FileNotFoundException("spoolFile not exists", spoolInfo.SpoolFile.Name);
                }

                using (FileStream fs = spoolInfo.SpoolFile.OpenRead())
                {
                    using (StreamReader sr = new StreamReader(fs, System.Text.Encoding.UTF8))
                    {
                        do
                        {
                            data = sr.ReadLine();

                            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractUserId, out userId) == true)
                            {
                                jobInfo.UserId = userId;
                                if (string.IsNullOrWhiteSpace(jobInfo.UserId))
                                {
                                    this.Reason.Add("userId is null or white space");
                                }
                                continue;
                            }

                            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractDocNameFirst, out docName) == true)
                            {
                                jobInfo.DocName = docName;                                
                                continue;
                            }

                            
                            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractEnterLanguage, out language) == true)
                            {
                                jobInfo.EnterLanguage = language;
                                continue;
                            }
                            

                            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractNup, out nup) == true)
                            {          
                                int nupNum = 0;

                                if (int.TryParse(nup, out nupNum) == false)
                                {
                                    string tempNum =  nup.Substring(1);
                                    if (int.TryParse(tempNum, out nupNum) == false)
                                    {
                                        this.Reason.Add("nup is not a num");
                                        continue;
                                    }              
                                }

                                jobInfo.Nup = nupNum;

                                if (jobInfo.Nup == 0)
                                {
                                    this.Reason.Add("nup  is not a num");
                                }
                                continue;
                            }

                        } while (sr.EndOfStream == false);

                        if(jobInfo.EnterLanguage != "PDF")
                        {
                            this.Reason.Add("is not PDF file");
                        }

                        // pdf file 생성

                        string pdfPath = Path.Combine(path, spoolInfo.SpoolFile.Name + ".pdf");

                        PdfCutter pdfCutter = new PdfCutter();

                        pdfCutter.MakePDF(spoolInfo.SpoolFile, pdfPath);

                        PdfReader readerPdf = new PdfReader(pdfPath);

                        jobInfo.PageCount = readerPdf.NumberOfPages; // 페이지

                        // title

                        string title = string.Empty;

                        Hashtable hashtable = readerPdf.Info;
                        if (hashtable.ContainsKey(SpoolAnalyze.Title))
                        {
                            title = hashtable[SpoolAnalyze.Title].ToString();
                            jobInfo.DocName = title;
                        }

                        string xmlPath = Path.Combine(path, spoolInfo.SpoolFile.Name + ".xml");

                        XmlHandler xmlModify = new XmlHandler();
                        xmlModify.MakeXML(spoolInfo.SpoolFile.FullName, xmlPath);

                        // todo :: pdf페이지, 부수, 양단면, 컬러모드 ; xml에서 analyze 
                        XmlDocument document = new XmlDocument();
                        document.Load(xmlPath);
                        
                        
                        // 부수
                        string getCopies = xmlModify.GetNode(document, SpoolAnalyze.DocumentProcessingNode, SpoolAnalyze.DocumentProcessingChildCopies);

                        int copiesParse = 0;
                        if (int.TryParse(getCopies, out copiesParse) == false)
                        {
                            this.Reason.Add("copies is not a num");
                        }
                        jobInfo.Copies = copiesParse;

                        // 양단면
                        string getSides = xmlModify.GetNode(document, SpoolAnalyze.DocumentProcessingNode, SpoolAnalyze.DocumentProcessingChildSides);

                        switch (getSides.ToUpper())
                        {
                            case SpoolAnalyze.ValueOneSided:
                                jobInfo.OutPlex = JobInfo.DuplexType.S;
                                break;

                            case SpoolAnalyze.ValueTwoSidedLongEdge:
                                jobInfo.OutPlex = JobInfo.DuplexType.DL;
                                break;
                            case SpoolAnalyze.ValueTwoSidedShortedge:
                                jobInfo.OutPlex = JobInfo.DuplexType.DS;
                                break;
                            default:
                                jobInfo.OutPlex = JobInfo.DuplexType.Unknown;
                                this.Reason.Add("outPlex is null or white space");
                                break;
                        }

                        // 컬러모드
                        string getColor = xmlModify.GetNode(document, SpoolAnalyze.DocumentProcessingNode, SpoolAnalyze.DocumentProcessingChildColorEffectsType);

                        switch (getColor.ToUpper())
                        {
                            case SpoolAnalyze.ValueColor:
                                jobInfo.ColorMode = JobInfo.ColorType.C;
                                break;

                            case SpoolAnalyze.ValueMonochromeGrayscale:
                                jobInfo.ColorMode = JobInfo.ColorType.B;
                                break;
                            default:
                                jobInfo.ColorMode = JobInfo.ColorType.Unknown;
                                this.Reason.Add("colorMode is null or white space");
                                break;
                        }


                        File.Delete(xmlPath);


                        if (string.IsNullOrWhiteSpace(jobInfo.DocName))
                        {
                            this.Reason.Add("docName is null or white space");
                        }

                        if (this.Reason.Count > 0)
                        {
                            this.Status = failStr;
                        }
                        else
                        {
                            this.Status = successStr;
                        }

                        jobInfo.UserIp  = spoolInfo.ClientIPAddress;

                        jobInfo.RcdTime = spoolInfo.ReceiveStartTime;

                        jobInfo.SubmitTime = jobInfo.RcdTime.ToString("yyyy-MM-dd HH:mm:ss.fff");

                        this.JobInfo = jobInfo;

                        //string jsonName = spoolInfo.SpoolFile.Name + ".json";

                        //FXKIS.Common.Environment.FileObjectManagement.SaveJson(Path.Combine(path, jsonName), this, true);
                        //Logger.DebugFormat("JSON File :: {0}", jsonName);
                        Logger.InfoFormat("Extract Data :: \n{0}", this.ToString());
                    }
                }

                if (this.Status == failStr)
                {
                    DirectoryInfo errorDi = new DirectoryInfo(Path.Combine(ReceiveServiceMac.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMac.Environment.Common.PathErrorSpoolDirectory));
                    
                    if (errorDi.Exists == false)
                    {
                        errorDi.Create();
                    }

                    spoolInfo.SpoolFile.MoveTo(Path.Combine(ReceiveServiceMac.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMac.Environment.Common.PathErrorSpoolDirectory, spoolInfo.SpoolFile.Name));

                    //FileInfo fi = new FileInfo(Path.Combine(path, spoolInfo.SpoolFile.Name + ".json"));

                    //if (fi.Exists == true)
                    //{
                    //    fi.MoveTo(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, fi.Name));
                    //}

                    if (jobInfo.EnterLanguage == "PDF")
                    {
                        FileInfo pdfFile = new FileInfo(Path.Combine(path, spoolInfo.SpoolFile.Name + ".pdf"));

                        if (pdfFile.Exists == true)
                        {
                            pdfFile.MoveTo(Path.Combine(ReceiveServiceMac.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMac.Environment.Common.PathErrorSpoolDirectory, pdfFile.Name));
                        }
                    }

                    Logger.Warn("DB Insert Fail : Lack of extraction JobInfo");

                    return;
                }


                // todo :: @PJL SET STRINGCODESET=CP932, @PJL SET JOBATTR="@UACN=Sample3.pdf" 추가

                this.AddMacPjl(spoolInfo.SpoolFile.FullName, jobInfo.DocName);
                

                // 가공정책(Header/Footer & Watermark) 정보 취득 후에 Meta File작성
                SqlConnection conn = ReceiveServiceMac.Environment.Database.CreateSqlConnection(SpoolAnalyze.SecretKeyForAES256);

                PrnPolicyDatabaseManager db = new PrnPolicyDatabaseManager(conn);

                PrnPolicy policy = new PrnPolicy();

                policy = db.Load(jobInfo.UserId);

                if (policy == null)
                {
                    throw new InvalidDataException(string.Format("USER \"{0}\" is not exists in SmartWhere", jobInfo.UserId));
                }

                PrnMetadata metadata = new PrnMetadata();

                string fileNm = spoolInfo.SpoolFile.Name;

                string[] fileForm = fileNm.Split('_');

                PrnInformation prnInformation = new PrnInformation()
                {
                    JobTime       = jobInfo.RcdTime,
                    ReceivedTime  = jobInfo.RcdTime,
                    UUID          = fileForm[1],
                    UserID        = jobInfo.UserId,
                    SpoolName     = fileNm,
                    DocumentName  = jobInfo.DocName,
                    TotalPages    = jobInfo.PageCount,
                    Copies        = jobInfo.Copies,
                    Nup           = jobInfo.Nup, 
                    UserIPAddress = jobInfo.UserIp,
                    Queue         = string.Empty
                };
                
                metadata.SetPrnInformation(prnInformation);
                metadata.SetPolicy(policy);

                DirectoryInfo metaDi = new DirectoryInfo(Path.Combine(ReceiveServiceMac.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMac.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress));

                if (metaDi.Exists == false)
                {
                    metaDi.Create();
                }
                
                FileObjectManagement.SaveJson(Path.Combine(ReceiveServiceMac.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMac.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress, spoolInfo.SpoolFile.Name+".json"), metadata, true);
        
                bool isSuccess = this.DBInsert(jobInfo, spoolInfo);

                if (isSuccess)
                {
                    Logger.Debug("DB Insert Success");
                }
                else
                {
                    Logger.Warn("DB Insert Fail");
                }

            }
            catch (Exception ex)
            {
                Logger.Warn(ex);
            }
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

        public void AddMacPjl(string spoolPath, string docName)
        {
            double length = 0;
            string value = docName;

            for (int i = 0 ; i < value.Length ; i++)
            {
                char c = value[i];
                length += (Char.GetUnicodeCategory(c) == System.Globalization.UnicodeCategory.OtherLetter) ? 2 : 1;

                if (length > SpoolAnalyze.ToLength)
                {
                    docName = value.Substring(0, i);
                    break;
                }
            }            

            string tempPath = spoolPath + "temp";
            if(File.Exists(tempPath) == true)
            {
                File.Delete(tempPath);
            }
            
            try
            {
                byte data = 0;
                List<byte> listByte = new List<byte>();
                string dataString = string.Empty;

                bool hasUEL = false;
                bool hasAcna = false;

                using (FileStream loadFs = new FileStream(spoolPath, FileMode.Open))
                {
                    using (BinaryReader br = new BinaryReader(loadFs))
                    {
                        using (FileStream saveFs = new FileStream(tempPath, FileMode.CreateNew, FileAccess.Write))
                        {
                            using (BinaryWriter bw = new BinaryWriter(saveFs))
                            {
                                do
                                {
                                    if (hasUEL == true && hasAcna == true)
                                    {
                                        break;
                                    }

                                    if (dataString.Contains(SpoolAnalyze.EnterLanguage) == true)
                                    {
                                        break;
                                    }

                                    data = br.ReadByte();
                                    listByte.Add(data);
                                    if (data == 0x0a)
                                    {
                                        dataString = Encoding.UTF8.GetString(listByte.ToArray());

                                        //STRINGCODESET 삽입
                                        if (hasUEL == false && dataString.Contains(SpoolAnalyze.UEL) == true)
                                        {
                                            bw.Write(listByte.ToArray());
                                            bw.Write(Encoding.Default.GetBytes(SpoolAnalyze.CodeSet));
                                            bw.Flush();
                                            listByte.Clear();

                                            hasUEL = true;
                                            continue;
                                        }

                                        //ACNA 수정
                                        if (hasAcna == false && dataString.Contains(SpoolAnalyze.Acna) == true)
                                        {
                                            bw.Write(Encoding.Default.GetBytes(string.Format(SpoolAnalyze.AcnaSet, docName)));
                                            bw.Flush();
                                            listByte.Clear();

                                            hasAcna = true;
                                            continue;
                                        }
                                        bw.Write(listByte.ToArray());
                                        bw.Flush();
                                        listByte.Clear();
                                    }
                                } while (br.BaseStream.Position < loadFs.Length);

                                
                                if (hasUEL == false)
                                {
                                    throw new InvalidDataException("UEL is not found");
                                }

                                if (hasAcna == false)
                                {
                                    throw new InvalidDataException("ACNA is not found");
                                }

                                byte[] dataByte = null;

                                do
                                {
                                    dataByte = br.ReadBytes(ReceiveServiceMac.Environment.MacOS.BufferSize);
                                    bw.Write(dataByte);
                                    bw.Flush();

                                }
                                while (dataByte != null && dataByte.Length > 0);
                                
                            }
                        }
                    }
                }
                File.Delete(spoolPath);
                File.Move(tempPath, spoolPath);
            }
            catch (Exception ex)
            {
                if (File.Exists(tempPath) == true)
                {
                    File.Delete(tempPath);
                }
                throw ex;
            }
        }
        
        public bool DBInsert(JobInfo data, ReceiveSpoolInfo spool)
        {
            this.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);


            if (data == null)
            {
                throw new ArgumentNullException("JobInfo data");
            }

            if (spool == null)
            {
                throw new ArgumentNullException("ReceiveSpoolInfo spool");
            }

            string fileNm = spool.SpoolFile.Name;

            string[] fileForm = fileNm.Split('_');

            if (fileForm.Length != 2)
            {
                throw new FormatException("파일형식이 틀림"); //dfa001_uuid
            }

            string uuid = fileForm[1];

            for (int i = 0; i < ReceiveServiceMac.Environment.MacOS.InsertAttemptCount; i++)
            {
                try
                {
                    using (SqlConnection conn = ReceiveServiceMac.Environment.Database.CreateSqlConnection(SpoolAnalyze.SecretKeyForAES256))
                    {
                        using (SqlCommand command = new SqlCommand())
                        {
                            command.Connection = conn;

                            command.CommandText = SpoolAnalyze.CommandString;

                            command.Parameters.AddWithValue("@rcdTime", data.RcdTime);
                            command.Parameters.AddWithValue("@uuId", uuid);
                            command.Parameters.AddWithValue("@userId", data.UserId);
                            command.Parameters.AddWithValue("@spoolNm", fileNm);
                            command.Parameters.AddWithValue("@docNm", data.DocName);
                            command.Parameters.AddWithValue("@printNm", data.PrintNm);
                            command.Parameters.AddWithValue("@totalPages", data.PageCount);
                            command.Parameters.AddWithValue("@useYn", data.UseYn);
                            command.Parameters.AddWithValue("@jobTime", data.RcdTime.ToString("yyyyMMddHHmmssfff"));
                            command.Parameters.AddWithValue("@colorMode", data.ColorMode.ToString());
                            command.Parameters.AddWithValue("@destColorMode", data.ColorMode.ToString());
                            command.Parameters.AddWithValue("@duplexMode", data.OutPlex.ToString());
                            command.Parameters.AddWithValue("@destDuplexMode", data.OutPlex.ToString());
                            command.Parameters.AddWithValue("@nup", data.Nup);
                            command.Parameters.AddWithValue("@destNup", data.Nup);
                            command.Parameters.AddWithValue("@copies", data.Copies);
                            command.Parameters.AddWithValue("@userIp", data.UserIp);
                            command.Parameters.AddWithValue("@driverType", data.DriverType);
                            command.Parameters.AddWithValue("@jobStatus", data.JobStatus);
                            command.Parameters.AddWithValue("@printValue", data.PrintValue);
                            command.Parameters.AddWithValue("@REMAIN_DAY", data.RemainDay);
                            command.Parameters.AddWithValue("@backupStatus", 0);
                            command.Parameters.AddWithValue("@serverIdx", this.Environment.PostScheduler.ServerIndex);


                            if (command.ExecuteNonQuery() == 1)
                            {
                                return true;
                            }
                        }
                    }

                    Thread.Sleep(ReceiveServiceMac.Environment.MacOS.InsertTimeoutMS);
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                    return false;
                }
            }
            return false;
        }

    }
}