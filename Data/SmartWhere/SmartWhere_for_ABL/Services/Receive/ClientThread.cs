namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.Threading;



    public class ClientThread
    {
        #region Properties

        public ReceiveClientInfo ClientInfo    { get; set; }
        public DateTime          CreateTime    { get; set; }
        public Thread            ReceiveThread { get; set; }

        public bool              IsAlive
        {
            get
            {
                try
                {
                    if (this.ReceiveThread == null)
                    {
                        return false;
                    }

                    return this.ReceiveThread.IsAlive;
                }
                catch
                {
                    return false;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public ClientThread ()
        {
            this.CreateTime    = DateTime.Now;
            this.ReceiveThread = null;            
            this.ClientInfo    = null;
        }

        public ClientThread (Thread thread, ReceiveClientInfo client) : this()
        {
            this.ReceiveThread = thread;
            this.ClientInfo    = client;
        }

        #endregion Constructors



        #region Methods

        public void Start()
        {
            this.ReceiveThread.Start(this.ClientInfo);
        }

        #endregion Methods
    }
}