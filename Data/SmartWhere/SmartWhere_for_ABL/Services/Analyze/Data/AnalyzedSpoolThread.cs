namespace FXKIS.SmartWhere.Analyzer
{
    using System;
    using System.Threading;



    public class AnalyzedSpoolThread
    {
        #region Properties

        private Thread            Thread     { get; set; }
        public  DateTime          CreateTime { get; private set; }
        public  AnalyzedSpoolInfo SpoolInfo  { get; private set; }
        public  bool              IsStart    { get; private set; }
        public  bool              IsAlive
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

        public AnalyzedSpoolThread (AnalyzedSpoolInfo spool)
        {
            if (spool == null)
            {
                throw new ArgumentNullException("AnalyzedSpoolInfo spool");
            }

            this.SpoolInfo  = spool;
            this.CreateTime = DateTime.Now;
            this.IsStart    = false;

            this.Thread     = null;
        }

        public AnalyzedSpoolThread (AnalyzedSpoolInfo spool, DateTime time) : this(spool)
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
            this.Thread.Start(this.SpoolInfo);

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
