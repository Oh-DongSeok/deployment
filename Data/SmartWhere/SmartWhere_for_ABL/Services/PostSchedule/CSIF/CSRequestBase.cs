namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public abstract class CSRequestBase
    {
        #region Properties

        public string userId { get; set; }

        #endregion Properties



        #region Constructors

        public CSRequestBase ()
        {
            this.userId   = string.Empty;
        }

        public CSRequestBase (string userid)
        {
            this.userId = userid;
        }

        #endregion Constructors
    }
}
