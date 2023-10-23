namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSResponseCommon : CSResponseBase
    {
        #region Properties

        public string result { get; set; }

        #endregion Properties



        #region Constructors

        public CSResponseCommon () : base()
        {
            this.result = string.Empty;
        }

        public CSResponseCommon (string status, string result) : base(status)
        {
            this.result = result;
        }

        #endregion Constructors
    }
}
