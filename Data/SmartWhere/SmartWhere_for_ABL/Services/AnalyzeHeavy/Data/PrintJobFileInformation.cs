namespace FXKIS.SmartWhere.Analyzer_Heavy
{
    using System;

    using Common.Extension;

    using CommonIF;



    public class PrintJobFileInformation
    {
        #region Properties

        public PrintJobData.PrintDriverType Driver { get; set; }
        public string                       Path   { get; set; }

        #endregion Properties



        #region Constructors

        public PrintJobFileInformation ()
        {
            this.InitializeProperties();
        }

        public PrintJobFileInformation (PrintJobData.PrintDriverType driver, string path) : this()
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            this.Driver = driver;
            this.Path   = path;
        }

        public PrintJobFileInformation (PrintJobFileInformation jobFile) : this()
        {
            if (jobFile == null)
            {
                throw new ArgumentNullException("PrintJobFileInformation jobFile");
            }

            this.Driver = jobFile.Driver;
            this.Path   = jobFile.Path;
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Driver = PrintJobData.PrintDriverType.Unknown;
            this.Path   = string.Empty;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
