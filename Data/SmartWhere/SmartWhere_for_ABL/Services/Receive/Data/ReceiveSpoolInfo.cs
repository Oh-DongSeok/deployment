namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.IO;



    public class ReceiveSpoolInfo
    {
        #region Properties

        public FileInfo SpoolFile        { get; set; }
        public string   ClientIPAddress  { get; set; }
        public DateTime ReceiveStartTime { get; set; }
        public DateTime ReceiveEndTime   { get; set; }

        

        #endregion Properties



        #region Constructors

        public ReceiveSpoolInfo ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.SpoolFile        = null;
            this.ClientIPAddress  = string.Empty;
            this.ReceiveStartTime = DateTime.MinValue;
            this.ReceiveEndTime   = DateTime.MaxValue;
        }

        #endregion Methods
    }
}