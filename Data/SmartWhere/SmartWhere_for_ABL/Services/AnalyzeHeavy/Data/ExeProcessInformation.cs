namespace FXKIS.SmartWhere.Analyzer_Heavy
{
    using System;
    using System.Diagnostics;

    using Common.Extension;



    public class ExeProcessInformation
    {
        #region Properties

        public Process  ProcessInfo  { get; set; }
        public DateTime ExecutedTime { get; set; }
        public string   JobFilePath  { get; set; }

        #endregion Properties



        #region Constructors

        public ExeProcessInformation ()
        {
            this.ProcessInfo  = new Process();
            this.ExecutedTime = DateTime.Now;
            this.JobFilePath  = string.Empty;
        }

        public ExeProcessInformation (Process process, DateTime time, string pathJobFile) : this()
        {
            if (process == null)
            {
                throw new ArgumentNullException("Process process");
            }

            if (time == null)
            {
                throw new ArgumentNullException("DateTime time");
            }

            if (pathJobFile == null)
            {
                throw new ArgumentNullException("PrintJobFileInformation pathJobFile");
            }

            this.ProcessInfo  = process;
            this.ExecutedTime = time;
            this.JobFilePath  = pathJobFile;
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
