namespace FXKIS.SmartWhere.Analyzer_Heavy
{
    using System;
    using System.Collections.Concurrent;
    using System.Diagnostics;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Runtime.InteropServices;
    using System.Text;
    using System.Threading;

    using log4net;

    using Common.Extension;

    using CommonIF;



    public class SpoolReceiver
    {
        #region Events

        public event EventHandler<EventArgs> ListenFailed;

        public ManualResetEvent ClientConnected = new ManualResetEvent(false);

        #endregion Events



        #region Properties :: Collections

        public ConcurrentQueue<AnalyzedSpoolInfo>   QueueSpool         { get; private set; }
        public ConcurrentQueue<ReceiveClientThread> QueueManagedThread { get; private set; }

        #endregion Properties :: Collections



        #region Properties

        public  SmartWhereEnvironment Environment    { get; private set; }
        private TcpListener           Listener       { get; set; }
        public  Thread                ThreadManaging { get; private set; }
        public  CancellationToken     CancelToken    { get; private set; }

        #endregion Properties



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(SpoolReceiver));

        #endregion Variables :: Log4net



        #region Constructors

        public SpoolReceiver (SmartWhereEnvironment env, ConcurrentQueue<AnalyzedSpoolInfo> queueSpool, CancellationToken token)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (queueSpool == null)
            {
                throw new ArgumentNullException("ConcurrentQueue<FileInfo> queueSpool");
            }

            this.Environment        = env;
            this.Listener           = null;
            this.QueueManagedThread = new ConcurrentQueue<ReceiveClientThread>();
            this.QueueSpool         = queueSpool;
            this.ThreadManaging     = null;
            this.CancelToken        = token;
        }

        #endregion Constructors



        #region Methods

        public void Start (object state)
        {
            TcpListener listener = null;

            try
            {
                // Managing Thread Start
                this.ThreadManaging = new Thread(this.ManageThreads);
                this.ThreadManaging.Start();

                // TCP Listener Initialize & Start
                bool isSuccess = this.TryTcpListen();

                if (isSuccess == false)
                {
                    return;
                }

                Logger.InfoFormat("STANDBY {0} : {1}", AnalyzeService.ServiceDisplayName, this.Environment.Analyzer.PortHeavy);

                // LOOP for Accept of Client Connection
                while (this.CancelToken.IsCancellationRequested == false)
                {
                    Thread.Sleep(1);

                    this.DoBeginAcceptTcpClient(this.Listener);
                }
            }
            catch (ThreadAbortException)
            {
                if (this.ThreadManaging != null)
                {
                    this.ThreadManaging.Abort();
                }

                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "TcpListener init & listening");
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "TcpListener init & listening"), ex);
            }
            finally
            {
                try
                {
                    if (listener != null)
                    {
                        listener.Stop();
                    }
                }
                catch (Exception ex)
                {
                    Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "TcpListener stoping"), ex);
                }
            }

            Logger.InfoFormat("END {0} : {1}", AnalyzeService.ServiceDisplayName, this.Environment.Analyzer.Port);
        }

        private bool TryTcpListen ()
        {
            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new TcpListener(IPAddress.Any, this.Environment.Analyzer.PortHeavy);

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

                    if (retryCount < this.Environment.Analyzer.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, this.Environment.Analyzer.PortHeavy);

                        Thread.Sleep(this.Environment.Analyzer.ListenRetryIntervalMS);

                        continue;
                    }

                    ///////////////////////////////////////////////////////////////////////////

                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", this.Environment.Analyzer.PortHeavy);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (this.CancelToken.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", this.Environment.Analyzer.PortHeavy, retryCount);

            return true;
        }

        public void DoBeginAcceptTcpClient (TcpListener listener)
        {
            try
            {
                // Set the event to nonsignaled state.
                this.ClientConnected.Reset();

                // Accept the connection :: BeginAcceptSocket() creates the accepted socket.
                listener.BeginAcceptTcpClient(new AsyncCallback(this.DoAcceptTcpClientCallback), listener);

                // Wait until a connection is made and processed before continuing.
                this.ClientConnected.WaitOne(this.Environment.Analyzer.AcceptWaitingTimeoutMS);
            }
            catch (ObjectDisposedException)
            {
                // SKIP
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for Interact Client(MFD)");
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "BeginAccept TcpListener"), ex);
            }
        }

        public void DoAcceptTcpClientCallback (IAsyncResult ar)
        {
            try
            {
                TcpListener listener = (TcpListener)ar.AsyncState;

                TcpClient client = listener.EndAcceptTcpClient(ar);

                client.LingerState = new LingerOption(true, 1);

                Logger.DebugFormat("SpoolReceiver : Client Accepted");

                // Start a Thread "Recv Spoolinfo from Recv Service"
                try
                {
                    Thread thread = new Thread(new ParameterizedThreadStart(this.ProcessRecvSpoolInfo));

                    ReceiveClientThread threadRecv = new ReceiveClientThread(client);

                    threadRecv.Start(thread);

                    this.QueueManagedThread.Enqueue(threadRecv);
                }
                catch (Exception ex)
                {
                    Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "Spoolfile Analyzing"), ex);
                }

                this.ClientConnected.Set();
            }
            catch (ObjectDisposedException) { }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for Spoolfile Analyzing");
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Accept TCP Client Callback for Spoolfile Analyzing"), ex);
                return;
            }
        }

        public void ProcessRecvSpoolInfo (object stateInfo)
        {
            if (stateInfo == null)
            {
                throw new ArgumentNullException("object stateInfo");
            }

            if ((stateInfo is TcpClient) == false)
            {
                throw new ArgumentException("Argument type is Invalid. not TcpClient");
            }

            TcpClient client = stateInfo as TcpClient;

            NetworkStream ns   = null;
            string        path = string.Empty;

            try
            {
                using (ns = client.GetStream())
                {
                    using (StreamReader sr = new StreamReader(ns, Encoding.UTF8))
                    {
                        path = sr.ReadLine();

                        string ip      = sr.ReadLine();
                        string strTime = sr.ReadLine();

                        ////////////////////////////////////////////////////////////////////

                        FileInfo fi = new FileInfo(path);

                        if (fi.Exists == false)
                        {
                            ns.WriteAcknowledge(false);

                            Logger.Error(string.Format("Spool file is not exists (PATH: {0})", path));
                            return;
                        }

                        ////////////////////////////////////////////////////////////////////
                        // 4kByte 이하의 File은 Spool 파일로 보지 않음.
                        if (fi.Length < 4096)
                        {
                            ns.WriteAcknowledge(false);

                            Logger.Error(String.Format("Spool file is not PDL (PATH: {0})", path));
                            this.Environment.Common.MoveErrorSpoolDirectory(path);
                            return;
                        }

                        ////////////////////////////////////////////////////////////////////

                        DateTime time;

                        if (DateTime.TryParse(strTime, out time) == false)
                        {
                            ns.WriteAcknowledge(false);

                            Logger.Error(string.Format("Received time is invalid (VALUE: {0})", strTime));
                            return;
                        }

                        ////////////////////////////////////////////////////////////////////

                        AnalyzedSpoolInfo spool = new AnalyzedSpoolInfo()
                        {
                            SpoolFile       = fi,
                            ClientIPAddress = ip,
                            ReceivedTime    = time
                        };

                        ns.WriteAcknowledge(true);

                        ////////////////////////////////////////////////////////////////////

                        Logger.DebugFormat("Spool file Enqueue :: ({0})", spool);

                        this.QueueSpool.Enqueue(spool);
                    }
                }
            }
            catch (ThreadAbortException)
            {
                if (ns != null)
                {
                    ns.WriteAcknowledge(false);
                }

                // Move a spoolfile to ErrSpool directory
                if (string.IsNullOrWhiteSpace(path) == false)
                {
                    this.Environment.Common.MoveErrorSpoolDirectory(path);
                }

                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Receive a Spool information");
            }
            catch (Exception ex)
            {
                if (ns != null)
                {
                    ns.WriteAcknowledge(false);
                }

                // Move a spoolfile to ErrSpool directory
                if (string.IsNullOrWhiteSpace(path) == false)
                {
                    this.Environment.Common.MoveErrorSpoolDirectory(path);
                }

                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Receive a Spool information"), ex);
            }
        }

        public void ManageThreads ()
        {
            ReceiveClientThread threadClient = null;

            try
            {
                while (this.CancelToken.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (this.QueueManagedThread.IsEmpty == true)
                        {
                            continue;
                        }

                        try
                        {
                            if (this.QueueManagedThread.TryDequeue(out threadClient) == false)
                            {
                                continue;
                            }

                            if (threadClient.IsAlive == false)
                            {
                                continue;
                            }

                            // timeout 
                            if (threadClient.CreateTime.IsOverThanNow(0, 0, 0, this.Environment.Analyzer.SpoolRecvTimeoutSec) == true)
                            {
                                try
                                {
                                    if (threadClient.Client != null)
                                    {
                                        threadClient.Client.Close();
                                    }
                                }
                                catch { }

                                threadClient.Abort();

                                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Client Thread Managing");
                                continue;
                            }

                            this.QueueManagedThread.Enqueue(threadClient);
                        }
                        catch (ThreadAbortException)
                        {
                            throw;
                        }
                        catch
                        {
                            continue;
                        }
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Client Thread Managing"), ex);
                    }
                }
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Client Thread Managing");
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Client Thread Managing"), ex);
            }
        }

        public void FlushMemory ()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (System.Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                SpoolReceiver.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        #endregion Methods



        #region Methods :: Win32 Native Methods

        // refs: http://itstalker.tistory.com/27
        [DllImportAttribute("kernel32.dll", EntryPoint = "SetProcessWorkingSetSize", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern int SetProcessWorkingSetSize (IntPtr process, int minimumWorkingSetSize, int maximumWorkingSetSize);

        #endregion Methods :: Win32 Native Methods
    }



    public static class SpoolReceiverUtility
    {
        public static void WriteAcknowledge (this NetworkStream ns, bool ack)
        {
            if (ns == null)
            {
                throw new ArgumentNullException("this NetworkStream ns");
            }

            try
            {
                ns.WriteByte((ack == true) ? (byte)0x00 : (byte)0x01);
            }
            catch { }
        }
    }
}