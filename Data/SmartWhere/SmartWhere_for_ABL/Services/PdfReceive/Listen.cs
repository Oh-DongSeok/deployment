namespace FXKIS.SmartWhere.PdfReceive
{
    using FXKIS.Common.Extension;
    using FXKIS.SmartWhere.DBBridge;
    using iTextSharp.text.pdf;
    using log4net;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Runtime.InteropServices;
    using System.Threading;

    public class Listen
    {
        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        private const string VeryPdfLicense = "-$ \"VERYPDF-PDF2ANY-2017032287\"";

        public const string TempDirectory = "TempSpool";
        public const string Uri           = @"http://{0}:{1}/";

        public event EventHandler<EventArgs> ListenFailed;

        public static ManualResetEvent                     ClientConnected    = new ManualResetEvent(false);
        public static ConcurrentQueue<ReceiveClientThread> ManageQueue        = new ConcurrentQueue<ReceiveClientThread>();
        public static ConcurrentQueue<ReceiveClientThread> ReceiveClientQueue = new ConcurrentQueue<ReceiveClientThread>();
        public static ConcurrentQueue<MakeSpool>           MakeSpoolQueue     = new ConcurrentQueue<MakeSpool>();

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Listen));

        // 지원할 PDF VERSION
        public static readonly char[] PdfSupportVersions = { '3', '4', '5', '6' };

        public enum FailCode
        {
            InternalProcess,
            RequestUserIdDoseNotExist,
            UserInformationCanNotBeObtained,
            DifferentIF,
            DBConnect,
            DB,
            DataLengthIsIncorrect,
            IsNotPdfFile,
            IsNotSupportedVersion,
            OptionIsOutOfSpec,
            NumberOfFilesIncorrect,
            Unknown = 999
        }
       
        private HttpListener        Listener { get; set; }
        private HttpListenerContext Context { get; set; }

        public Listen()
        {
            this.Listener = null;
            this.Context  = null;
        }


        public void Start()
        {
            Thread threadManageMemory  = null;
            Thread threadReceiveClient = null;
            Thread threadManageClient  = null;
            Thread threadMakeSpool     = null;
            try
            {
                threadManageMemory = new Thread(this.ManageMemory);
                threadManageMemory.Start();

                threadReceiveClient = new Thread(this.ReceiveClient);
                threadReceiveClient.Start();

                threadManageClient = new Thread(this.ManageClient);
                threadManageClient.Start();

                threadMakeSpool = new Thread(this.ManageMakeSpool);
                threadMakeSpool.Start();

                string http = string.Format(Listen.Uri, PdfReceiveService.PdfEnvironment.HttpHost, PdfReceiveService.PdfEnvironment.HttpPort);

                Logger.InfoFormat("TRY TO LISTEN {0}", http);

                // HTTP Listener Initialize & Start
                bool isSuccess = this.TryHttpListen(http);

                if (isSuccess == false)
                {
                    return;
                }

                Logger.InfoFormat("STANDBY PORT {0}", http);

                while (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    Thread.Sleep(1);

                    this.DoBeginAcceptClient(this.Listener);
                }
            }
            catch (ThreadAbortException)
            {
                try
                {
                    this.Listener.Stop();
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }

                try
                {
                    threadManageMemory.Abort();

                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }


                try
                {
                    threadReceiveClient.Abort();
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }

                try
                {
                    threadManageClient.Abort();
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }

                try
                {
                    threadMakeSpool.Abort();
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(ex);
            }
            finally
            {
                try
                {
                    this.Listener.Close();
                }
                catch (Exception ex)
                {
                    Logger.Warn(ex);
                }
            }
        }

        private bool TryHttpListen (string http)
        {
            if (string.IsNullOrWhiteSpace(http) == true)
            {
                throw new ArgumentNullException("string http");
            }

            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new HttpListener();

                    this.Listener.Prefixes.Add(http);

                    // Normal Listen Start
                    this.Listener.Start();
                    break;
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Try to Start HttpListener"), ex);

                    //  IF exception occured, THEN retry
                    retryCount++;

                    this.Listener = null;

                    if (retryCount < PdfReceiveService.PdfEnvironment.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, PdfReceiveService.PdfEnvironment.HttpPort);

                        Thread.Sleep(PdfReceiveService.PdfEnvironment.ListenRetryIntervalMS);

                        continue;
                    }
                    
                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", PdfReceiveService.PdfEnvironment.HttpPort);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (PdfReceiveService.CancelSource.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", PdfReceiveService.PdfEnvironment.HttpPort, retryCount);

            return true;
        }

        public void DoBeginAcceptClient(HttpListener listener)
        {
            Listen.ClientConnected.Reset();

            listener.BeginGetContext(new AsyncCallback(DoAcceptClientCallback), listener);

            // 기존 :: Listen.ClientConnected.WaitOne(PdfReceiveService.PdfEnvironment.WaitTimeoutMS); -> System.Threading.OverlappedData (async await)로 많은 메모리 단편화
            // https://stackoverflow.com/questions/17137304/much-memory-fragmentation-with-system-threading-overlappeddata-async-await 
            Listen.ClientConnected.WaitOne();
        }

        public void DoAcceptClientCallback(IAsyncResult ar)
        {
            try
            {
                if (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    HttpListener listener = (HttpListener)ar.AsyncState;
                  
                    HttpListenerContext context = listener.EndGetContext(ar);

                    ReceiveClientThread threadRecv = new ReceiveClientThread(context);

                    Listen.ReceiveClientQueue.Enqueue(threadRecv);

                    Listen.ClientConnected.Set();
                }
            }
            catch (ObjectDisposedException) { }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }


        /// <summary>
        /// 비동기 listen
        /// </summary>
        public void ReceiveClient()
        {
            try
            {
                while (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(100);

                        if (Listen.ReceiveClientQueue.Count < 1)
                        {
                            continue;
                        }


                        if (Listen.ManageQueue.Count > PdfReceiveService.PdfEnvironment.LimitClientCnt)
                        {
                            continue;
                        }

                        ReceiveClientThread receiveClient = null;

                        bool isDequeue = Listen.ReceiveClientQueue.TryDequeue(out receiveClient);

                        if (isDequeue == false)
                        {
                            continue;
                        }

                        Thread clientThread = new Thread(new ParameterizedThreadStart(this.ProcessHttpListener));
                        receiveClient.Start(clientThread);

                        Listen.ManageQueue.Enqueue(receiveClient);
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex);
                    }

                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.Warn(taex);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }


        public void ProcessHttpListener(object obj)
        {
            ReceiveClientThread receiveClient = (ReceiveClientThread)obj;
            try
            {
                HttpListenerRequest request = receiveClient.Context.Request;

                using (HttpListenerResponse response = receiveClient.Context.Response)
                {
                    string ip = request.RemoteEndPoint.Address.ToString();

                    Logger.DebugFormat("Receive Request START");

                    string requestString = string.Empty;

                    using (Stream stream = request.InputStream)
                    {
                        if (stream == null)
                        {
                            throw new ArgumentNullException("request.InputStream");
                        }

                        using (StreamReader sr = new StreamReader(stream))
                        {
                            requestString = sr.ReadToEnd();
                        }
                    }
                    

                    DataForm.Request requestObj = SerializationEx.JsonToObject<DataForm.Request>(requestString);

                    Logger.DebugFormat("REQUEST => keyword :{0}\tuserId :{1}\tfileCount :{2}", requestObj.Keyword, requestObj.UserId, requestObj.FileCount);

                    Logger.DebugFormat("Receive Request FINISH");


                    Logger.DebugFormat("Request processing START");

                    DataForm.ResponseBase responseObj = this.ProcessRequest(requestString, requestObj, receiveClient.ThreadStartTime, ip);

                    Logger.DebugFormat("Request processing FINISH");

                    Logger.DebugFormat("RESPONSE =>\n {0}", SerializationEx.ObjectToJson(responseObj));

                    Logger.DebugFormat("Send Response START");
                    bool isSuccess = this.Response(response, responseObj);
                    if (isSuccess == false)
                    {
                        Logger.DebugFormat("Send Response FAIL");
                    }
                    else
                    {
                        Logger.DebugFormat("Send Response SUCCESS");
                    }

                    Logger.DebugFormat("Send Response FINISH");
                }
            }
            catch (Exception ex)
            {
                receiveClient.Abort();
                Logger.Error(ex);
            }
        }

        public DataForm.ErrorResponse CheckRequestData(DataForm.Request requestJson)
        {
            Listen.FailCode fail;

            string failMessage = string.Empty;
            switch (requestJson.Keyword)
            {
                case DataForm.Request.KeywordString.count:
                    {
                        if (string.IsNullOrWhiteSpace(requestJson.UserId) == true)
                        {
                            fail = FailCode.Unknown;
                            failMessage = "The userId entry in the request is empty.";
                            return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, failMessage);
                        }

                        if (string.IsNullOrWhiteSpace(requestJson.ServerId) == true)
                        {
                            fail = FailCode.Unknown;
                            failMessage = "The serverId entry in the request is empty.";
                            return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, failMessage);
                        }
                    }
                    break;

                case DataForm.Request.KeywordString.filedata:
                    {
                        if (string.IsNullOrWhiteSpace(requestJson.UserId) == true)
                        {
                            fail = FailCode.Unknown;
                            failMessage = "The userId entry in the request is empty.";
                            return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, failMessage);
                        }
                        
                        if (requestJson.FileCount < 1)
                        {
                            fail = FailCode.DifferentIF;
                            failMessage = "FileCount in the request is not correct.";
                            return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, failMessage);
                        }

                        if (requestJson.FileCount != requestJson.FileList.Count)
                        {
                            fail = FailCode.NumberOfFilesIncorrect;
                            return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword);
                        }
                    }
                    break;

                default:
                    {
                        fail = FailCode.DifferentIF;
                        failMessage = "The request has a different keyword from the specification.";
                        return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, failMessage);
                    }
            }
            return null;
        }


        public DataForm.ResponseBase ProcessRequest(string requestString, DataForm.Request requestJson, DateTime rcdTime, string userIp)
        {
            Listen.FailCode fail;
            try
            {
                DataForm.ErrorResponse error = this.CheckRequestData(requestJson);
                if (error != null)
                {
                    return error;
                }

                switch (requestJson.Keyword)
                {
                    // 사용량 및 사용가능량 정보요청에 따른 응답 내용에 대해 설명합니다.
                    case DataForm.Request.KeywordString.count:
                        {
                            // todo :: db연결 후 응답내용 response
                            return this.DbBridge(requestJson);
                        }

                    // 출력 요청할 PDF파일의 정보와 Print Option을 Print Server로 전달하는 Interface에 대해 설명합니다.
                    case DataForm.Request.KeywordString.filedata:
                        {
                            foreach (DataForm.FileList data in requestJson.FileList)
                            {
                                FileInfo file = null;
                                try
                                {
                                    string spoolDirectory = Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, PdfReceiveService.Environment.Common.PathSpoolDirectory, userIp);

                                    DirectoryInfo dirInfo = new DirectoryInfo(spoolDirectory);
                                    if (dirInfo.Exists == false)
                                    {
                                        dirInfo.Create();
                                    }
                                    string uuid = Guid.NewGuid().ToString();

                                    string onlyFileName = Path.GetFileNameWithoutExtension(data.FileName);
                                    string pdfPath = Path.Combine(spoolDirectory, onlyFileName + "_" + uuid + ".pdf");
                                    
                                    file = new FileInfo(pdfPath);
                                    if(File.Exists(file.FullName) == true)
                                    {
                                        File.Delete(file.FullName);
                                    }
                                    
                                    int totalPages;

                                    DataForm.ErrorResponse errorResponse = this.SavePdf(file, data, requestJson, out totalPages);

                                    if (errorResponse != null)
                                    {
                                        return errorResponse;
                                    }

                                    JobInfo jobInfo = new JobInfo()
                                    {
                                        SpoolName = onlyFileName + "_" + uuid,
                                        DocName   = data.FileName,
                                        UserId    = requestJson.UserId,
                                        PageCount = totalPages,
                                        Copies    = data.Copies,
                                        Nup       = data.NumberUp,
                                        RcdTime   = rcdTime,
                                        UserIp    = userIp.ToString(),
                                        Uuid      = uuid
                                    };

                                    switch (data.ColorEffectsType)
                                    {
                                        case DataForm.FileList.ColorEffects.Grayscale:

                                            jobInfo.ColorMode = JobInfo.ColorType.B;
                                            break;

                                        case DataForm.FileList.ColorEffects.Color:

                                            jobInfo.ColorMode = JobInfo.ColorType.C;
                                            break;
                                    }

                                    switch (data.Sides)
                                    {
                                        case DataForm.FileList.SideType.OneSided:

                                            jobInfo.OutPlex = JobInfo.DuplexType.S;
                                            break;

                                        case DataForm.FileList.SideType.TwoSidedLongEdge:

                                            jobInfo.OutPlex = JobInfo.DuplexType.DL;
                                            break;

                                        case DataForm.FileList.SideType.TwoSidedShortEdge:

                                            jobInfo.OutPlex = JobInfo.DuplexType.DS;
                                            break;
                                    }

                                    MakeSpool makeSpool = new MakeSpool(jobInfo);

                                    Listen.MakeSpoolQueue.Enqueue(makeSpool);
                                }
                                catch (Exception ex)
                                {
                                    try
                                    {
                                        if(File.Exists(file.FullName) == true)
                                        {
                                            Logger.DebugFormat("Move to Errorspool directory : {0}", file.Name);
                                            PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(file.FullName);
                                        }
                                    }
                                    catch (Exception exx)
                                    {
                                        Logger.Error(exx);
                                    }

                                    fail = FailCode.Unknown;
                                    return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, ex.Message);
                                }
                            }

                            // 완료 response
                            return new DataForm.FiledataResponse(requestJson.Keyword, requestJson.UserId, DataForm.ResponseBase.StatusType.success);
                        }

                    default:
                        fail = FailCode.DifferentIF;
                        return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword);
                }
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                fail = FailCode.Unknown;
                return this.MakeErrResponse(fail, requestJson.UserId, requestJson.Keyword, ex.Message);
            }
        }


        public DataForm.ResponseBase DbBridge(DataForm.Request requestJson)
        {
            try
            {
                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, ProcessorUtility.GetUsagePrnCnt.Name);

                /////////////////////////////////////////////////////////
                // PART of QUERY (userID/deviceIP -> UsageInformation)
                /////////////////////////////////////////////////////////

                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.InputUserID,          BridgeParameterInfo.ParameterType.Input) { Value = requestJson.UserId });
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.InputDeviceIP,        BridgeParameterInfo.ParameterType.Input) { Value = string.Empty });
                                                                                                                         
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputUserID,         BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputPrnCount,       BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputFunctionCtrl,   BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputUsedColor,      BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputUsedGray,       BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputLimitColor,     BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputLimitGray,      BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputOverCountPrint, BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputStatus,         BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(ProcessorUtility.GetUsagePrnCnt.OutputResultMsg,      BridgeParameterInfo.ParameterType.Output));

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                try
                {
                    using (BridgeRequestor requestor = new BridgeRequestor(PdfReceiveService.PdfEnvironment.DBBridgeHost, PdfReceiveService.PdfEnvironment.DBBridgePort))
                    {
                        BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, Listen.SecretKeyForAES256);

                        if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                        {
                            return this.MakeErrResponse(FailCode.DB, requestJson.UserId, requestJson.Keyword);
                        }

                        if (responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputUserID] == null)
                        {
                            return this.MakeErrResponse(FailCode.RequestUserIdDoseNotExist, requestJson.UserId, requestJson.Keyword);
                        }


                        if (responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputUsedGray] == null || responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputUsedColor] == null)
                        {
                            return this.MakeErrResponse(FailCode.UserInformationCanNotBeObtained, requestJson.UserId, requestJson.Keyword);
                        }
                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        DataForm.UserInfo userInfo = new DataForm.UserInfo()
                        {
                            LimitGray  = responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputLimitGray ].ToInteger(),
                            LimitColor = responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputLimitColor].ToInteger(),
                            UsedGray   = responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputUsedGray  ].ToInteger(),
                            UsedColor  = responseBridge.Parameters[ProcessorUtility.GetUsagePrnCnt.OutputUsedColor ].ToInteger(),
                        };

                        return new DataForm.CountResponse(requestJson.Keyword, requestJson.UserId, DataForm.ResponseBase.StatusType.success, requestJson.ServerId, userInfo);
                    }

                }
                catch (ThreadAbortException)
                {
                    throw;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);
                    return this.MakeErrResponse(FailCode.DBConnect, requestJson.UserId, requestJson.Keyword, ex.Message);
                }
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return this.MakeErrResponse(FailCode.Unknown, requestJson.UserId, requestJson.Keyword, ex.Message);
            }
        }


        public DataForm.ErrorResponse SavePdf(FileInfo file, DataForm.FileList data, DataForm.Request requestJson, out int totalPages)
        {
            totalPages = 0;
            byte[] pdfData = data.FileData;

            if (pdfData.Length != data.DataLen)
            {
                //"수신된 File Data의 Data길이가 틀린경우"
                return this.MakeErrResponse(Listen.FailCode.DataLengthIsIncorrect, requestJson.UserId, requestJson.Keyword);
            }

            string tempDirectory = Path.Combine(PdfReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, Listen.TempDirectory);
            
            if (Directory.Exists(tempDirectory) == false)
            {
                Directory.CreateDirectory(tempDirectory);
            }

            string tempOrigin = Path.Combine(tempDirectory, file.Name);
            if (File.Exists(tempOrigin) == true)
            {
                File.Delete(tempOrigin);
            }

            string tempPdf = Path.Combine(tempDirectory, "temp" + file.Name);
            if (File.Exists(tempPdf) == true)
            {
                File.Delete(tempPdf);
            }

            using (FileStream fs = new FileStream(tempOrigin, FileMode.Create))
            {
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    bw.Write(pdfData, 0, pdfData.Length);
                    bw.Flush();
                }
            }

            PdfReader pdfReader = null;
           
            try
            {
                pdfReader = new PdfReader(tempOrigin);
                
                totalPages = pdfReader.NumberOfPages;
                char pdfVersion = pdfReader.PdfVersion;

                if (Listen.PdfSupportVersions.Contains(pdfVersion) == false)
                {
                    // 수신된 File의 PDF Format이 미지원 version일 경우

                    string supporVersion = "1." + string.Join(", 1.", Listen.PdfSupportVersions);
                    string failMessage = string.Format("Support version is {0}. This version is 1.{1}", supporVersion, pdfVersion);
                    try
                    {
                        if (File.Exists(tempOrigin) == true)
                        {
                            Logger.DebugFormat("Move to Errorspool directory : {0}", tempOrigin);
                            PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(tempOrigin);
                        }
                    }
                    catch (Exception exx)
                    {
                        Logger.Error(exx);
                    }
                    return this.MakeErrResponse(Listen.FailCode.IsNotSupportedVersion, requestJson.UserId, requestJson.Keyword, failMessage);
                }
                
            }
            catch(IOException ioe)
            {
                Logger.Error(ioe);
                try
                {
                    if (File.Exists(tempOrigin) == true)
                    {
                        Logger.DebugFormat("Move to Errorspool directory : {0}", tempOrigin);
                        PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(tempOrigin);
                    }
                }
                catch (Exception exx)
                {
                    Logger.Error(exx);
                }

                return this.MakeErrResponse(Listen.FailCode.IsNotPdfFile, requestJson.UserId, requestJson.Keyword, ioe.Message);
            }
            catch (Exception ex)
            {
                // pdf 파일 헤더를 가지고 있지 않을경우
                Logger.Error(ex);
                try
                {
                    if (File.Exists(tempOrigin) == true)
                    {
                        Logger.DebugFormat("Move to Errorspool directory : {0}", tempOrigin);
                        PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(tempOrigin);
                    }
                }
                catch (Exception exx)
                {
                    Logger.Error(exx);
                }
                return this.MakeErrResponse(Listen.FailCode.Unknown, requestJson.UserId, requestJson.Keyword, ex.Message);
            }
            finally
            {
                if (pdfReader != null)
                {
                    pdfReader.Close();
                }
            }


            try
            {
                string argument = string.Format("{0} -multipage {1} {2}", Listen.VeryPdfLicense, tempOrigin, tempPdf);

                if (string.IsNullOrWhiteSpace(PdfReceiveService.PdfEnvironment.VeryPdfOption) == false)
                {
                    argument = string.Format("{0} -multipage {1} {2} {3}", Listen.VeryPdfLicense, PdfReceiveService.PdfEnvironment.VeryPdfOption, tempOrigin, tempPdf);
                }

                using (Process ps = new Process())
                {
                    string workingDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "pdf2any_win");

                    ps.StartInfo.UseShellExecute = false;
                    ps.StartInfo.FileName        = Path.Combine(workingDir, "pdf2any.exe");
                    ps.StartInfo.Arguments       = argument;
                    ps.StartInfo.WindowStyle     = ProcessWindowStyle.Hidden;
                    ps.StartInfo.CreateNoWindow  = false;

                    Logger.Debug("pdf2any.exe Start");
                    ps.Start();


                    bool isExit = ps.WaitForExit(PdfReceiveService.PdfEnvironment.ProcessTimeoutMS);

                    if (isExit == false)
                    {
                        throw new TimeoutException("pdf2any.exe TimeoutException");
                    }

                    Logger.Debug("pdf2any.exe Finish");
                }
                File.Delete(tempOrigin);

                File.Move(tempPdf, file.FullName);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                
                try
                {
                    if (File.Exists(tempOrigin) == true)
                    {
                        PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(tempOrigin);
                        Logger.DebugFormat("Move to Errorspool directory : {0}", tempOrigin);
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(e);
                }

                try
                {
                    if (File.Exists(tempPdf) == true)
                    {
                        PdfReceiveService.Environment.Common.MoveErrorSpoolDirectory(tempPdf);
                        Logger.DebugFormat("Move to Errorspool directory : {0}", tempPdf);
                    }
                }
                catch (Exception e)
                {
                    Logger.Error(e);
                }
                return this.MakeErrResponse(Listen.FailCode.Unknown, requestJson.UserId, requestJson.Keyword, ex.Message);
            }
            return null;
        }


        public DataForm.ErrorResponse MakeErrResponse(Listen.FailCode fail, string userId, DataForm.Request.KeywordString keyword, string message = "")
        {
            List<string> reason = new List<string>();

            string failMessage = string.Empty;

            DataForm.ErrorResponse errorResponse = new DataForm.ErrorResponse(keyword, userId, DataForm.ResponseBase.StatusType.fail);

            switch (fail)
            {
                case FailCode.InternalProcess:
                    {
                        failMessage = "Internal Service Error Occurred";
                    }
                    break;

                case FailCode.RequestUserIdDoseNotExist:
                    {
                        failMessage = "Unregistered user";
                    }
                    break;

                case FailCode.UserInformationCanNotBeObtained:
                    {
                        failMessage = "User registration Miss: Can not obtain usage information";
                    }
                    break;

                case FailCode.DifferentIF:
                    {
                        failMessage = "Received I/F is different from specification";
                    }
                    break;

                case FailCode.DBConnect:
                    {
                        failMessage = "DB connect error";
                    }
                    break;

                case FailCode.DB:
                    {
                        failMessage = "DB error";
                    }
                    break;

                case FailCode.DataLengthIsIncorrect:
                    {
                        failMessage = "File consistency error : data length is incorrect";
                    }
                    break;

                case FailCode.IsNotPdfFile:
                    {
                        failMessage = "File consistency error : Not a PDF file";
                    }
                    break;

                case FailCode.IsNotSupportedVersion:
                    {
                        failMessage = "File consistency error : Unsupported  version";
                    }
                    break;

                case FailCode.OptionIsOutOfSpec:
                    {
                        failMessage = "Option in received PDF is out of spec";
                    }
                    break;

                case FailCode.NumberOfFilesIncorrect:
                    {
                        failMessage = "The number of files and the number of file lists are different value";
                    }
                    break;

                case FailCode.Unknown:
                default:
                    {
                        failMessage = "Unknown error";
                    }
                    break;
            }

            reason.Add(failMessage);

            if (string.IsNullOrWhiteSpace(message) == false)
            {
                reason.Add(message);
            }

            int failCode = (int)fail;
            errorResponse.SetReson(reason, failCode.ToString("000"));

            return errorResponse;
        }


        public bool Response(HttpListenerResponse response, object responseObj)
        {
            try
            {
                string responseString = SerializationEx.ObjectToJson(responseObj);

                using (Stream output = response.OutputStream)
                {
                    using (StreamWriter sw = new StreamWriter(output))
                    {
                        sw.Write(responseString);
                        sw.Flush();
                    }
                }
                return true;
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return false;
            }
        }

        /// <summary>
        /// listen 받은 클라이언트 thread 관리
        /// </summary>
        public void ManageClient()
        {
            try
            {
                while (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (Listen.ManageQueue.Count < 1)
                        {
                            continue;
                        }

                        ReceiveClientThread receiveClient = null;
                        bool isDequeue = Listen.ManageQueue.TryDequeue(out receiveClient);
                       

                        if (isDequeue == false)
                        {
                            continue;
                        }

                        if (receiveClient.IsAlive == false)
                        {
                            continue;
                        }

                        if (receiveClient.ThreadStartTime.IsOverThanNow(0, 0, 0, PdfReceiveService.PdfEnvironment.ThreadTimeoutSec) == true)
                        {
                            receiveClient.Abort();

                            Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Client Thread Managing");
                            continue;
                        }

                        Listen.ManageQueue.Enqueue(receiveClient);

                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex);
                    }
                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.Warn(taex);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }

            int clientCnt = Listen.ManageQueue.Count;

            Logger.WarnFormat("ManageQueue Cnt : {0}", clientCnt);
            for (int i = 0 ; i < clientCnt ; i++)
            {
                ReceiveClientThread receiveClient = null;
                if(Listen.ManageQueue.TryDequeue(out receiveClient) == true)
                {
                    Thread.Sleep(1000);
                    receiveClient.Abort();
                }
            }
        }


        /// <summary>
        /// 받은 pdf파일 후작업
        /// </summary>
        public void ManageMakeSpool()
        {
            try
            {
                while (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (Listen.MakeSpoolQueue.Count < 1)
                        {
                            continue;
                        }

                        MakeSpool makeSpool = null;
                        bool isDequeue = Listen.MakeSpoolQueue.TryDequeue(out makeSpool);

                        if (isDequeue == false)
                        {
                            Logger.Info("MakeSpoolQueue.TryDequeue fail");
                            continue;
                        }

                        // MakeSpool 시작
                        makeSpool.StartJob();
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex);
                    }
                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.Warn(taex);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }

        public void ManageMemory()
        {
            try
            {
                while (PdfReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(PdfReceiveService.PdfEnvironment.MemoryReleaseIntervalMS); // 지정시간 한시간 :1000*60*60 , 십분 : 1000*60*10

                        this.FlushMemory();
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex);
                    }
                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.Warn(taex);
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
            }
        }

        public void FlushMemory ()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                Listen.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        // refs: http://itstalker.tistory.com/27
        [DllImportAttribute("kernel32.dll", EntryPoint = "SetProcessWorkingSetSize", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern int SetProcessWorkingSetSize (IntPtr process, int minimumWorkingSetSize, int maximumWorkingSetSize);
    }
}