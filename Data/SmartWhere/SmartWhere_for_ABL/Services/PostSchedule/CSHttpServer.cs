namespace FXKIS.SmartWhere.PostSchedule
{
    using System;
    using System.Net;
    using System.Net.Sockets;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Diagnostics;

    using System.Runtime.InteropServices;
    using System.Collections.Concurrent;

    using log4net;

    using CommonIF;



    public class CSHttpServer
    {
        #region Events

        public event EventHandler<EventArgs> ListenFailed;

        public ManualResetEvent ClientConnected = new ManualResetEvent(false);

        #endregion Events



        #region Properties :: Collections

        private ConcurrentQueue<TcpClient> QueueClient { get; set; }

        #endregion Properties :: Collections



        #region Properties

        public  SmartWhereEnvironment   Environment { get; set; }
        private TcpListener             Listener    { get; set; }
        private CancellationTokenSource CancelToken { get; set; }

        #endregion Properties



        #region Variables :: Logger (Log4net)

        public static readonly ILog Logger = LogManager.GetLogger(typeof(CSHttpServer));

        #endregion Variables :: Logger (Log4net)



        #region Constructors

        public CSHttpServer (ConcurrentQueue<TcpClient> queueClient, SmartWhereEnvironment env)
        {
            if (queueClient == null)
            {
                throw new ArgumentNullException("ConcurrentQueue<TcpClient> queueClient");
            }

            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            this.QueueClient = queueClient;
            this.Environment = env;
            this.Listener    = null;
        }

        #endregion Constructors



        #region Methods

        public async Task StartAsync (CancellationTokenSource cancelToken)
        {
            this.CancelToken = cancelToken;

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START (PORT: {0})", this.Environment.PostScheduler.Port);



            ///////////////////////////////////////////////////////////////////////////
            // TRY TO LISTEN
            ///////////////////////////////////////////////////////////////////////////

            bool isSuccess = await this.TryTcpListen();

            if (isSuccess == false)
            {
                return;
            }


            ///////////////////////////////////////////////////////////////////////////
            // LISTEN & TRY TO ACCEPT
            ///////////////////////////////////////////////////////////////////////////

            try
            {
                while (this.CancelToken.IsCancellationRequested == false)
                {
                    await Task.Delay(1);

                    this.DoBeginAcceptTcpClient(this.Listener);
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "Try to Begin Accept TcpClient"), ex);
            }
            finally
            {
                if (this.Listener != null)
                {
                    try
                    {
                        this.Listener.Stop();
                    }
                    catch { }
                    
                    Logger.InfoFormat("HTTP Connection Listener - LISTEN STOP :: SUCCESS (PORT: {0})", this.Environment.PostScheduler.Port);
                }
            }

            Logger.InfoFormat("HTTP Connection Listener - LISTEN FINISH (PORT: {0})", this.Environment.PostScheduler.Port);
        }

        private async Task<bool> TryTcpListen ()
        {
            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new TcpListener(IPAddress.Any, this.Environment.PostScheduler.Port);

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

                    if (retryCount < this.Environment.PostScheduler.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, this.Environment.PostScheduler.Port);

                        // Thread.Sleep(...) => await Task.Delay(...) in async code
                        // (https://stackoverflow.com/questions/20082221/when-to-use-task-delay-when-to-use-thread-sleep)
                        await Task.Delay(this.Environment.PostScheduler.ListenRetryIntervalMS);

                        continue;
                    }

                    ///////////////////////////////////////////////////////////////////////////

                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", this.Environment.PostScheduler.Port);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (this.CancelToken.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", this.Environment.PostScheduler.Port, retryCount);

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
                this.ClientConnected.WaitOne(this.Environment.PostScheduler.AcceptWaitingTimeoutMS);
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
                TcpClient   client   = listener.EndAcceptTcpClient(ar);

                client.LingerState = new LingerOption(true, 1);

                Logger.DebugFormat("Connection Enqueue :: ({0})", CSHttpServer.GetClientInfoString(client));

                this.QueueClient.Enqueue(client);
            }
            catch (ObjectDisposedException)
            {
                // SKIP
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for Interact Client(MFD)");
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Accept TCP Client Callback for Interact Client(MFD)"), ex);
                return;
            }

            // Signal the calling thread to continue.
            this.ClientConnected.Set();
        }

        public void FlushMemory()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (System.Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                CSHttpServer.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        public static string GetClientInfoString (TcpClient client)
        {
            if (client == null)
            {
                throw new ArgumentNullException("TcpClient client");
            }

            try
            {
                if (client == null || client.Client == null || client.Client.RemoteEndPoint == null)
                {
                    return string.Format("CLIENT: {0}", client.GetHashCode());
                }

                return string.Format("CLIENT: {0}, ENDPOINT: {1}", client.GetHashCode(), client.Client.RemoteEndPoint);
            }
            catch
            {
                return string.Format("CLIENT: {0}", client.GetHashCode());
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
