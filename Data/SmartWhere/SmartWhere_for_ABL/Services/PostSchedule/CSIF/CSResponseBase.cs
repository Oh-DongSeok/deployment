namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public abstract class CSResponseBase
    {
        #region Properties

        public string status { get; set; }

        #endregion Properties



        #region Constructors

        public CSResponseBase ()
        {
            this.status = string.Empty;
        }

        public CSResponseBase (string status)
        {
            this.status = status;
        }

        #endregion Constructors
    }
}