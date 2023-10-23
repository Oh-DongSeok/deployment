namespace FXKIS.SmartWhere.PostSchedule
{
    using Common.Extension;
    using CommonIF;
    using CSIF;
    using FXKIS.SmartWhere.DBBridge;

    using log4net;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.Security;
    using System.Net.Sockets;
    using System.Security.Authentication;
    using System.Security.Cryptography.X509Certificates;
    using System.Threading;
    using System.Threading.Tasks;

    public class CSHttpProcess
    {
        #region Constants

        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";
        private const string SecretKeyForSSL    = "!!SmartWhere_PostProcessScheduler__##__developed_by_FXKIS_SEC_chosm!!";

        #endregion Constants

        #region Constants :: Certificate
        private const string FileNameCertificate = @"PostSchedule.pfx";
        #endregion Constants :: Certificate

        #region Properties :: Collections

        private ConcurrentQueue<TcpClient>               QueueClient  { get; set; }
        private ConcurrentQueue<PrintJobFileInformation> QueueJobFile { get; set; }

        #endregion Properties :: Collections



        #region Properties

        private SmartWhereEnvironment   Environment  { get; set; }
        private JsonSerializerSettings  JsonSettings { get; set; }
        private CancellationTokenSource CancelToken  { get; set; }

        #endregion Properties

        #region Properties :: Secure Socket Certificate

        private X509Certificate2 Certificate { get; set; }

        #endregion Properties :: Secure Socket Certificate

        #region Variables :: Service Control

        public CSRequestProcessor RequestProcessor { get; set; }

        #endregion Variables :: Service Control



        #region Variables :: Logger (Log4net)

        public static readonly ILog Logger = LogManager.GetLogger(typeof(CSHttpProcess));

        #endregion Variables :: Logger (Log4net)



        #region Constructors

        public CSHttpProcess (ConcurrentQueue<TcpClient> queueClient, ConcurrentQueue<PrintJobFileInformation> queueJobFile, SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.QueueClient  = queueClient;
            this.QueueJobFile = queueJobFile;
            this.Environment  = env;

            this.InitJsonSettings();
        }

        #endregion Constructors



        #region Event Handler Methods

        private void RequestProcessor_PrintExecuted (object sender, PrintEventArgs e)
        {
            try
            {
                if (e == null)
                {
                    return;
                }

                foreach (PrintJobFileInformation jobFile in e.ListJobFile)
                {
                    this.QueueJobFile.Enqueue(jobFile);

                    Logger.DebugFormat("PrintJob File Enqueue (PATH: {0}, DRIVER: {1})", jobFile.Path, jobFile.Driver);
                }

                this.UpdateJobStatus(e.ListSavedUUID);
            }
            catch { }
        }

        #endregion Event Handler Methods



        #region Methods :: Initialize

        private void InitJsonSettings ()
        {
            this.JsonSettings = new JsonSerializerSettings()
            {
                NullValueHandling     = NullValueHandling.Ignore,
                MissingMemberHandling = MissingMemberHandling.Error
            };

            this.JsonSettings.Converters.Add(new StringEnumConverter());
        }

        private void InitCertificate()
        {
            string certPW = CryptographyEx.AESDecrypt256FromBase64(this.Environment.PostScheduler.EncryptedCertificatePassword, CSHttpProcess.SecretKeyForSSL);

            string certPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, CSHttpProcess.FileNameCertificate);

            Logger.DebugFormat("Certificate path - {0}", certPath);

            this.Certificate = new X509Certificate2(certPath, certPW);
        }

        #endregion Methods :: Initalize



        #region Methods

        public async Task StartAsync (CancellationTokenSource token)
        {
            this.CancelToken = token;

            this.RequestProcessor = new CSRequestProcessor(this.Environment);
            this.RequestProcessor.PrintExecuted += RequestProcessor_PrintExecuted;

            ////////////////////////////////////////////////////////////////////////////////
            this.InitCertificate();

 			Logger.DebugFormat("Certificate Setting Success (FILE_NAME: {0})", CSHttpProcess.FileNameCertificate);


            TcpClient client = null;

            while (this.CancelToken.IsCancellationRequested == false)
            {
                await Task.Delay(1);

                if (this.QueueClient.IsEmpty == true)
                {
                    continue;
                }

                if (this.QueueClient.TryDequeue(out client) == false)
                {
                    continue;
                }

                Logger.DebugFormat("Connection Dequeue :: ({0})", CSHttpServer.GetClientInfoString(client));

                try
                {
                    Task task = Task.Run(() => this.ProcessRequest(client));

                    bool complete = task.Wait(this.Environment.PostScheduler.ReadTimeoutMS);

                    if (complete == false)
                    {
                        throw new TimeoutException(string.Format("Timed-out during Request Processing ({0})", CSHttpServer.GetClientInfoString(client)));
                    }
                }
                catch (ThreadAbortException)
                {
                    throw;
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Interact Client (MFD)"), ex);
                }
            }
        }
        
        private void ProcessRequest (TcpClient client)
        {
            if (client == null)
            {
                throw new ArgumentNullException("TcpClient client");
            }

            NetworkStream   stream       = null;
            SslStream       sslStream    = null;
            BufferedStream  streamInput  = null;
            StreamWriter    streamOutput = null;
            HttpRequestInfo http         = null;
            CSMessage       message      = null;

            try
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                stream = client.GetStream();

                sslStream = new SslStream(stream, false, CSHttpProcess.ValidateServerCertificate, null);

                sslStream.AuthenticateAsServer(this.Certificate, false, SslProtocols.Tls, true);

                sslStream.ReadTimeout = this.Environment.PostScheduler.ReadTimeoutMS;

                streamInput  = new BufferedStream (sslStream);
                streamOutput = new StreamWriter   (sslStream)
                {
                    AutoFlush = true
                };

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                http = HttpRequestInfo.Parse(streamInput);

                if (http == null)
                {
                    throw new InvalidDataException("HTTP Request data is empty or invalid.");
                }

                if (http.Method != HttpRequestInfo.MethodType.Post)
                {
                    throw new NotSupportedException(string.Format("HTTP-Request's Method type is invalid. Supported only POST (METHOD: {0})", http.Method.ToString()));
                }

                if (http.ContentLength < 1 || string.IsNullOrWhiteSpace(http.Content) == true)
                {
                    throw new InvalidDataException("HTTP Request's contents is empty.");
                }

                if (string.IsNullOrWhiteSpace(http.JobTicket) == true)
                {
                    Logger.WarnFormat("FX-Access-Ticket(MFD JobTicket) is not exists in HTTP Request's Header. (URL: {0})", http.Url);
                }

                if (CSMessage.TryParseRequest(http.Url, http.Content, out message) == false)
                {
                    throw new InvalidDataException(string.Format("HTTP Request's content is invalid.\n- URL: {0}\n- CONTENT:\n{1}", http.Url, http.Content));
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                Logger.InfoFormat("REQUEST \"{0}\" ({1})\n{2}", message.Type, CSHttpServer.GetClientInfoString(client), SerializationEx.ObjectToJson(message.Request));

                if (string.IsNullOrWhiteSpace(http.JobTicket) == false)
                {
                    Logger.DebugFormat("REQUEST \"{0}\" ({1}) - JOB_TICKET :: {2}", message.Type, CSHttpServer.GetClientInfoString(client), http.JobTicket);
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                this.RequestProcessor.Process(message, http.JobTicket);

                streamOutput.WriteHttpSuccess(SerializationEx.ObjectToJson(message.Response));

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////

                Logger.InfoFormat("RESPONSE \"{0}\" ({1})\n{2}", message.Type, CSHttpServer.GetClientInfoString(client), SerializationEx.ObjectToJson(message.Response));
            }
            catch (SocketException sckEx)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Interact Client (MFD)"), sckEx);
            }
            catch (ThreadAbortException taex)
            {
                try
                {
                    streamOutput.WriteHttpFailure();
                }
                catch (Exception writeEx)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Write HTTP Failure Message"), writeEx);
                }

                throw taex;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Interact Client (MFD)"), ex);

                try
                {
                    streamOutput.WriteHttpFailure();
                }
                catch (Exception writeEx)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Write HTTP Failure Message"), writeEx);
                }
            }
            finally
            {
                // NOTE :: 각기의 Stream를 닫는 중에 예외가 발생하는 상황에 대한 대응 코드 :: try-catch(empty)
                try
                {
                    if (streamInput != null)
                    {
                        streamInput.Close();
                    }
                }
                catch { }

                try
                {
                    if (streamOutput != null)
                    {
                        streamOutput.Close();
                    }
                }
                catch { }

                try
                {
                    if (sslStream != null)
                    {
                        sslStream.Close();
                    }
                }
                catch { }

                try
                {
                    if (stream != null)
                    {
                        stream.Close();
                    }
                }
                catch { }
            }
        }
        
        private bool UpdateJobStatus (IEnumerable<string> listUUID)
        {
            if (listUUID.Count() < 1)
            {
                return false;
            }

            string strUUIDs = string.Join(",", listUUID.ToList<string>()).Trim();

            if (string.IsNullOrEmpty(strUUIDs) == true)
            {
                return false;
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            try
            {
                BridgeRequest request = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, StoredProcedure.UpdateJobStatus.Name);

                request.AddParameter(new BridgeParameterInfo(StoredProcedure.UpdateJobStatus.InputCommaString, BridgeParameterInfo.ParameterType.Input) { Value = strUUIDs });

                using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
                {
                    BridgeResponse response = requestor.RequestToResponse(request, CSHttpProcess.SecretKeyForAES256);

                    if (response == null || response.Status != BridgeResponse.StatusType.Success)
                    {
                        return false;
                    }

                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        #endregion Methods

        #region Static Metods

        public static bool ValidateServerCertificate(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
        {
            if (sslPolicyErrors == SslPolicyErrors.None)
            {
                return true;
            }
            // refs: https://stackoverflow.com/questions/26930398/sslstream-authenticateasserver-with-optional-clientcertificate
            if (sslPolicyErrors == SslPolicyErrors.RemoteCertificateNotAvailable)
            {
                // seems to be okay for you
                return true;
            }
            Logger.ErrorFormat("Certificate error: {0}", sslPolicyErrors);
            return false;
        }
        #endregion Static Metods
    }
}
