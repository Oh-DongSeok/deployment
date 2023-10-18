namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Net.Sockets;
    using System.Collections.Concurrent;
    using System.IO;
    using System.Net;
    using System.Threading;

    using log4net;

    using Properties.Resources;
    using Events;



    public class SendProcess
    {
        #region Event

        public event CancelEventHandler CancelProcess;
        public event EventHandler     TimeUpdated;
        public event GateEventHandler SendSuccess;

        #endregion Event



        #region Properties

        private IPEndPoint              DestinationEndPoint { get; set; }
        private ConcurrentQueue<byte[]> QueueRequest        { get; set; }
        private ConcurrentQueue<byte[]> QueueResponse       { get; set; }
        private int                     ConnHashcode        { get; set; }
        private int ClientEndPointPort { get; set; }
        private CancellationToken       CancelToken         { get; set; }
        private bool                    RecvSuccess         { get; set; }
        private bool                    RecvEnd             { get; set; }

        #endregion Properties



        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(SendProcess));

        #endregion Variables



        #region Constructors

        public SendProcess (IPEndPoint ipDest, ConcurrentQueue<byte[]> queueRequest, ConcurrentQueue<byte[]> queueResponse, int connHashcode)
        {
            if (ipDest == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "IPEndPoint", "ipDest"));
            }

            if (queueRequest == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "ConcurrentQueue<byte[]>", "queueRequest"));
            }

            if (queueResponse == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "ConcurrentQueue<byte[]>", "queueResponse"));
            }

            this.DestinationEndPoint = ipDest;

            this.QueueRequest        = queueRequest;
            this.QueueResponse       = queueResponse;

            this.ConnHashcode        = connHashcode;
            this.CancelToken         = CancellationToken.None;
            this.RecvSuccess         = false;
            this.RecvEnd             = false;
        }

        public SendProcess (IPEndPoint ipDest, ConcurrentQueue<byte[]> queueRequest, ConcurrentQueue<byte[]> queueResponse, int connHashcode, int ePPort, CancellationToken token) : this(ipDest, queueRequest, queueResponse, connHashcode)
        {
            this.CancelToken = token;
            this.ClientEndPointPort = ePPort;
        }

        #endregion Constructors



        #region Event Handler Methods

        public void Rp_RecvSuccess (object sender, EventArgs e)
        {
            this.RecvSuccess = true;
        }

        public void Rp_RecvEnd (object sender, GateEventArgs e)
        {
            this.RecvEnd = true;
        }

        #endregion Event Handler Methods



        #region Methods

        public void Start()
        {
            try
            {
                Logger.DebugFormat($@"=============== ""SendProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) START !!! ===============");

                using (TcpClient client = new TcpClient(this.DestinationEndPoint.Address.ToString(), this.DestinationEndPoint.Port))
                {
                    client.LingerState = new LingerOption(true, 5);

                    using (NetworkStream ns = client.GetStream())
                    {
                        while (true)
                        {
                            if (this.IsExitCondition() == true)
                            {
                                break;
                            }

                            this.RequestToDestination(ns);

                            this.ResponseToRecvProcess(ns);
                        }
                    }
                }
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat(GlobalMessageResource.MsgThreadWasAbortedDuringConnection, Thread.CurrentThread.Name, this.ConnHashcode);
            }
            catch (Exception ex)
            {
                Logger.Fatal($"{GlobalMessageResource.MsgUnhandledExceptionOccured} ({this.ConnHashcode})", ex);
                Logger.Debug($"SendProcess -> CancelProcess Call !! ({this.ConnHashcode})");
                this.CancelProcess?.Invoke(this, new CancelEventArgs("SendProcess", ConnHashcode));
            }
            finally
            {
                Logger.DebugFormat($@"=============== ""SendProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) END !!! ===============");
            }
        }

        private bool IsExitCondition ()
        {
            if (this.RecvEnd == true)
            {
                return true;
            }

            if (this.CancelToken.IsCancellationRequested == true)
            {
                Logger.DebugFormat($@"=============== ""SendProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) is CLOSED (TIMED OUT) ===============");
                return true;
            }

            return false;
        }

        private void RequestToDestination (NetworkStream ns)
        {
            if (ns == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "NetworkStream", "ns"));
            }

            int lengthReq = 0;

            do
            {
                if (this.IsExitCondition() == true && QueueRequest.Count < 1)
                {
                    return;
                }

                if (this.QueueRequest.IsEmpty == true || this.QueueRequest.TryDequeue(out byte[] data) == false)
                {
                    if (this.RecvSuccess == true)
                    {
                        // "LOOP for REQ" END
                        this.RecvSuccess = false;
                        break;
                    }

                    Thread.Sleep(1);
                    continue;
                }

                if (data == null || data.Length < 1)
                {
                    continue;
                }

                if (this.IsExitCondition() == true && QueueRequest.Count < 1)
                {
                    return;
                }

                lengthReq += data.Length;

                ns.Write(data, 0, data.Length);
                ns.Flush();

                this.TimeUpdated?.Invoke(this, EventArgs.Empty);
            }
            while (true);
        }

        private void ResponseToRecvProcess (NetworkStream ns)
        {
            if (ns == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "NetworkStream", "ns"));
            }            

            int lengthResult = 0;
            int lengthBuffer = 0;

            bool end = false;
            int connectionResetCount = 0;

            do
            {
                byte[] data = new byte[Global.Environment.BufferSize]; // 1,048,576

                if (this.IsExitCondition() == true && QueueRequest.Count < 1)
                {
                    return;
                }

                try
                {
                    lengthBuffer = ns.Read(data, 0, Global.Environment.BufferSize);

                    if (lengthBuffer < Global.Environment.BufferSize)
                    {
                        end = true;
                    }
                }
                catch (Exception ex)
                {
                    if(connectionResetCount++ >= Global.Environment.ConnectionWaitingTimeoutMS / 100) 
                    {
                        throw;
                    }

                    //Logger.Debug($@"Action for ""Connection reset by peer"" ( {connectionResetCount} ) :" + ex.Message, ex);
                    Thread.Sleep(100);
                }

                if (this.IsExitCondition() == true && QueueRequest.Count < 1)
                {
                    return;
                }

                this.TimeUpdated?.Invoke(this, EventArgs.Empty);

                if (data != null && data.Length > 0 && lengthBuffer > 0)
                {
                    if (lengthResult != lengthBuffer)
                    {
                        Array.Resize(ref data, lengthBuffer);
                    }

                    this.QueueResponse.Enqueue(data);

                    lengthResult += data.Length;
                }
                
                if (end == true)
                {
                    Logger.DebugFormat($@"=============== ""SendProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) EVENT ""RecvSuccess"" Occured (Length: {lengthResult}) ===============");

                    // "LOOP for REQ" END
                    this.SendSuccess?.Invoke(this, new GateEventArgs(lengthResult));
                    break;
                }

                if (this.IsExitCondition() == true && QueueRequest.Count < 1)
                {
                    return;
                }
            }
            while (true);
        }

        #endregion Methods
    }
}

