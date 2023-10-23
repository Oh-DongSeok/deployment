namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class PrintSelectedFile
    {
        #region Properties

        public string uuId     { get; set; }
        public string prnType  { get; set; }
        public string color    { get; set; }
        public string duplex   { get; set; }
        public int    nUp      { get; set; }
        public int    pageCnt  { get; set; }
        public int    printCnt { get; set; }
        public string prnSave  { get; set; }

        #endregion Properties



        #region Constructors

        public PrintSelectedFile ()
        {
            this.uuId     = string.Empty;
            this.prnType  = string.Empty;
            this.color    = "C";
            this.duplex   = "S";
            this.nUp      = 1;
            this.pageCnt  = 0;
            this.printCnt = 0;
            this.prnSave  = "N";
        }

        #endregion Constructors
    }
}