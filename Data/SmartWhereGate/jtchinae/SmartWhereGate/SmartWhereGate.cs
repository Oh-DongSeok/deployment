namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;
    using log4net;
    using Properties.Resources;
    using System.Linq;
    using System.Threading.Tasks;

    partial class SmartWhereGate : ServiceBase
    {
        #region External Method Declaration

        [DllImport("kernel32.dll")]
        public static extern uint GetLastError ();

        #endregion External Method Declaration

        public static readonly string[] LocalIP = { "0.0.0.0", "127.0.0.1" };

        #region Constants :: Default Settings

        private const string SecretKey   = @"!SmartWhereGate_develop_by_<FXKIS_SEC_chosm>_20161021!";
        public  const string LogFileName = @"LogConfig-SmartWhereGate.xml";

        #endregion Constants :: Default Settings

        
        #region Events

        public static ManualResetEvent ClientConnected = new ManualResetEvent(false);

        #endregion Events
        

        #region Properties

        private TcpListener GateListener { get; set; }

        #endregion Properties
        

        #region Variables

        private ConcurrentDictionary<string, GateProcessInfo> ProcessDictionary = new ConcurrentDictionary<string, GateProcessInfo>();

        private List<Thread> SubFunctionThreadList = new List<Thread>();

        private CancellationTokenSource CancelSource = new CancellationTokenSource();

        private static readonly ILog Logger = LogManager.GetLogger(typeof(SmartWhereGate));

        #endregion Variables
        

        #region Constructors

        public SmartWhereGate ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors

        
        #region Service Control Methods

        protected override void OnStart (string[] args)
        {
            try
            {
                log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SmartWhereGate.LogFileName)));
                
                Global.SecretKeyForCryptography = SmartWhereGate.SecretKey;

                Global.InitializeServiceConfiguration();

                bool isSame = this.CheckIP();
                if(isSame == true)
                {
                    throw new ArgumentException("The IP of SmartWhere and SmartWhereGate is the same.", "SmartWhereIpAddress");
                }

                Thread thread = new Thread(this.Start);
                thread.Start();
            }
            catch (Exception ex)
            {
                Logger.Fatal(ex.Message, ex);

                this.ExitCode = (int)GetLastError();
                this.Stop();
                throw;
            }
        }

        protected override void OnStop ()
        {
            this.CancelSource?.Cancel();

            Logger.InfoFormat("CLOSE {0} - {1}", GlobalStringResource.AppNameSmartWhereGate, (Global.Environment != null) ? Global.Environment.ServiceIpAddress.ToString() : "127.0.0.1");
        }

        #endregion Service Control Methods


        #region Methods :: Main & Recv

        public bool CheckIP()
        {
            string myIP = this.GetLocalIP();
            string smartwhereIP = Global.Environment.SmartWhereIpAddress.ToString();
            // 스마트웨어 ip 판단(0.0.0.0 ,127.0.0.1 ,자신의 IP가 입력되어진 경우)         
            if (SmartWhereGate.LocalIP.Contains(smartwhereIP) == true || smartwhereIP == myIP)
            {
                return true;
            }
            return false;
        }


        public string GetLocalIP()
        {
            IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            return string.Empty;
        }
        

        public void Start ()
        {
            try
            {
                this.OpenGateListener();

                this.CreateManagingThread(this.ManageTimedOutProcess);
                this.CreateManagingThread(this.ManageRemainLogs);
                this.CreateManagingThread(this.ManageTempSpoolFiles);

                Logger.InfoFormat("STANDBY {0} - {1}", GlobalStringResource.AppNameSmartWhereGate, Global.Environment.ServiceIpAddress.ToString());

                // LOOP for Accept of Recv Connection
                while (this.CancelSource.IsCancellationRequested == false)
                {
                    Thread.Sleep(100);

                    var t = this.DoBeginAcceptTcpClient(this.GateListener);
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
            }
            finally
            {
                this.CancelSource.Cancel();

                if (this.GateListener != null && this.SubFunctionThreadList.Count > 0)
                {
                    Thread.Sleep(Global.Environment.ForcedTerminatedTimeoutMS);
                }

                this.TerminateManagingThreads();

                this.CloseGateListener();
            }
        }

        private async Task DoBeginAcceptTcpClient (TcpListener listener)
        {
            try
            {
                // Set the event to nonsignaled state.
                SmartWhereGate.ClientConnected.Reset();

                // Accept the connection :: BeginAcceptSocket() creates the accepted socket.
                listener.BeginAcceptTcpClient(new AsyncCallback(DoAcceptTcpClientCallback), listener);

                // Wait until a connection is made and processed before continuing.
                SmartWhereGate.ClientConnected.WaitOne(Global.Environment.ConnectionWaitingTimeoutMS);
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
            }
        }

        private void DoAcceptTcpClientCallback (IAsyncResult ar)
        {
            try
            {
                // Get the listener that handles the client request.
                TcpListener listener = (TcpListener)ar.AsyncState;

                // End the operation and display the received data on the console.
                TcpClient client = listener.EndAcceptTcpClient(ar);
                
                string ipAddr = ((IPEndPoint)client.Client.RemoteEndPoint).Address.ToString();
                int hashcode = client.GetHashCode();
                int EPPort = ((IPEndPoint)client.Client.RemoteEndPoint).Port;

                client.LingerState = new LingerOption(true, 5);

                Logger.DebugFormat($"CONNECTION OPEN {ipAddr}:{EPPort}({hashcode})");

                // Process Start
                GateProcessInfo process = new GateProcessInfo(client, new IPEndPoint(Global.Environment.SmartWhereIpAddress, Global.Environment.SmartWherePort));
                process.Start();

                this.ProcessDictionary.TryAdd(Guid.NewGuid().ToString(), process);


                //// Signal the calling thread to continue.
                //SmartWhereGate.ClientConnected.Set();
                
            }
            catch (ObjectDisposedException)
            {
                // Service 종료 이후 발생
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);               
            }
        }

        #endregion Methods :: Main & Recv



        #region Methods :: Lifecycle

        private void OpenGateListener ()
        {
            this.GateListener = new TcpListener(IPAddress.Any, Global.Environment.ServicePort);

            this.GateListener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);

            this.GateListener.Start();
        }

        private void CloseGateListener ()
        {
            try
            {
                this.GateListener?.Stop();
            }
            catch (Exception ex)
            {
                Logger.Fatal(string.Format(GlobalMessageResource.MsgExceptionOccured, @"GateListener(TCP) stoping"), ex);
            }
        }

        private void CreateManagingThread (Action action)
        {
            if (action == null)
            {
                throw new ArgumentNullException("Action action");
            }

            Thread thread = new Thread(new ThreadStart(action));
            thread.Name = action.Method.Name;
            thread.Start();

            this.SubFunctionThreadList.Add(thread);
        }

        private void TerminateManagingThreads ()
        {
            if (this.SubFunctionThreadList.Count > 0)
            {
                foreach (Thread thread in this.SubFunctionThreadList)
                {
                    try
                    {
                        if (thread != null && thread.ThreadState == ThreadState.Running)
                        {
                            thread.Abort();
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.Fatal(string.Format(GlobalMessageResource.MsgExceptionOccured, "\"" + thread.Name + "\" Thread Terminating"), ex);
                    }
                }
            }
        }

        #endregion Methods :: Lifecycle



        #region Methods :: Managing SubFunctions

        private void ManageTimedOutProcess ()
        {
            List<string> listDeleted = new List<string>();

            while (this.CancelSource.IsCancellationRequested == false)
            {
                try
                {
                    Thread.Sleep(Global.Environment.ThreadManagingCycleMS);

                    int cntTerminated = 0;

                    foreach (var pair in this.ProcessDictionary)
                    {
                        if (this.CancelSource.Token.IsCancellationRequested == true)
                        {
                            return;
                        }

                        try
                        {
                            if (!(pair.Value is GateProcessInfo))
                            {
                                Logger.DebugFormat("this.ProcessDictionary[{0}] had invalid process (TYPE INVALID)", pair.Key);
                                continue;
                            }

                            GateProcessInfo processInfo = pair.Value as GateProcessInfo;

                            if(processInfo.RecvProcessThread == null && processInfo.SendProcessThread == null)
                            {
                                listDeleted.Add(pair.Key);
                            }
                            else
                            {
                                if (processInfo.IsTimedOut() == true)
                                {
                                    if (processInfo.RecvProcessThread.ThreadState == ThreadState.Running || processInfo.SendProcessThread.ThreadState == ThreadState.Running
                                        || processInfo.RecvProcessThread.ThreadState == ThreadState.Background || processInfo.SendProcessThread.ThreadState == ThreadState.Background)
                                    {
                                        processInfo.Terminate();
                                        cntTerminated++;
                                    }

                                    listDeleted.Add(pair.Key);
                                }
                                else if (processInfo.RecvProcessThread.ThreadState != ThreadState.Running && processInfo.SendProcessThread.ThreadState != ThreadState.Running
                                    && processInfo.RecvProcessThread.ThreadState != ThreadState.Background && processInfo.SendProcessThread.ThreadState != ThreadState.Background)
                                {
                                    listDeleted.Add(pair.Key);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(string.Format(GlobalMessageResource.MsgExceptionOccured, @"LOOP for Checking a TimedOut Process"), ex);
                        }
                    }

                    if (listDeleted.Count < 1)
                    {
                        continue;
                    }

                    foreach (string key in listDeleted)
                    {
                        GateProcessInfo deleted = null;

                        this.ProcessDictionary.TryRemove(key, out deleted);
                    }

                    if (cntTerminated > 0)
                    {
                        Logger.DebugFormat("TERMINATED PROCESS COUNT : {0}", cntTerminated);
                    }

                    listDeleted.Clear();
                }
                catch (ThreadAbortException)
                {
                    Logger.WarnFormat(GlobalMessageResource.MsgThreadWasAborted, @"TimedOut Process Managing");
                    return;
                }
                catch (Exception ex)
                {
                    Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                    continue;
                }
            }
        }

        private void ManageRemainLogs ()
        {
            if (Global.Environment.LogRemainDays < 1)
            {
                return;
            }

            DatabaseHandler db = new DatabaseHandler();

            int rowsDeletedServiceLog = 0;
            int rowsDeletedGateJobLog = 0;

            while (this.CancelSource.IsCancellationRequested == false)
            {
                try
                {
                    rowsDeletedServiceLog = db.DeleteServiceLogByDateDiff(Global.Environment.LogRemainDays);
                    rowsDeletedGateJobLog = db.DeleteGateJobLogByDateDiff(Global.Environment.LogRemainDays);

                    if (rowsDeletedServiceLog > 0)
                    {
                        Logger.InfoFormat("Service Log Clearing occurred (rows: {0})", rowsDeletedServiceLog);
                    }

                    if (rowsDeletedGateJobLog > 0)
                    {
                        Logger.InfoFormat("Gate Job Log Clearing occurred (rows: {0})", rowsDeletedGateJobLog);
                    }

                    Thread.Sleep(Global.Environment.LogManagingCycleMS);
                }
                catch (ThreadAbortException)
                {
                    Logger.WarnFormat(GlobalMessageResource.MsgThreadWasAborted, @"Remain Log Managing");
                    return;
                }
                catch (Exception ex)
                {
                    Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                    continue;
                }
            }
        }

        private void ManageTempSpoolFiles ()
        {
            int cntDeletedTempSpoolFile = 0;

            string pathDir = Global.Environment.TempSpoolDirectoryPath;

            if (Path.IsPathRooted(pathDir) == false)
            {
                pathDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathDir);
            }

            if (Directory.Exists(pathDir) == false)
            {
                Directory.CreateDirectory(pathDir);

                Logger.WarnFormat("Temp Spool File Directory is not exists. This directory was created by SmartWhere Gate Service - {0}", pathDir);
            }

            DirectoryInfo dirTempSpool = new DirectoryInfo(pathDir);

            while (this.CancelSource.IsCancellationRequested == false)
            {
                try
                {
                    DateTime nextDay = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0).AddDays(1.0);

                    TimeSpan delay = nextDay.Subtract(DateTime.Now);

                    FileInfo[] arrChild = dirTempSpool.GetFiles();

                    if (arrChild == null || arrChild.Length < 1)
                    {
                        Thread.Sleep(delay);
                        continue;
                    }

                    cntDeletedTempSpoolFile = 0;

                    foreach (FileInfo child in arrChild)
                    {
                        if (child.LastWriteTime.AddDays(1).CompareTo(DateTime.Now) < 0) // if ("파일 최종 작성시간 + 1일"이 현재보다 이전입니다.)
                        {
                            child.Delete();
                            cntDeletedTempSpoolFile++;
                        }
                    }
                    
                    if (cntDeletedTempSpoolFile > 0)
                    {
                        Logger.InfoFormat("Temp Spool File Clearing occurred (count: {0})", cntDeletedTempSpoolFile);
                    }

                    Thread.Sleep(delay);
                }
                catch (ThreadAbortException)
                {
                    Logger.WarnFormat(GlobalMessageResource.MsgThreadWasAborted, @"Remain Temp Spool File Managing");
                    return;
                }
                catch (Exception ex)
                {
                    Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                    continue;
                }
            }
        }

        #endregion Methods :: Managing SubFunctions
    }
}
