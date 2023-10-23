namespace FXKIS.SmartWhere.PdfReceive
{
    using ABL_Environment;
    using FXKIS.Common.Environment;
    using FXKIS.Common.Extension;
    using FXKIS.SmartWhere.DBBridge;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    public class MakeSpool
    {
        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        private const string CommandString = "INSERT INTO dbo.PRNINFO(rcdTime, uuId, userId, spoolNm, docNm, printNm, totalPages, useYn, jobTime, colorMode, destColorMode, duplexMode, destDuplexMode, nup, destNup, copies, userIp, driverType, jobStatus, printValue, REMAIN_DAY) VALUES(@rcdTime, @uuId, @userId, @spoolNm, @docNm, @printNm, @totalPages, @useYn, @jobTime, @colorMode, @destColorMode, @duplexMode, @destDuplexMode, @nup, @destNup, @copies, @userIp,@driverType, @jobStatus, @printValue, @REMAIN_DAY)";


        public static readonly ILog Logger = LogManager.GetLogger(typeof(MakeSpool));


        public JobInfo JobInfo { get; set; }

        public static readonly byte[] PjlStart = { 0x1B, 0x25, 0x2D, 0x31, 0x32, 0x33, 0x34, 0x35, 0x58 };

        public MakeSpool()
        {
            this.JobInfo = null;
        }

        public MakeSpool(JobInfo jobInfo)
        {
            this.JobInfo = jobInfo;
        }

        public async Task StartJob()
        {
            try
            {
                Logger.Debug("MakeSpool START");
                PrnMetadata metadata = new PrnMetadata();
                
                PrnInformation prnInformation = new PrnInformation()
                {
                    JobTime       = this.JobInfo.RcdTime,
                    ReceivedTime  = this.JobInfo.RcdTime,
                    UUID          = this.JobInfo.Uuid,
                    UserID        = this.JobInfo.UserId,
                    SpoolName     = this.JobInfo.SpoolName,
                    DocumentName  = this.JobInfo.DocName,
                    TotalPages    = this.JobInfo.PageCount,
                    Copies        = this.JobInfo.Copies,
                    Nup           = this.JobInfo.Nup,
                    UserIPAddress = this.JobInfo.UserIp,
                    Queue         = string.Empty
                };

                metadata.SetPrnInformation(prnInformation);

                DirectoryInfo metaDi = new DirectoryInfo(Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress));

                if (metaDi.Exists == false)
                {
                    metaDi.Create();
                }

                FileObjectManagement.SaveJson(Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathMetadataDirectory, prnInformation.UserIPAddress, prnInformation.SpoolName + ".json"), metadata, true);

                Logger.Debug($"DB Insert try :: timeout({PdfReceiveService.PdfEnvironment.WaitTimeoutMS}ms)");

                // =========================================== //
                // DBInsert() Timeout 구현
                int delay = 1000;
                Task t = this.DBInsert();    // DBInsert()함수에서 false인 경우 무조건 Exception 발생시켜서 !isSuccess 경우가 없음.

                if (!t.Wait(PdfReceiveService.PdfEnvironment.WaitTimeoutMS + delay))
                {
                    throw new Exception("DB Insert Fail (timed out)");
                }

                // =========================================== //

                Logger.Debug("DB Insert Success");
                
                // makeXml
                DirectoryInfo spoolDi = new DirectoryInfo(Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathSpoolDirectory, prnInformation.UserIPAddress));

                if (spoolDi.Exists == false)
                {
                    spoolDi.Create();
                }

                string spoolPath = Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathSpoolDirectory, prnInformation.UserIPAddress, prnInformation.SpoolName);

                FileInfo fileInfo = new FileInfo(spoolPath);

                try
                {
                    using (FileStream fs = fileInfo.Create())
                    {
                        using (BinaryWriter bw = new BinaryWriter(fs))
                        {
                            this.AddPjlHeader(bw);
                            
                            this.AddXml(bw);

                            this.AddPdf(bw);

                            this.AddPjlFooter(bw);

                            bw.Flush();
                        }
                    }
                    Logger.Debug("MakeSpool SUCCESS");
                }
                catch (Exception ex)
                {
                    Logger.Debug("MakeSpool FAIL");
                    PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(fileInfo.FullName);
                    Logger.Error(ex);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }

        public async Task<bool> DBInsert()
        {
            return await Task.Run(() =>
            {
                string query =
                "INSERT INTO PRNINFO " +
                "(rcdTime," +
                " uuId," +
                " userId," +
                " spoolNm," +
                " docNm," +
                " printNm," +
                " totalPages," +
                " useYn," +
                " jobTime," +
                " colorMode," +
                " destColorMode," +
                " duplexMode," +
                " destDuplexMode," +
                " nup," +
                " destNup," +
                " copies," +
                " userIp," +
                " driverType," +
                " jobStatus," +
                " printValue," +
                " REMAIN_DAY," +
                " serverIdx)" +
                " VALUES ({0})";

                List<string> listValues = new List<string>
                {
                    this.JobInfo.RcdTime.ToString("yyyy/MM/dd HH:mm:ss.fff"),
                    this.JobInfo.Uuid,
                    this.JobInfo.UserId,
                    this.JobInfo.SpoolName,
                    this.JobInfo.DocName,
                    this.JobInfo.PrintNm,
                    this.JobInfo.PageCount.ToString(),
                    this.JobInfo.UseYn,
                    this.JobInfo.RcdTime.ToString("yyyyMMddHHmmssfff"),
                    this.JobInfo.ColorMode.ToString(),
                    this.JobInfo.ColorMode.ToString(),
                    this.JobInfo.OutPlex.ToString(),
                    this.JobInfo.OutPlex.ToString(),
                    this.JobInfo.Nup.ToString(),
                    this.JobInfo.Nup.ToString(),
                    this.JobInfo.Copies.ToString(),
                    this.JobInfo.UserIp,
                    this.JobInfo.DriverType,
                    this.JobInfo.JobStatus.ToString(),
                    this.JobInfo.PrintValue.ToString(),
                    this.JobInfo.RemainDay.ToString(),
                    PdfReceiveService.PdfEnvironment.ServerIdx.ToString()
                };

                // [ in SQL query ] 값 안에 '(quote)가 들어가는 경우
                for (int i = 0; i < listValues.Count; i++)
                {
                    listValues[i] = listValues[i].Replace("'", "''");
                }

                // [ in SQL query ] 값 안에 ,(comma)가 들어가는 경우 
                string strValue = "'" + string.Join("','", listValues) + "'";

                string queryString = string.Format(query, strValue);

                BridgeResponse response = this.RequestToResponse(BridgeRequest.RequestType.ExecuteCommand, queryString);

                if (response == null || response.Status == BridgeResponse.StatusType.Unknown)
                {
                    throw new InvalidOperationException("Operation failed");
                }

                if (response.Status == BridgeResponse.StatusType.Failure || response.AffectedRows < 1)
                {
                    throw new Exception("DB Insert Fail or No row affected");
                }

                Logger.Debug("DBInsert result true");
                return true;
            });
        }


        private BridgeResponse RequestToResponse(BridgeRequest.RequestType type, string query)
        {
            
            if (type == BridgeRequest.RequestType.Unknown)
            {
                throw new ArgumentException(string.Format("Request Type is invalid (TYPE: {0})", type.ToString()), "BridgeRequest.RequestType type");
            }

            if (string.IsNullOrWhiteSpace(query) == true)
            {
                throw new ArgumentNullException("string query");
            }

            using (BridgeRequestor requestor = new BridgeRequestor(PdfReceiveService.PdfEnvironment.DBBridgeHost, PdfReceiveService.PdfEnvironment.DBBridgePort))
            {
                BridgeRequest request = new BridgeRequest(type, query);

                Logger.DebugFormat("REQUEST => {0}:{1}\n{2}", PdfReceiveService.PdfEnvironment.DBBridgeHost, PdfReceiveService.PdfEnvironment.DBBridgePort, SerializationEx.ObjectToJson(request));

                BridgeResponse response = requestor.RequestToResponse(request, MakeSpool.SecretKeyForAES256, PdfReceiveService.PdfEnvironment.WaitTimeoutMS);

                if (response == null)
                {
                    Logger.ErrorFormat("RESPONSE is NULL <= {0}:{1}", PdfReceiveService.PdfEnvironment.DBBridgeHost, PdfReceiveService.PdfEnvironment.DBBridgePort);
                }
                else
                {
                    Logger.DebugFormat("RESPONSE <= {0}:{1}\n{2}", PdfReceiveService.PdfEnvironment.DBBridgeHost, PdfReceiveService.PdfEnvironment.DBBridgePort, SerializationEx.ObjectToJson(response));
                }

                return response;
            }
        }
        
        

        public void AddPjlHeader(BinaryWriter bw)
        {
            bw.Write(MakeSpool.PjlStart);

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.StringCodeSet));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.JobMode));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Begin));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Version));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Joau, this.JobInfo.UserId)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Joep));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Date, this.JobInfo.RcdTime.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Time, this.JobInfo.RcdTime.ToString("HH:mm:ss"))));

            string nlpp = string.Empty;

            switch (this.JobInfo.Nup)
            {
                case 1:
                    nlpp = "1";
                    break;

                case 2:
                    nlpp = "N2";
                    break;

                case 4:
                    nlpp = "N4";
                    break;
                default:
                    break;
            }

            // nup// 1//N2/N4
            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Nlpp, nlpp)));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Uacn, this.JobInfo.DocName)));

            //TODO :: 사양(별도 문자열로 고정 예정, 현재는 userId로)
            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Cnam, this.JobInfo.UserId)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Language));            
        }


        public void AddXml(BinaryWriter bw)
        {
            string pathXmlTemplate = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PdfReceiveEnvironment.XmlTemplateFileName);
            string pathXml         = Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathSpoolDirectory, this.JobInfo.UserIp, this.JobInfo.SpoolName + ".xml");

            MakeXml makeXml = new MakeXml(this.JobInfo);
            bool isSuccess = makeXml.MakeFile(pathXmlTemplate, pathXml);
            if (isSuccess == false)
            {
                if(File.Exists(pathXml) == true)
                {
                    File.Delete(pathXml);
                }
                throw new Exception("AddPjlHeaderFail");
            }

            using (FileStream fs = new FileStream(pathXml, FileMode.Open))
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    bw.Write(br.ReadBytes((int)fs.Length));
                }
            }

            File.Delete(pathXml);
        }


        public void AddPdf(BinaryWriter bw)
        {
            string pathPdf = Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathSpoolDirectory, this.JobInfo.UserIp, this.JobInfo.SpoolName + ".pdf");

            using (FileStream fs = new FileStream(pathPdf, FileMode.Open))
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    bw.Write(br.ReadBytes((int)fs.Length));
                }
            }
        }

        public void AddPjlFooter(BinaryWriter bw)
        {           
            bw.Write(MakeSpool.PjlStart);

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Version));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Begin));
            
            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PdlType));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PageCopies));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.JobCopies, this.JobInfo.Copies)));

            string duplexType = string.Empty;
            switch (this.JobInfo.OutPlex)
            {
                case JobInfo.DuplexType.S: //OneSided SIMPLEX
                    duplexType = ProcessorUtility.FxJobInfo.OneSideedValue;
                    break;
                case JobInfo.DuplexType.DL: //TwoSidedLongEdge DUPLEX
                    duplexType = ProcessorUtility.FxJobInfo.TwoSidedLongEdgeValue;
                    break;
                case JobInfo.DuplexType.DS: //TwoSidedShortEdge TUMBLE
                    duplexType = ProcessorUtility.FxJobInfo.TwoSidedShortEdgeValue;
                    break;
            }

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.DuplexType, duplexType)));

            string color = string.Empty;
            switch (this.JobInfo.ColorMode)
            {
                case JobInfo.ColorType.C:
                    color = ProcessorUtility.FxJobInfo.ColorValue;
                    break;

                case JobInfo.ColorType.B:
                    color = ProcessorUtility.FxJobInfo.GrayscaleValue;
                    break;
            }

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.ColorMode, color)));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.Nup, this.JobInfo.Nup)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PassThrough));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.End));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Eoj));
        }      
    }

    public static class MakeSpoolExtensions
    {
        public static void WriteLine(this BinaryWriter bw, byte[] binary)
        {
            if (bw == null)
            {
                throw new ArgumentNullException("this BinaryWriter bw");
            }

            if (binary == null || binary.Length < 1)
            {
                throw new ArgumentNullException("byte[] binary");
            }

            byte[] line = { 0x0d, 0x0a };

            bw.Write(binary);
            bw.Write(line);
        }
    }
}
