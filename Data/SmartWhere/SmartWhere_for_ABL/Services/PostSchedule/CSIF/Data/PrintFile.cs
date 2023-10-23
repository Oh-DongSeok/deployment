namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class PrintFile
    {
        #region Constants

        public const string DefaultPrintType  = "N";
        public const string DefaultDriverType = "swPrn_MMD2";

        #endregion Constants




        #region Properties

        public string uuId       { get; set; }
        public string docName    { get; set; }
        public string printDate  { get; set; }
        public int    pageCnt    { get; set; }
        public int    printCnt   { get; set; }
        public string prnType    { get; set; }
        public string driverType { get; set; }
        public int    SRCnUp     { get; set; }
        public int    nUp        { get; set; }
        public string color      { get; set; }
        public string destColor  { get; set; }
        public string duplex     { get; set; }
        public string useYn      { get; set; }
        public int    jobStatus  { get; set; }

        #endregion Properties



        #region Constructors

        public PrintFile ()
        {
            this.uuId       = string.Empty;
            this.docName    = string.Empty;
            this.printDate  = string.Empty;
            this.pageCnt    = 0;
            this.printCnt   = 0;
            this.prnType    = PrintFile.DefaultPrintType;
            this.driverType = PrintFile.DefaultDriverType;
            this.SRCnUp     = 0;
            this.nUp        = 0;
            this.color      = string.Empty;
            this.destColor  = string.Empty;
            this.duplex     = string.Empty;
            this.useYn      = string.Empty;
            this.jobStatus  = 0;
        }

        #endregion Constructors
    }
}