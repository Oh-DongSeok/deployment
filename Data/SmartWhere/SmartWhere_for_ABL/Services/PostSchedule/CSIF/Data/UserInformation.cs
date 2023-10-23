namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class UserInformation
    {
        #region Properties

        public string userId           { get; set; }
        public int    prnCount         { get; set; }
        public int    functionCtrl     { get; set; }
        public string defaultBlack     { get; set; }
        public string forced2Up        { get; set; }
        public string forcedBlack      { get; set; }
        public string forcedDuplex     { get; set; }
        public string printAgain       { get; set; }
        public string colorRestriction { get; set; }
        public uint   serverIdx        { get; set; }

        #endregion Properties



        #region Constructors

        public UserInformation ()
        {
            this.userId           = string.Empty;
            this.prnCount         = 0;
            this.functionCtrl     = 0;
            this.defaultBlack     = string.Empty;
            this.forced2Up        = string.Empty;
            this.forcedBlack      = string.Empty;
            this.forcedDuplex     = string.Empty;
            this.printAgain       = string.Empty;
            this.colorRestriction = string.Empty;
            this.serverIdx        = 0;
        }

        #endregion Constructors
    }
}
