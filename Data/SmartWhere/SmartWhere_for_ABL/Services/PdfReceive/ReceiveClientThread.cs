namespace FXKIS.SmartWhere.PdfReceive
{
    using System;
    using System.Net;
    using System.Threading;


    public class ReceiveClientThread
    {
        #region Properties

        private Thread              Thread          { get; set; }
        public  DateTime            ThreadStartTime { get; private set; }
        public  HttpListenerContext Context         { get; private set; }
        public  bool                IsStart         { get; private set; }
        public  bool                IsAlive
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

        public ReceiveClientThread(HttpListenerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("HttpListenerContext context");
            }

            this.Context         = context;
            this.ThreadStartTime = DateTime.Now;
            this.IsStart         = false;
            this.Thread          = null;
        }

        #endregion Constructors



        #region Methods

        public void Start(Thread thread)
        {
            if (thread == null)
            {
                throw new ArgumentNullException("Thread thread");
            }

            this.Thread = thread;
            this.Thread.Start(this);

            this.ThreadStartTime = DateTime.Now;

            this.IsStart = true;
        }



        public void Abort()
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

            this.Thread = null;
            this.IsStart = false;
        }

        #endregion Methods
    }

}
