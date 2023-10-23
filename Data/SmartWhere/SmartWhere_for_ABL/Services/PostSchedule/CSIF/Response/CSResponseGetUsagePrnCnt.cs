namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSResponseGetUsagePrnCnt : CSResponseBase
    {
        #region Properties

        public UsageInformation result { get; set; }

        #endregion Properties



        #region Constructors

        public CSResponseGetUsagePrnCnt () : base()
        {
            this.result = new UsageInformation();
        }

        public CSResponseGetUsagePrnCnt (string status, UsageInformation result) : base(status)
        {
            this.result = result;
        }

        #endregion Constructors
    }
}
