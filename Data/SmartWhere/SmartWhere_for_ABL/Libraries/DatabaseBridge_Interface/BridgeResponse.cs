namespace FXKIS.SmartWhere.DBBridge
{
    using System.Collections.Generic;

    using Common.Extension;



    public class BridgeResponse
    {
        #region Enumerations

        public enum StatusType
        {
            Unknown,
            Success,
            Failure
        }

        #endregion Enumerations



        #region Constants

        #endregion Constants



        #region Properties

        // SUCCESS | FAILURE
        public StatusType            Status       { get; set; }

        // REQUEST TYPE => "ExecuteCommand"
        public int                   AffectedRows { get; set; }

        #endregion Properties



        #region Collections

        // KEY:   Parameter Name
        // VALUE: Parameter Type (Output / InputOutput)
        public SortedDictionary<string, object>     Parameters  { get; private set; }

        // REQUEST TYPE => "ReadData"
        public List<ResponseRowData>                ListRowData { get; private set; }

        #endregion Collections



        #region Constructors

        public BridgeResponse ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Status = StatusType.Unknown;
        }

        private void InitializeCollections ()
        {
            this.Parameters  = new SortedDictionary<string, object>();
            this.ListRowData = new List<ResponseRowData>();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
