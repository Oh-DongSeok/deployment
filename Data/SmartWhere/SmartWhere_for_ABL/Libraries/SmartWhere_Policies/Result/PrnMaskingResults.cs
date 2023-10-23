namespace FXKIS.SmartWhere.Policy
{
    using System.Collections.Generic;

    using Common.Extension;



    public class PrnMaskingResults
    {
        #region Properties

        public List<PrnMaskingResult> Results { get; set; }

        #endregion Properties



        #region Constructors

        public PrnMaskingResults ()
        {
            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeCollections ()
        {
            this.Results = new List<PrnMaskingResult>();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}