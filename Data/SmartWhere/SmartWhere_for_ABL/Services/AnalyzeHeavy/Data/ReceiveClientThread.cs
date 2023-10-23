namespace FXKIS.SmartWhere.Analyzer_Heavy
{
    using System;
    using System.Net.Sockets;
    using System.Threading;



    public class ReceiveClientThread
    {
        #region Properties

        private Thread   Thread     { get; set; }
        public  DateTime CreateTime { get; private set; }
        public TcpClient Client     { get; private set; }
        public  bool     IsStart    { get; private set; }
        public  bool     IsAlive
        {
            get
            {
                try
                {
                    if (this.Thread == null)
                    {
                        return false;
                    }

                    return this.Thread.IsAlive;
                }
                catch
                {
                    return false;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public ReceiveClientThread (TcpClient client)
        {
            if (client == null)
            {
                throw new ArgumentNullException("TcpClient client");
            }

            this.Client     = client;
            this.CreateTime = DateTime.Now;
            this.IsStart    = false;

            this.Thread     = null;
        }

        public ReceiveClientThread (TcpClient client, DateTime time) : this(client)
        {
            this.CreateTime = time;
        }

        #endregion Constructors



        #region Methods

        public void Start (Thread thread)
        {
            if (thread == null)
            {
                throw new ArgumentNullException("Thread thread");
            }

            this.Thread = thread;
            this.Thread.Start(this.Client);

            this.IsStart = true;
        }

        public void Abort ()
        {
            if (this.IsAlive == false)
            {
                this.IsStart = false;
                return;
            }

            try
            {
                this.Thread.Abort();
            }
            catch { }

            this.Thread  = null;
            this.IsStart = false;
        }

        #endregion Methods
    }
}
