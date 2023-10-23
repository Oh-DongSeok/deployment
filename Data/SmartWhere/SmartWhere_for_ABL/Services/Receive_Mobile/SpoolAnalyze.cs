namespace FXKIS.SmartWhere.Receive.Mobile
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Threading;
    using System.Xml;

    using iTextSharp.text.pdf;
    using log4net;

    using Common.Environment;
    using Common.Extension;

    using Metadata;
    using Policy;
    using PdfLibrary;

    public class SpoolAnalyze
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(SpoolAnalyze));

        private const string SecretKeyForAES256 = "<//SmartWhere_v3.0//_developed_by_[FXKIS_SEC::20157001::Chosm]>";

        private const string CommandString      = "INSERT INTO dbo.PRNINFO(rcdTime, uuId, userId, spoolNm, docNm, printNm, totalPages, useYn, jobTime, colorMode, destColorMode, duplexMode, destDuplexMode, nup, destNup, copies, userIp, driverType, jobStatus, printValue, REMAIN_DAY, backupStatus, serverIdx) VALUES(@rcdTime, @uuId, @userId, @spoolNm, @docNm, @printNm, @totalPages, @useYn, @jobTime, @colorMode, @destColorMode, @duplexMode, @destDuplexMode, @nup, @destNup, @copies, @userIp,@driverType, @jobStatus, @printValue, @REMAIN_DAY, @backupStatus,@serverIdx)";
        //private const string CommandString = "INSERT INTO dbo.PRNINFO(rcdTime, uuId, userId, spoolNm, docNm, printNm, totalPages, useYn, jobTime, colorMode, destColorMode, duplexMode, destDuplexMode, nup, destNup, copies, userIp, driverType, jobStatus, printValue, REMAIN_DAY, backupStatus) VALUES(@rcdTime, @uuId, @userId, @spoolNm, @docNm, @printNm, @totalPages, @useYn, @jobTime, @colorMode, @destColorMode, @duplexMode, @destDuplexMode, @nup, @destNup, @copies, @userIp,@driverType, @jobStatus, @printValue, @REMAIN_DAY, @backupStatus)";

        private static readonly byte[] TokenStartPDF = new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D }; // %PDF-
        private static readonly byte[] TokenEndPDF   = new byte[] { 0x25, 0x25, 0x45, 0x4F, 0x46 }; // %%EOF
        private static readonly byte[] TokenStartPJL = new byte[] { 0x1B, 0x25, 0x2D, 0x31, 0x32, 0x33, 0x34, 0x35, 0x58 }; // %-12345X

        public const string StringPDF   = "PDF";
        public const string StringPCLXL = "PCLXL";

        public const string RegexExtractEnterLanguage = "@PJL ENTER LANGUAGE=(.+)";
        public const string RegexExtractUserId        = "@PJL SET JOBATTR=\"@JOAU=(.+)\"";
        public const string RegexExtractDocName       = "@PJL SET JOBATTR=\"@UACN=(.+)\"";
        public const string RegexExtractSetDocName    = "@PJL SET JOBATTR=\"@ACNA=(.+)\"";
        public const string RegexExtractPaperSize     = "@PJL COMMENT FXJOBINFO PAGEINFO=SIZE\\[(\\S+)\\]+:MODE";
        public const string RegexExtractColorMode     = "@PJL COMMENT FXJOBINFO COLORMODE=(.+)";
        public const string RegexExtractPhysicalPages = "@PJL COMMENT FXJOBINFO PHYSICALPAGES=(.+)";
        public const string RegexExtractLogicalPages  = "@PJL COMMENT FXJOBINFO LOGICALPAGES=(.+)";
        public const string RegexExtractCopies        = "@PJL COMMENT FXJOBINFO JOBCOPIES=(.+)";
        public const string RegexExtractNup           = "@PJL COMMENT FXJOBINFO NUP=(.+)";
        public const string RegexExtractOutPlex       = "@PJL COMMENT FXJOBINFO DUPLEXTYPE=(.+)";
        public const string RegexExtractDname         = "@PJL COMMENT DNAME=(.+)";

        public const string EndOfJob = "@PJL EOJ";

        public const string ExtensionPdf = ".pdf";
       
        public const string UacnSetStr = "@PJL SET JOBATTR=\"@UACN={0}\"\n";
        public const string AcnaSetStr = "@PJL SET JOBATTR=\"@ACNA={0}\"\n";
        public const int    ToLength   = 64;

        private const string ValueSimplex   = "SIMPLEX";
        private const string ValueDuplex    = "DUPLEX";
        private const string ValueTumble    = "TUMBLE";
        private const string ValueColor     = "COLOR";
        private const string ValueGrayScale = "GRAYSCALE";
        
        public enum EnterLanguageType
        {
            None,
            PDF,
            PCLXL
        }

        public enum WriteStatus
        {
            BeforePdf,
            BeginPdf,
            EndPdf,
            BeforePCL,
            BeginPCL,
            EndPCL
        }


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


        public const string DocumentProcessingNode           = "PwgPrintJobTicket/DocumentProcessing";
        public const string DocumentProcessingNodeChildUpper = "PageRanges/PageRange/Upperbound";
        public const string DocumentProcessingNodeChildLower = "PageRanges/PageRange/Lowerbound";
        

        public void Start(object obj)
        {
            /* 
             * 모바일 docName -> ACNA에 표시해야함(기계 로그)
             * ios     : UACN에서 받은 문서명을 ACNMA, UACN에 문서명이 정리되어옴
             * android : DNAME에서 받은 문서명을 ACNA
             */

            EnterLanguageType enterLanguage = EnterLanguageType.None;

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
                
                try
                {
                    using (FileStream fs = spoolInfo.SpoolFile.OpenRead())
                    {
                        using (StreamReader sr = new StreamReader(fs))
                        {
                            do
                            {
                                string data      = sr.ReadLine();
                                string stringOut = string.Empty;

                                if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractEnterLanguage, out stringOut) == true)
                                {
                                    stringOut = stringOut.ToUpper();

                                    switch (stringOut)
                                    {
                                        case SpoolAnalyze.StringPDF:

                                            enterLanguage = EnterLanguageType.PDF;
                                            break;

                                        case SpoolAnalyze.StringPCLXL:

                                            enterLanguage = EnterLanguageType.PCLXL;
                                            break;
                                            
                                        default:
                                            break;
                                    }

                                    jobInfo.EnterLanguage = stringOut;
                                    break;
                                }

                            } while (sr.BaseStream.Position <  sr.BaseStream.Length);
                        }
                    }
                    
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);

                    this.Reason.Add(ex.Message);
                }


                switch (enterLanguage)
                {
                    case EnterLanguageType.PDF:
                        this.StartPdfJob(spoolInfo,jobInfo);
                        break;

                    case EnterLanguageType.PCLXL:
                        this.StartPclJob(spoolInfo, jobInfo);
                        break;

                    case EnterLanguageType.None:
                    default:
                                                
                        this.Reason.Add("Unsupported file formats");
                        break;
                }

                if (this.Reason.Count > 0)
                {
                    this.Status = failStr;
                }
                else
                {
                    this.Status = successStr;
                }

                jobInfo.UserIp = spoolInfo.ClientIPAddress;

                jobInfo.RcdTime = spoolInfo.ReceiveStartTime;

                jobInfo.SubmitTime = jobInfo.RcdTime.ToString("yyyy-MM-dd HH:mm:ss.fff");

                this.JobInfo = jobInfo;
                Logger.InfoFormat("Extract Data :: \n{0}", this.ToString());
                                                                                                                       
                if (this.Status == failStr)
                {
                    DirectoryInfo errorDi = new DirectoryInfo(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory));
                    
                    if (errorDi.Exists == false)
                    {
                        errorDi.Create();
                    }

                    spoolInfo.SpoolFile.MoveTo(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, spoolInfo.SpoolFile.Name));
                    
                    if (jobInfo.EnterLanguage == SpoolAnalyze.StringPDF)
                    {
                        FileInfo pdfFile = new FileInfo(Path.Combine(path, spoolInfo.SpoolFile.Name + ".pdf"));

                        if (pdfFile.Exists == true)
                        {
                            pdfFile.MoveTo(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, pdfFile.Name));
                        }
                    }

                    Logger.Warn("DB Insert Fail : Lack of extraction JobInfo");

                    return;
                }

                // 가공정책(Header/Footer & Watermark) 정보 취득 후에 Meta File작성
                SqlConnection conn = ReceiveServiceMobile.Environment.Database.CreateSqlConnection(SpoolAnalyze.SecretKeyForAES256);

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

                DirectoryInfo metaDi = new DirectoryInfo(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress));

                if (metaDi.Exists == false)
                {
                    metaDi.Create();
                }
                
                FileObjectManagement.SaveJson(Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress, spoolInfo.SpoolFile.Name+".json"), metadata, true);
        
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


        public void StartPclJob(ReceiveSpoolInfo spoolInfo, JobInfo jobInfo)
        {
            string data = string.Empty;

            FileInfo newFile = new FileInfo(spoolInfo.SpoolFile.FullName + "temp");
            if (newFile.Exists == true)
            {
                newFile.Delete();
            }

            List<byte[]> tempList = new List<byte[]>();
            List<byte> buffer = new List<byte>();

            byte[] binaryLine = null;
            byte[] newLine = null;

            WriteStatus status = WriteStatus.BeforePCL;
            try
            {
                using (FileStream fsLoad = spoolInfo.SpoolFile.OpenRead())
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        while (fsLoad.Position < fsLoad.Length)
                        {
                            buffer.AddRange(br.ReadBytes(ReceiveServiceMobile.Environment.Mobile.BufferSize));

                            int idxLF = -1;

                            do
                            {
                                idxLF = buffer.IndexOf(0x0A);

                                if (idxLF < 0)
                                {
                                    break;
                                }

                                binaryLine = buffer.GetRange(0, idxLF + 1).ToArray();

                                buffer.RemoveRange(0, binaryLine.Length);


                                switch (status)
                                {
                                    case WriteStatus.BeforePCL:
                                        {
                                            this.AnalyzeData(Encoding.UTF8.GetString(binaryLine), jobInfo, status);
                                        }
                                        break;

                                    case WriteStatus.BeginPCL:
                                        {
                                            int[] idxEndPCL = this.Locate(binaryLine, SpoolAnalyze.TokenStartPJL);

                                            if (idxEndPCL == null || idxEndPCL.Length < 1)
                                            {
                                                //PCL 시작 ~tail pjl시작 전
                                                continue;
                                            }

                                            status = WriteStatus.EndPCL;

                                            newLine = new byte[idxEndPCL[0] + SpoolAnalyze.TokenStartPJL.Length];

                                            Array.Copy(binaryLine, 0, newLine, 0, idxEndPCL[0] + SpoolAnalyze.TokenStartPJL.Length);
                                            

                                            // tail pjl뒤에 data 처리
                                            int delLength = newLine.Length;
                                            if (binaryLine.Length - delLength > 0)
                                            {
                                                newLine = new byte[binaryLine.Length - delLength];

                                                Array.Copy(binaryLine, delLength, newLine, 0, newLine.Length);

                                                buffer.InsertRange(0, newLine);
                                            }
                                        }
                                        break;

                                    case WriteStatus.EndPCL:
                                        {
                                            data = Encoding.UTF8.GetString(binaryLine);

                                            this.AnalyzeData(data, jobInfo, status);

                                            if (data.Contains(SpoolAnalyze.EndOfJob) == true)
                                            {
                                                break;
                                            }
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }
                            while (idxLF >= 0);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Warn(ex);
                
                this.Reason.Add(ex.Message);
            }

            if(jobInfo.Nup == 1)
            {
                jobInfo.Copies    = jobInfo.PhysicalPages / jobInfo.LogicalPages;
                jobInfo.PageCount = jobInfo.LogicalPages;
            }
            else
            {
                int printingPages = (int)Math.Ceiling(((double)jobInfo.LogicalPages / (double)jobInfo.Nup));

                jobInfo.Copies    = jobInfo.PhysicalPages / printingPages; 
                jobInfo.PageCount = jobInfo.LogicalPages;
            }

            jobInfo.DriverType = JobInfo.DriverTypeMode.MOBILE_PCL.ToString();
        }

        public void StartPdfJob(ReceiveSpoolInfo spoolInfo, JobInfo jobInfo)
        {
            string path = spoolInfo.SpoolFile.DirectoryName;
            string data = string.Empty;

            FileInfo newFile = new FileInfo(spoolInfo.SpoolFile.FullName + "temp");
            if (newFile.Exists == true)
            {
                newFile.Delete();
            }

            List<byte[]> tempList = new List<byte[]>();
            List<byte> buffer = new List<byte>();

            byte[] binaryLine = null;
            byte[] newLine = null;

            WriteStatus status = WriteStatus.BeforePdf;
            try
            {
                using (FileStream fsLoad = spoolInfo.SpoolFile.OpenRead())
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        using (FileStream fsSave = newFile.OpenWrite())
                        {
                            using (BinaryWriter bw = new BinaryWriter(fsSave))
                            {
                                while (fsLoad.Position < fsLoad.Length)
                                {
                                    buffer.AddRange(br.ReadBytes(ReceiveServiceMobile.Environment.Mobile.BufferSize));

                                    int idxLF = -1;

                                    do
                                    {
                                        idxLF = buffer.IndexOf(0x0A);

                                        if (idxLF < 0)
                                        {
                                            break;
                                        }

                                        binaryLine = buffer.GetRange(0, idxLF + 1).ToArray();

                                        buffer.RemoveRange(0, binaryLine.Length);


                                        switch (status)
                                        {
                                            case WriteStatus.BeforePdf:
                                                {
                                                    int[] idxStartPDF = this.Locate(binaryLine, SpoolAnalyze.TokenStartPDF);

                                                    if (idxStartPDF == null || idxStartPDF.Length < 1)
                                                    {
                                                        // pdf시작 전 : 0x0a로 잘라서 data 추출
                                                        this.AnalyzeData(Encoding.UTF8.GetString(binaryLine), bw, jobInfo, binaryLine, tempList);
                                                        continue;
                                                    }

                                                    status = WriteStatus.BeginPdf;

                                                    newLine = new byte[binaryLine.Length - idxStartPDF[0]];

                                                    Array.Copy(binaryLine, idxStartPDF[0], newLine, 0, binaryLine.Length - idxStartPDF[0]);

                                                    bw.Write(newLine);
                                                }
                                                break;

                                            case WriteStatus.BeginPdf:
                                                {
                                                    int[] idxEndPDF = this.Locate(binaryLine, SpoolAnalyze.TokenStartPJL);

                                                    if (idxEndPDF == null || idxEndPDF.Length < 1)
                                                    {
                                                        //pdf 시작 ~tail pjl시작 전
                                                        bw.Write(binaryLine);
                                                        continue;
                                                    }

                                                    status = WriteStatus.EndPdf;

                                                    newLine = new byte[idxEndPDF[0] + SpoolAnalyze.TokenStartPJL.Length];

                                                    Array.Copy(binaryLine, 0, newLine, 0, idxEndPDF[0] + SpoolAnalyze.TokenStartPJL.Length);

                                                    bw.Write(newLine);

                                                    // tail pjl뒤에 data 처리
                                                    int delLength = newLine.Length;
                                                    if (binaryLine.Length - delLength > 0)
                                                    {
                                                        newLine = new byte[binaryLine.Length - delLength];

                                                        Array.Copy(binaryLine, delLength, newLine, 0, newLine.Length);

                                                        buffer.InsertRange(0, newLine);
                                                    }
                                                }
                                                break;

                                            case WriteStatus.EndPdf:
                                                {
                                                    data = Encoding.UTF8.GetString(binaryLine);

                                                    this.AnalyzeData(data, bw, jobInfo, binaryLine, tempList);

                                                    if (data.Contains(SpoolAnalyze.EndOfJob) == true)
                                                    {
                                                        break;
                                                    }
                                                }
                                                break;

                                            default:
                                                break;
                                        }
                                    }
                                    while (idxLF >= 0);
                                }
                            }

                        }
                    }
                }
                spoolInfo.SpoolFile.Delete();
                newFile.MoveTo(spoolInfo.SpoolFile.FullName);
            }
            catch (Exception ex)
            {
                Logger.Warn(ex);

                if (newFile.Exists == true)
                {
                    newFile.Delete();
                }
                this.Reason.Add(ex.Message);
            }

            // pdf file 생성

            if (jobInfo.EnterLanguage == SpoolAnalyze.StringPDF)
            {
                string pdfPath = Path.Combine(path, spoolInfo.SpoolFile.Name + ".pdf");

                string xmlPath = Path.Combine(path, spoolInfo.SpoolFile.Name + ".xml");

                this.MakeXML(spoolInfo.SpoolFile.FullName, xmlPath);

                PdfCutter pdfCutter = new PdfCutter();

                pdfCutter.MakePDF(spoolInfo.SpoolFile, pdfPath);
                
                // 문서 출력 시에 Page 범위 지정할 경우
                XmlDocument document = new XmlDocument();
                document.Load(xmlPath);
                string getUpperbound = GetNode(document, SpoolAnalyze.DocumentProcessingNode, SpoolAnalyze.DocumentProcessingNodeChildUpper);
                string getLowerbound = GetNode(document, SpoolAnalyze.DocumentProcessingNode, SpoolAnalyze.DocumentProcessingNodeChildLower);

                if (string.IsNullOrWhiteSpace(getUpperbound) == true || string.IsNullOrWhiteSpace(getLowerbound) == true)
                {
                    PdfReader readerPdf = new PdfReader(pdfPath);

                    jobInfo.PageCount = readerPdf.NumberOfPages;
                }
                else
                {
                    bool isNum = false;

                    int lowerBound = 0;
                    int upperBound = 0;

                    isNum = int.TryParse(getUpperbound, out upperBound);
                    if (isNum == false)
                    {
                        this.Reason.Add("upperBound is not a number");
                    }

                    isNum = int.TryParse(getLowerbound, out lowerBound);
                    if (isNum == false)
                    {
                        this.Reason.Add("lowerBound is not a number");
                    }

                    jobInfo.PageCount = (upperBound - lowerBound) + 1;
                }

                File.Delete(xmlPath);
                jobInfo.DriverType = JobInfo.DriverTypeMode.MOBILE.ToString();
            }
        }

        // PCL
        public void AnalyzeData(string data, JobInfo jobInfo, WriteStatus status)
        {
            string stringOut = string.Empty;

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractDname, out stringOut) == true)
            {
                stringOut = this.SubstringByMulitByte(stringOut, SpoolAnalyze.ToLength);

                jobInfo.DocName = stringOut;
                jobInfo.TemporaryDocName = stringOut;
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractUserId, out stringOut) == true)
            {
                jobInfo.UserId = stringOut;

                if (string.IsNullOrWhiteSpace(jobInfo.UserId))
                {
                    this.Reason.Add("userId is null or white space");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractSetDocName, out stringOut) == true)
            {
                jobInfo.DocName = stringOut;
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractEnterLanguage, out stringOut) == true)
            {
                // todo :: pcl일때 이 이후로 pcl 시작
                status = WriteStatus.BeginPCL;
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractColorMode, out stringOut) == true)
            {
                switch (stringOut.ToUpper())
                {
                    case SpoolAnalyze.ValueColor:
                        jobInfo.ColorMode = JobInfo.ColorType.C;
                        break;

                    case SpoolAnalyze.ValueGrayScale:
                        jobInfo.ColorMode = JobInfo.ColorType.B;
                        break;
                    default:
                        jobInfo.ColorMode = JobInfo.ColorType.Unknown;
                        this.Reason.Add("colorMode is null or white space");
                        break;
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractPhysicalPages, out stringOut) == true)
            {
                int pageNum = 0;

                if (int.TryParse(stringOut, out pageNum) == false)
                {
                    this.Reason.Add("PhysicalPages is not a num");
                    return;
                }

                jobInfo.PhysicalPages = pageNum;

                if (jobInfo.PhysicalPages == 0)
                {
                    this.Reason.Add("PhysicalPages is not a num");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractLogicalPages, out stringOut) == true)
            {
                int pageNum = 0;

                if (int.TryParse(stringOut, out pageNum) == false)
                {
                    this.Reason.Add("LogicalPages is not a num");
                    return;
                }

                jobInfo.LogicalPages = pageNum;

                if (jobInfo.LogicalPages == 0)
                {
                    this.Reason.Add("LogicalPages is not a num");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractCopies, out stringOut) == true)
            {
                int copiesNum = 0;

                if (int.TryParse(stringOut, out copiesNum) == false)
                {
                    this.Reason.Add("copies is not a num");
                    return;
                }

                jobInfo.Copies = copiesNum;
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractNup, out stringOut) == true)
            {
                int nupNum = 0;

                if (int.TryParse(stringOut, out nupNum) == false)
                {
                    this.Reason.Add("nup is not a num");
                    return;

                }

                jobInfo.Nup = nupNum;

                if (jobInfo.Nup == 0)
                {
                    this.Reason.Add("nup  is not a num");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractOutPlex, out stringOut) == true)
            {
                switch (stringOut.ToUpper())
                {
                    case SpoolAnalyze.ValueSimplex:
                        jobInfo.OutPlex = JobInfo.DuplexType.S;
                        break;

                    case SpoolAnalyze.ValueDuplex:
                        jobInfo.OutPlex = JobInfo.DuplexType.DL;
                        break;
                    case SpoolAnalyze.ValueTumble:
                        jobInfo.OutPlex = JobInfo.DuplexType.DS;
                        break;
                    default:
                        jobInfo.OutPlex = JobInfo.DuplexType.Unknown;
                        this.Reason.Add("outPlex is null or white space");
                        break;
                }
                return;
            }
        }

        // PDF
        public void AnalyzeData(string data, BinaryWriter bw, JobInfo jobInfo, byte[] bynaryLine, List<byte[]> tempList)
        {
            string stringOut = string.Empty;
            
            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractDname, out stringOut) == true)
            {
                stringOut = this.SubstringByMulitByte(stringOut, SpoolAnalyze.ToLength);

                jobInfo.DocName = stringOut;
                jobInfo.TemporaryDocName = stringOut;

                // todo :: android 일때 여기서
                bw.Write(Encoding.Default.GetBytes(string.Format(SpoolAnalyze.AcnaSetStr, stringOut)));
                bw.Write(tempList[1]);
                bw.Write(bynaryLine);
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractUserId, out stringOut) == true)
            {
                bw.Write(bynaryLine);

                jobInfo.UserId = stringOut;

                if (string.IsNullOrWhiteSpace(jobInfo.UserId))
                {
                    this.Reason.Add("userId is null or white space");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractSetDocName, out stringOut) == true)
            {
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractDocName, out stringOut) == true)
            {
                int extensionLoc = 0;
                string lowerDocName = stringOut.ToLower();
                if (lowerDocName.Contains(SpoolAnalyze.ExtensionPdf) == true)
                {
                    extensionLoc = lowerDocName.LastIndexOf(SpoolAnalyze.ExtensionPdf) + SpoolAnalyze.ExtensionPdf.Length;
                    stringOut = stringOut.Substring(0, extensionLoc);
                }

                jobInfo.DocName = stringOut;

                if (string.IsNullOrWhiteSpace(jobInfo.DocName))
                {
                    this.Reason.Add("docName is null or white space");
                    return;
                }

                stringOut = this.SubstringByMulitByte(stringOut, SpoolAnalyze.ToLength);

                tempList.Add(Encoding.Default.GetBytes(string.Format(SpoolAnalyze.AcnaSetStr, stringOut)));
                tempList.Add(bynaryLine);
                return;
            }


            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractEnterLanguage, out stringOut) == true)
            {
                // todo :: ios 일때 여기서
                if (string.IsNullOrEmpty(jobInfo.TemporaryDocName) == true)
                {
                    bw.Write(tempList[0]);
                    bw.Write(tempList[1]);
                }

                jobInfo.EnterLanguage = stringOut;

                bw.Write(bynaryLine);
                return;
            }


            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractColorMode, out stringOut) == true)
            {
                switch (stringOut.ToUpper())
                {
                    case SpoolAnalyze.ValueColor:
                        jobInfo.ColorMode = JobInfo.ColorType.C;
                        break;

                    case SpoolAnalyze.ValueGrayScale:
                        jobInfo.ColorMode = JobInfo.ColorType.B;
                        break;
                    default:
                        jobInfo.ColorMode = JobInfo.ColorType.Unknown;
                        this.Reason.Add("colorMode is null or white space");
                        break;
                }
                bw.Write(bynaryLine);
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractPhysicalPages, out stringOut) == true)
            {
                bw.Write(bynaryLine);

                int pageNum = 0;

                if (int.TryParse(stringOut, out pageNum) == false)
                {
                    this.Reason.Add("pageCount is not a num");
                    return;
                }

                jobInfo.PageCount = pageNum;

                if (jobInfo.PageCount == 0)
                {
                    this.Reason.Add("pageCount is not a num");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractCopies, out stringOut) == true)
            {
                bw.Write(bynaryLine);

                int copiesNum = 0;

                if (int.TryParse(stringOut, out copiesNum) == false)
                {
                    this.Reason.Add("copies is not a num");
                    return;
                }

                jobInfo.Copies = copiesNum;
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractNup, out stringOut) == true)
            {
                bw.Write(bynaryLine);

                int nupNum = 0;

                if (int.TryParse(stringOut, out nupNum) == false)
                {
                    this.Reason.Add("nup is not a num");
                    return;

                }

                jobInfo.Nup = nupNum;

                if (jobInfo.Nup == 0)
                {
                    this.Reason.Add("nup  is not a num");
                }
                return;
            }

            if (this.TryExtractValue(data, SpoolAnalyze.RegexExtractOutPlex, out stringOut) == true)
            {
                bw.Write(bynaryLine);

                switch (stringOut.ToUpper())
                {
                    case SpoolAnalyze.ValueSimplex:
                        jobInfo.OutPlex = JobInfo.DuplexType.S;
                        break;

                    case SpoolAnalyze.ValueDuplex:
                        jobInfo.OutPlex = JobInfo.DuplexType.DL;
                        break;
                    case SpoolAnalyze.ValueTumble:
                        jobInfo.OutPlex = JobInfo.DuplexType.DS;
                        break;
                    default:
                        jobInfo.OutPlex = JobInfo.DuplexType.Unknown;
                        this.Reason.Add("outPlex is null or white space");
                        break;
                }
                return;
            }
            bw.Write(bynaryLine);
        }


        public string SubstringByMulitByte(string value, int toLength)
        {
            double length = 0;

            for (int i = 0 ; i < value.Length ; i++)
            {
                char c = value[i];
                length += (Char.GetUnicodeCategory(c) == System.Globalization.UnicodeCategory.OtherLetter) ? 2 : 1;

                if (length > toLength)
                {
                    value = value.Substring(0, i);
                }
            }
            return value;
            
        }


        public bool TryExtractValue(string input, string pattern, out string value)
        {
            Match match = Regex.Match(input, pattern);

            if (match == null || match.Success == false || match.Groups == null || match.Groups.Count < 2 || match.Groups[1] == null)
            {
                value = string.Empty;
                return false;
            }

            value = match.Groups[1].Value.Trim();
            return true;
        }


        static readonly int[] Empty = new int[0];

        public int[] Locate(byte[] readData, byte[] compareData)
        {
            if (this.IsEmptyLocate(readData, compareData))
            {
                return Empty;
            }

            var list = new List<int>();

            for (int i = 0 ; i < readData.Length ; i++)
            {
                if (!this.IsMatch(readData, i, compareData))
                {
                    continue;
                }

                list.Add(i);
            }
            return list.Count == 0 ? Empty : list.ToArray();
        }


        public bool IsEmptyLocate(byte[] readData, byte[] compareData)
        {
            return readData == null
                || compareData == null
                || readData.Length == 0
                || compareData.Length == 0
                || compareData.Length > readData.Length;
        }


        public bool IsMatch(byte[] readData, int position, byte[] compareData)
        {
            if (compareData.Length > (readData.Length - position))
                return false;

            for (int i = 0 ; i < compareData.Length ; i++)
            {
                if (readData[position + i] != compareData[i])
                {
                    return false;
                }
            }
            return true;
        }

        
        public bool MakeXML(string spoolFile, string xmlFile)
        {
            try
            {
                bool isStart = false;

                if (File.Exists(xmlFile))
                {
                    File.Delete(xmlFile);
                }

                List<byte> listByte = new List<byte>();
                string dataString = string.Empty;
                using (FileStream fsLoad = new FileStream(spoolFile, FileMode.Open, FileAccess.Read))
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        using (FileStream fsSave = new FileStream(xmlFile, FileMode.CreateNew, FileAccess.Write))
                        {
                            using (BinaryWriter bw = new BinaryWriter(fsSave))
                            {
                                do
                                {
                                    byte data = br.ReadByte();
                                    listByte.Add(data);

                                    if (data == 0x0a)
                                    {
                                        byte[] dataByte = listByte.ToArray();
                                        dataString = Encoding.UTF8.GetString(dataByte);

                                        listByte.Clear();

                                        if (isStart == false && dataString.Contains("<?xml version"))
                                        {
                                            bw.Write(dataByte);
                                            bw.Flush();
                                            isStart = true;
                                        }
                                        else if (isStart == true)
                                        {
                                            if (dataString.Contains("%PDF"))
                                            {
                                                break;
                                            }
                                            bw.Write(dataByte);
                                            bw.Flush();
                                        }
                                    }
                                } while (fsLoad.Position < fsLoad.Length);
                            }

                        }
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.TargetSite);
                return false;
            }
        }


        /// <summary>
        /// 노드의 텍스트 GET
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="childNode">자식 노드</param>
        /// <returns></returns>
        public string GetNode(XmlDocument document, string parentNode, string childNode)
        {
            XmlNodeList nodeList = document.SelectNodes(parentNode);
            XmlNode selectNode = nodeList[0].SelectSingleNode(childNode);
            if (selectNode == null)
            {
                return string.Empty;
            }

            return selectNode.InnerText;
        }


        public bool DBInsert(JobInfo data, ReceiveSpoolInfo spool)
        {
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

            for (int i = 0; i < ReceiveServiceMobile.Environment.Mobile.InsertAttemptCount; i++)
            {
                try
                {
                    using (SqlConnection conn = ReceiveServiceMobile.Environment.Database.CreateSqlConnection(SpoolAnalyze.SecretKeyForAES256))
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
                            command.Parameters.AddWithValue("@serverIdx", ReceiveServiceMobile.Environment.PostScheduler.ServerIndex);

                            if (command.ExecuteNonQuery() == 1)
                            {
                                return true;
                            }
                        }
                    }

                    Thread.Sleep(ReceiveServiceMobile.Environment.Mobile.InsertTimeoutMS);
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