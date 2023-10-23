namespace FXKIS.SmartWhere.Receive.Mobile
{
    using System;
    using System.IO;



    public class ReceiveSpoolInfo
    {
        public FileInfo SpoolFile        { get; set; }
        public string   ClientIPAddress  { get; set; }
        public DateTime ReceiveStartTime { get; set; }
        public DateTime ReceiveEndTime   { get; set; }


        public ReceiveSpoolInfo ()
        {
            this.InitializeProperties();
        }

    
        private void InitializeProperties ()
        {
            this.SpoolFile        = null;
            this.ClientIPAddress  = string.Empty;
            this.ReceiveStartTime = DateTime.MinValue;
            this.ReceiveEndTime   = DateTime.MaxValue;
        }

     
    }
}