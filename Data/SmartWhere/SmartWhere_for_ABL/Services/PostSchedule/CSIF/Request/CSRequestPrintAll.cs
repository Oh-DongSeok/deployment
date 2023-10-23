namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSRequestPrintAll : CSRequestBase
    {
        #region Properties
        public string deviceIp    { get; set; }
        public string wsIp        { get; set; }
        public string deviceColor { get; set; }
        public bool   imageLog    { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestPrintAll () : base()
        {
            this.deviceIp    = string.Empty;
            this.wsIp        = string.Empty;
            this.deviceColor = string.Empty;
            this.imageLog    = false;
        }

        public CSRequestPrintAll (string userId, string deviceIp, string wsIp, string deviceColor, bool imageLog) : base(userId)
        {
            this.deviceIp    = deviceIp;
            this.wsIp        = wsIp;
            this.deviceColor = deviceColor;
            this.imageLog    = imageLog;
        }

        #endregion Constructors
    }
}