namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System.Collections.Generic;



    public class CSRequestPrintSelected : CSRequestBase
    {
        #region Properties

        public string                  deviceIp     { get; set; }
        public string                  wsIp         { get; set; }
        public List<PrintSelectedFile> listSelected { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestPrintSelected () : base()
        {
            this.deviceIp     = string.Empty;
            this.wsIp         = string.Empty;
            this.listSelected = new List<PrintSelectedFile>();
        }

        public CSRequestPrintSelected (string userid, string deviceIp, string wsip, List<PrintSelectedFile> listSelected) : base(userid)
        {
            this.deviceIp     = deviceIp;
            this.wsIp         = wsIp;
            this.listSelected = new List<PrintSelectedFile>(listSelected);
        }

        #endregion Constructors
    }
}