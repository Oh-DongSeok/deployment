namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System.Collections.Generic;



    public class CSRequestDeleteSelected : CSRequestBase
    {
        #region Properties

        public string       wsIp         { get; set; }
        public List<string> listSelected { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestDeleteSelected () : base()
        {
            this.wsIp         = string.Empty;
            this.listSelected = new List<string>();
        }

        public CSRequestDeleteSelected (string userid, string wsip, List<string> listSelected) : base(userid)
        {
            this.wsIp         = wsip;
            this.listSelected = new List<string>(listSelected);
        }

        #endregion Constructors
    }
}
