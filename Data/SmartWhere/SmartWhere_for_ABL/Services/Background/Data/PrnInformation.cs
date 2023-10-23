namespace FXKIS.SmartWhere.Background
{
    using System;

    using CommonIF;

    using Common.Extension;



    public class PrnInformation
    {
        #region Constants

        public const int DefaultRemainHours = 1;

        #endregion Constants



        #region Properties

        public string                       UUID          { get; set; }
        public DateTime                     ReceivedTime  { get; set; }
        public string                       SpoolName     { get; set; }
        public string                       UserIPAddress { get; set; }
        public PrintJobData.PrintDriverType Driver        { get; set; }
        public bool                         IsBackup      { get; set; }
        public int                          RemainHours   { get; set; }
        public int                          ServerIdx     { get; set; }

        #endregion Properties



        #region Constructors

        public PrnInformation ()
        {
            this.InitializeProperties();
        }

        public PrnInformation (string uuid, DateTime time, string spoolName, string userIP, PrintJobData.PrintDriverType driver, bool isBackup, int remainHours, int serverIdx) : this()
        {
            if (string.IsNullOrWhiteSpace(uuid) == true)
            {
                throw new ArgumentNullException("string uuid");
            }

            if (string.IsNullOrWhiteSpace(spoolName) == true)
            {
                throw new ArgumentNullException("string spoolName");
            }

            if (string.IsNullOrWhiteSpace(userIP) == true)
            {
                throw new ArgumentNullException("string userIP");
            }

            if (remainHours < 1)
            {
                throw new ArgumentOutOfRangeException("int remainHours", remainHours, string.Format("value is less than 1 ({0} < 1)", remainHours));
            }

            this.UUID          = uuid;
            this.ReceivedTime  = time;
            this.SpoolName     = spoolName;
            this.UserIPAddress = userIP;
            this.Driver        = driver;
            this.IsBackup      = isBackup;
            this.RemainHours   = remainHours;
            this.ServerIdx     = serverIdx;
        }

        public PrnInformation (PrnInformation prn) : this()
        {
            if (prn == null)
            {
                throw new ArgumentNullException("PrnInformation prn");
            }

            this.UUID          = prn.UUID;
            this.ReceivedTime  = prn.ReceivedTime;
            this.SpoolName     = prn.SpoolName;
            this.UserIPAddress = prn.UserIPAddress;
            this.Driver        = prn.Driver;
            this.IsBackup      = prn.IsBackup;
            this.RemainHours   = prn.RemainHours;
            this.ServerIdx     = prn.ServerIdx;
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.UUID          = string.Empty;
            this.ReceivedTime  = DateTime.MinValue;
            this.SpoolName     = string.Empty;
            this.UserIPAddress = string.Empty;
            this.Driver        = PrintJobData.PrintDriverType.Unknown;
            this.IsBackup      = false;
            this.RemainHours   = PrnInformation.DefaultRemainHours;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
