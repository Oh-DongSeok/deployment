namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class UsageInformation
    {
        #region Properties

        public string userId       { get; set; }
        public int    prnCount     { get; set; }
        public int    functionCtrl { get; set; }
        public int    usedColor    { get; set; }
        public int    usedGray     { get; set; }
        public int    limitColor   { get; set; }
        public int    limitGray    { get; set; }
        public string overCountPrint { get; set; }

        #endregion Properties



        #region Constructors

        public UsageInformation ()
        {
            this.userId         = string.Empty;
            this.prnCount       = 0;
            this.functionCtrl   = 0;
            this.usedColor      = 0;
            this.usedGray       = 0;
            this.limitColor     = 0;
            this.limitGray      = 0;
            this.overCountPrint = string.Empty;
        }

        #endregion Constructors
    }
}
