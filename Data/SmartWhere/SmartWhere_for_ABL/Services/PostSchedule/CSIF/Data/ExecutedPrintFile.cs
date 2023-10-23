namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    public class ExecutedPrintFile
    {
        #region Properties

        public string UUID        { get; set; }
        public string DocName     { get; set; }
        public string SpoolName   { get; set; }
        public string Queue       { get; set; }
        public string DriverType  { get; set; }
        public string PageCount   { get; set; }
        public string PrintCount  { get; set; }
        public string PrnType     { get; set; }
        public string NUp         { get; set; }
        public string ColorMode   { get; set; }
        public string Duplex      { get; set; }
        public string ClientIP    { get; set; }
        public bool   PrnSave     { get; set; }
        public bool   IsPrintable { get; set; }

        #endregion Properties



        #region Constructors

        public ExecutedPrintFile ()
        {
            this.UUID        = string.Empty;
            this.SpoolName   = string.Empty;
            this.ColorMode   = string.Empty;
            this.Duplex      = string.Empty;
            this.NUp         = string.Empty;
            this.PageCount   = string.Empty; // <= totalPages
            this.PrintCount  = string.Empty; // <= Copies
            this.Queue       = string.Empty;
            this.PrnType     = string.Empty;
            this.DriverType  = string.Empty;
            this.DocName     = string.Empty;
            this.ClientIP    = string.Empty;
            this.IsPrintable = true;
            this.PrnSave     = false;
        }

        #endregion Constructors
    }
}
