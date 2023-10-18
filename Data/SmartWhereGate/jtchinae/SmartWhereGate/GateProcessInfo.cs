namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Collections.Concurrent;
    using System.Net;
    using System.Net.Sockets;
    using System.Threading;
    using FXKIS.SmartWhere.Gate.Events;
    using log4net;

    using Properties.Resources;



    public class GateProcessInfo
    {
        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(GateProcessInfo));

        #endregion Variables



        #region Properties :: Thread

        public Thread RecvProcessThread { get; set; }
        public Thread SendProcessThread { get; set; }

        #endregion Properties :: Thread


        #region Properties

        private ConcurrentQueue<byte[]> QueueRequest { get; set; }
        private ConcurrentQueue<byte[]> QueueResponse { get; set; }
        public CancellationTokenSource CancelSource { get; set; }
        public DateTime EnrollTime { get; set; }
        private int Hashcode { get; set; }
        private int EPPort { get; set; }
        private TcpClient Client  { get; set;}

        #endregion Properties



        #region Constructors

        public GateProcessInfo (TcpClient client, IPEndPoint ipDest)
        {
            if (client == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "TcpClient", "client"));
            }

            if (ipDest == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "IPEndPoint", "ipDest"));
            }

            this.QueueRequest  = new ConcurrentQueue<byte[]>();
            this.QueueResponse = new ConcurrentQueue<byte[]>();

            this.CancelSource  = new CancellationTokenSource();
            this.EnrollTime    = DateTime.Now;
            this.Hashcode      = client.GetHashCode();
            this.EPPort = ((IPEndPoint)client.Client.RemoteEndPoint).Port;
            this.Client = client;

            RecvProcess rp = new RecvProcess(client, this.QueueRequest, this.QueueResponse, this.Hashcode, this.EPPort, this.CancelSource.Token);
            SendProcess sp = new SendProcess(ipDest, this.QueueRequest, this.QueueResponse, this.Hashcode, this.EPPort, this.CancelSource.Token);

            rp.CancelProcess += CancelProcessEventHandler;
            sp.CancelProcess += CancelProcessEventHandler;

            rp.TimeUpdated += this.Rp_TimeUpdated;
            sp.TimeUpdated += this.Sp_TimeUpdated;

            rp.RecvSuccess += sp.Rp_RecvSuccess;
            sp.SendSuccess += rp.Sp_SendSuccess;

            rp.RecvEnd += sp.Rp_RecvEnd;

            this.RecvProcessThread = new Thread(rp.Start);
            this.SendProcessThread = new Thread(sp.Start);

            this.RecvProcessThread.IsBackground = true;
            this.SendProcessThread.IsBackground = true;
        }

        #endregion Constructors



        #region Event Handler Methods

        private void CancelProcessEventHandler(object sender, CancelEventArgs e)
        {
            Logger.Debug($"GateProcessInfo CancelProcessEventHandler => {e.Process} : {e.Hashcode}");
            Terminate();
        }

        private void Rp_TimeUpdated (object sender, EventArgs e)
        {
            this.EnrollTime = DateTime.Now;
        }

        private void Sp_TimeUpdated (object sender, EventArgs e)
        {
            this.EnrollTime = DateTime.Now;
        }

        #endregion Event Handler Methods



        #region Methods

        public bool IsTimedOut ()
        {
            // "EnrollTime + TimeoutSecond" is earlier than now : TIMED OUT
            if (DateTime.Compare(this.EnrollTime.AddMilliseconds(Global.Environment.ConnectionWaitingTimeoutMS), DateTime.Now) < 0)
            {
                return true;
            }

            return false;
        }

        public void Start ()
        {
            if (this.RecvProcessThread != null && this.SendProcessThread != null)
            {
                this.RecvProcessThread.Start();
                this.SendProcessThread.Start();
            }
        }

        public void Terminate ()
        {
            this.CancelSource.Cancel();

            Thread.Sleep(Global.Environment.ForcedTerminatedTimeoutMS);

            try
            {
                Logger.DebugFormat($@"Terminate Cancel Call!!   ""RecvProcessThread"" : {RecvProcessThread.ThreadState}, ""SendProcessThread"" : {SendProcessThread.ThreadState} (conn: {Hashcode}, EndPointPort: {EPPort})");
                if (this.RecvProcessThread.ThreadState == ThreadState.Running || this.RecvProcessThread.ThreadState == ThreadState.Background)
                {
                    this.RecvProcessThread.Abort();

                    Logger.DebugFormat($@"=============== ""RecvProcessThread"" THREAD(conn: {Hashcode}, EndPointPort: {EPPort}) is TERMINATED (ABORT) ===============");
                }

                if (this.SendProcessThread.ThreadState == ThreadState.Running || this.SendProcessThread.ThreadState == ThreadState.Background)
                {
                    this.SendProcessThread.Abort();

                    Logger.DebugFormat($@"=============== ""SendProcessThread"" THREAD(conn: {Hashcode}, EndPointPort: {EPPort}) is TERMINATED (ABORT) ===============");
                }
            }
            catch (Exception ex)
            {
                Logger.Error(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
            }

            this.RecvProcessThread = null;
            this.SendProcessThread = null;
            this.QueueRequest = null;
            this.QueueResponse = null;
            this.CancelSource = null;
        }

        #endregion Methods
    }
}