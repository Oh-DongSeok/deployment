namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.Collections.Concurrent;
    using System.Diagnostics;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Runtime.InteropServices;
    using System.Threading;

    using log4net;

    using Common.Extension;



    public class RawListener
    {
        #region Constants

        public const int ThreadMaxTimeoutMS = 100;

        #endregion Constants



        #region Events

        public event EventHandler<EventArgs> ListenFailed;

        public static ManualResetEvent ClientConnected = new ManualResetEvent(false);

        #endregion Events



        #region Variables

        public static ConcurrentQueue<ReceiveClientInfo> ClientQueue = new ConcurrentQueue<ReceiveClientInfo>();

        public ConcurrentQueue<ClientThread> ThreadQueue  = new ConcurrentQueue<ClientThread>();
        public TcpListener                   Listener     = null;

        #endregion Variables



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(RawListener));

        #endregion Variables :: Log4net



        #region Methods

        public void Start()
        {
            Thread threadReceiveClient = null;
            Thread threadManageClient  = null;
            try
            {
                threadReceiveClient = new Thread(this.ReceiveClient);
                threadReceiveClient.Start();

                threadManageClient = new Thread(this.ManageClient);
                threadManageClient.Start();

                // TCP Listener Initialize & Start
                bool isSuccess = this.TryTcpListen();

                if (isSuccess == false)
                {
                    return;
                }

                Logger.InfoFormat("STANDBY PORT {0}", ReceiveService.Environment.Recv.PortRaw);

                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    this.DoBeginAcceptTcpClient(this.Listener);
                    Thread.Sleep(1);
                }

                this.AbortClientThread();
            }
            catch (ThreadAbortException)    //서비스 종료시 발생
            {
                try
                {
                    if (threadReceiveClient != null)
                    {
                        threadReceiveClient.Abort();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("RawListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }

                try
                {
                    if (threadManageClient != null)
                    {
                        threadManageClient.Abort();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("RawListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }

                this.AbortClientThread();
            }
            catch (Exception ex)
            {
                Logger.FatalFormat("RawListener Exception : {0}({1})", ex.Message, ex.StackTrace);
            }

            finally
            {
                try
                {
                    if (this.Listener != null)
                    {
                        this.Listener.Stop();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("RawListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }
            }
        }

        private bool TryTcpListen ()
        {
            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new TcpListener(IPAddress.Any, ReceiveService.Environment.Recv.PortRaw);

                    if (retryCount > 1)
                    {
                        this.Listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                    }

                    // Normal Listen Start
                    this.Listener.Start();
                    break;
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Try to Start TcpListener"), ex);

                    //  IF exception occured, THEN retry
                    retryCount++;

                    this.Listener = null;

                    if (retryCount < ReceiveService.Environment.Recv.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, ReceiveService.Environment.Recv.PortRaw);

                        Thread.Sleep(ReceiveService.Environment.Recv.ListenRetryIntervalMS);

                        continue;
                    }

                    ///////////////////////////////////////////////////////////////////////////

                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", ReceiveService.Environment.Recv.PortRaw);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (ReceiveService.CancelSource.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", ReceiveService.Environment.Recv.PortRaw, retryCount);

            return true;
        }

        public void AbortClientThread()
        {
            try
            {
                foreach (ClientThread clientThread in this.ThreadQueue) 
                {
                    try
                    {
                        clientThread.ClientInfo.Client.Close();
                        clientThread.ReceiveThread.Abort();
                    }
                    catch (Exception) {}
                }
            }
            catch (Exception e)
            {
                Logger.WarnFormat("RawListener Exception: {0}\n{1}", e.Message, e.StackTrace);
            }
        }

        public void DoBeginAcceptTcpClient(TcpListener listener)
        {
            try
            {
                RawListener.ClientConnected.Reset();

                listener.BeginAcceptTcpClient(new AsyncCallback(this.DoAcceptTcpClientCallback), listener);

                RawListener.ClientConnected.WaitOne(ReceiveService.Environment.Recv.ConnectTimeoutMS);
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "BeginAccept RawListener"), ex);
            }
        }

        public void DoAcceptTcpClientCallback(IAsyncResult ar)
        {
            try
            {
                if (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    TcpListener listener = (TcpListener)ar.AsyncState;

                    TcpClient client = listener.EndAcceptTcpClient(ar);

                    //if (client.Available <= 0)
                    //{
                    //    RawListener.ClientConnected.Set();
                    //    Thread.Sleep(1);
                    //    return;
                    //}

                    ReceiveClientInfo clientInfo = new ReceiveClientInfo()
                    {
                        Client      = client,
                        ReceiveTime = DateTime.Now
                    };

                    Logger.DebugFormat("RawListener: Do Accept Client");
					
                    RawListener.ClientQueue.Enqueue(clientInfo);
                    
                    RawListener.ClientConnected.Set();
                }
            }
            catch (ObjectDisposedException) { }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for RawListener");
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Accept TCP Client Callback for RawListener"), ex);
                return;
            }
        }

        public void ReceiveClient()
        {
            try
            {
                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (RawListener.ClientQueue.Count < 1)
                        {
                            continue;
                        }

                        if (this.ThreadQueue.Count >= ReceiveService.Environment.Recv.ListenThreadCount)
                        {
                            Thread.Sleep(RawListener.ThreadMaxTimeoutMS);
                            continue;
                        }

                        ReceiveClientInfo clientInfo = null;

                        bool isDequeue = RawListener.ClientQueue.TryDequeue(out clientInfo);

                        if (isDequeue == false)
                        {
                            continue;
                        }

                        ClientThread clientThread = new ClientThread(new Thread(new ParameterizedThreadStart(this.ReceiveData)), clientInfo);

                        clientThread.Start();

                        this.ThreadQueue.Enqueue(clientThread);
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.ErrorFormat("RawListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.WarnFormat("RawListener ThreadAbortException: {0}\n{1}", taex.Message, taex.StackTrace);
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("RawListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
        }

        public void ManageClient()
        {
            try
            {
                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(ReceiveService.Environment.Recv.CleanIntervalMS);

                        int nQueue = this.ThreadQueue.Count;

                        if (nQueue < 1)
                        {
                            continue;
                        }

                        for (int i = 0; i < nQueue; i++)
                        {
                            try
                            {
                                ClientThread clientThread = null;
                                bool isDequeue = this.ThreadQueue.TryDequeue(out clientThread);

                                if (isDequeue == false)
                                {
                                    continue;
                                }

                                if (clientThread.IsAlive == false)
                                {
                                    continue;
                                }

                                if (clientThread.CreateTime.IsOverThanNow(0, 0, ReceiveService.Environment.Recv.CleanTimeoutMin, 0) == true) //timeout 
                                {
                                    clientThread.ClientInfo.Client.Close();
                                    clientThread.ReceiveThread.Abort();
                                    continue;
                                }

                                this.ThreadQueue.Enqueue(clientThread);
                            }
                            catch (ThreadAbortException)
                            {
                                throw;
                            }
                            catch (Exception) { }
                        }
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.ErrorFormat("RawListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }

            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("RawListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
        }

        public void ReceiveData(object objClient)
        {
            ReceiveClientInfo clientInfo = null;

            string remoteEndPoint = string.Empty;

            FileInfo file = null;
            FileStream fs = null;
            try
            {
                clientInfo = objClient as ReceiveClientInfo;

                IPEndPoint ipEndPoint = (IPEndPoint)clientInfo.Client.Client.RemoteEndPoint;
                remoteEndPoint = ipEndPoint.Address.ToString();// 폴더명


                bool includedRoot = Path.IsPathRooted(ReceiveService.Environment.Common.PathSpoolDirectory);

                if (includedRoot == false)
                {
                    ReceiveService.Environment.Common.PathSpoolDirectory = Path.Combine(ReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveService.Environment.Common.PathSpoolDirectory);
                }

                string dirPath = Path.Combine(ReceiveService.Environment.Common.PathSpoolDirectory, remoteEndPoint);

                DirectoryInfo dirInfo = new DirectoryInfo(dirPath);
                if (dirInfo.Exists == false)
                {
                    dirInfo.Create();
                }

                string path = Path.Combine(dirPath, DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Guid.NewGuid().ToString());

                using (NetworkStream ns = clientInfo.Client.GetStream())
                {
                    ns.ReadTimeout = ReceiveService.Environment.Recv.ReadTimeoutMS;

                    using (BinaryReader br = new BinaryReader(ns))
                    {
                        using (fs = new FileStream(path, FileMode.CreateNew, FileAccess.Write))
                        {
                            using (BinaryWriter bw = new BinaryWriter(fs))
                            {
                                byte[] data = null;

                                do
                                {
                                    data = br.ReadBytes(ReceiveService.Environment.Recv.BufferSize);
                                    bw.Write(data);
                                }
                                while (data != null && data.Length > 0);

                                file = new FileInfo(fs.Name);

                                Logger.DebugFormat("RawListener File FullName :: {0}, File Length: {1}", file.FullName, file.Length);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("RawListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
                File.Delete(fs.Name);
            }
            finally
            {
                if (file == null || file.Exists == false)
                {
                    Logger.DebugFormat("존재하지 않는 파일");
                }
                else if (file.Length == 0)
                {
                    file.Delete();
                    Logger.DebugFormat("빈파일 삭제 : File name: {0} ", file.Name);
                }
                else if (file.Length > int.MaxValue)
                {
                    file.Delete();
                    Logger.DebugFormat("큰파일 삭제 : File name: {0} ", file.Name);
                }
                else
                {
                    ReceiveSpoolInfo spoolInfo = new ReceiveSpoolInfo()
                    {
                        SpoolFile        = file,
                        ClientIPAddress  = remoteEndPoint,
                        ReceiveStartTime = clientInfo.ReceiveTime,
                        ReceiveEndTime   = DateTime.Now
                    };

                    ReceiveService.SpoolQueue.Enqueue(spoolInfo);

                    Logger.DebugFormat("SpoolQueue Enqueue : {0}({1})", file.Name, file.Length);
                }
            }
        }

        public void FlushMemory ()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                RawListener.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        #endregion Methods



        #region Methods :: Win32 Native Methods

        // refs: http://itstalker.tistory.com/27
        [DllImportAttribute("kernel32.dll", EntryPoint = "SetProcessWorkingSetSize", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern int SetProcessWorkingSetSize (IntPtr process, int minimumWorkingSetSize, int maximumWorkingSetSize);

        #endregion Methods :: Win32 Native Methods
    }
}