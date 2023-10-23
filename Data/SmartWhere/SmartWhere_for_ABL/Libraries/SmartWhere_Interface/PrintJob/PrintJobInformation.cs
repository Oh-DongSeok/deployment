namespace FXKIS.SmartWhere.CommonIF
{
    using System.Collections.Generic;

    using Common.Extension;



    public class PrintJobInformation
    {
        #region Properties

        public string JobTicket       { get; set; }
        public string UserID          { get; set; }
        public string PrintIPAddress  { get; set; }
        public bool   ImageLogLinkage { get; set; }
        public bool   IsExceptional   { get; set; }
        public bool   Contingency     { get; set; }

        #endregion Properties



        #region Properties :: Collections

        public List<PrintJobData> JobList { get; private set; }

        #endregion Properties :: Collections



        #region Constructors

        public PrintJobInformation ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.JobTicket       = string.Empty;
            this.UserID          = string.Empty;
            this.PrintIPAddress  = string.Empty;
            this.ImageLogLinkage = false;
            this.IsExceptional   = false;
            this.Contingency     = false;
        }

        private void InitializeCollections ()
        {
            this.JobList = new List<PrintJobData>();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}