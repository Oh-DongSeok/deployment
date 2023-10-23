namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSRequestCommon : CSRequestBase
    {
        #region Properties

        public string deviceIp { get; set; }
        public string wsIp     { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestCommon () : base()
        {
            this.deviceIp = string.Empty;
            this.wsIp     = string.Empty;
        }

        public CSRequestCommon (string userid, string deviceip, string wsip) : base(userid)
        {
            this.deviceIp = deviceip;
            this.wsIp     = wsip;
        }

        #endregion Constructors
    }
}