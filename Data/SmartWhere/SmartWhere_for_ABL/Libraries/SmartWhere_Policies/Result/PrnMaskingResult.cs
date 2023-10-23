namespace FXKIS.SmartWhere.Policy
{
    using Common.Extension;



    public class PrnMaskingResult
    {
        #region Properties

        public string SpoolID        { get; set; }
        public string PolicyID       { get; set; }
        public int    PageNumber     { get; set; }
        public int    DetectionCount { get; set; }

        #endregion Properties



        #region Constructors

        public PrnMaskingResult () : base()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        public void InitializeProperties ()
        {
            this.SpoolID        = string.Empty;
            this.PolicyID       = string.Empty;
            this.PageNumber     = -1;
            this.DetectionCount = 0;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
