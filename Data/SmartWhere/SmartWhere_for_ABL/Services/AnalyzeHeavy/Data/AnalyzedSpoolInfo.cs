namespace FXKIS.SmartWhere.Analyzer_Heavy
{
    using System;
    using System.IO;



    public class AnalyzedSpoolInfo
    {
        #region Properties

        public FileInfo SpoolFile       { get; set; }
        public string   ClientIPAddress { get; set; }
        public DateTime ReceivedTime    { get; set; }

        #endregion Properties



        #region Constructors

        public AnalyzedSpoolInfo ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.SpoolFile       = null;
            this.ClientIPAddress = string.Empty;
            this.ReceivedTime    = DateTime.MinValue;
        }

        public override string ToString ()
        {
            string path = string.Empty;
            string ip   = string.Empty;
            string time = string.Empty;

            if (this.SpoolFile != null)
            {
                path = this.SpoolFile.Name;
            }

            ip   = this.ClientIPAddress;
            time = this.ReceivedTime.ToString("yyyy/MM/dd HH:mm:ss.fff");

            string result = string.Empty;

            result += "{ ";
                result += "\"Path\" : \""     + path + "\", ";
                result += "\"ClientIP\" : \"" + ip   + "\", ";
                result += "\"RecvTime\" : \"" + time + "\"";
            result += " }";

            return result;
        }

        #endregion Methods
    }
}