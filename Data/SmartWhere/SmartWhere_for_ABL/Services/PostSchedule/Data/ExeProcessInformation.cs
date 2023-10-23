namespace FXKIS.SmartWhere.PostSchedule
{
    using System;
    using System.Diagnostics;

    using Common.Extension;



    public class ExeProcessInformation
    {
        #region Properties

        public Process                 ProcessInfo  { get; set; }
        public DateTime                ExecutedTime { get; set; }
        public PrintJobFileInformation PrintJobFile { get; set; }

        #endregion Properties



        #region Constructors

        public ExeProcessInformation ()
        {
            this.ProcessInfo  = new Process();
            this.ExecutedTime = DateTime.Now;
            this.PrintJobFile = null;
        }

        public ExeProcessInformation (Process process, DateTime time, PrintJobFileInformation jobFile) : this()
        {
            if (process == null)
            {
                throw new ArgumentNullException("Process process");
            }

            if (time == null)
            {
                throw new ArgumentNullException("DateTime time");
            }

            if (jobFile == null)
            {
                throw new ArgumentNullException("PrintJobFileInformation jobFile");
            }

            this.ProcessInfo  = process;
            this.ExecutedTime = time;
            this.PrintJobFile = jobFile;
        }

        #endregion Constructors



        #region Methods

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods

    }
}
