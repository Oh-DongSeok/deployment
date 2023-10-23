namespace FXKIS.SmartWhere.DBBridge
{
    using System.Collections.Generic;



    public class ResponseRowData
    {
        #region Properties

        // Dictionary<ColumnName, Value>
        public Dictionary<string, object> DictionaryRowData { get; private set; }

        #endregion Properties



        #region Constructors

        public ResponseRowData ()
        {
            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeCollections ()
        {
            this.DictionaryRowData = new Dictionary<string, object>();
        }

        #endregion Methods
    }
}
