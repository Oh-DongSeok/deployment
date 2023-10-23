namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class CSResponseGetPrnListPolicy : CSResponseBase
    {
        #region Properties

        public PrintListInformation result { get; set; }

        #endregion Properties



        #region Constructors

        public CSResponseGetPrnListPolicy () : base()
        {
            this.result = new PrintListInformation();
        }

        public CSResponseGetPrnListPolicy (string status, PrintListInformation result) : base(status)
        {
            this.result = result;
        }

        #endregion Constructors
    }
}
