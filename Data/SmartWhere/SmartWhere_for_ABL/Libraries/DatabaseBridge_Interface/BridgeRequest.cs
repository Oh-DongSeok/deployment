namespace FXKIS.SmartWhere.DBBridge
{
    using System;
    using System.Collections.Generic;

    using Common.Extension;



    public class BridgeRequest
    {
        #region Enumerations

        public enum RequestType
        {
            Unknown,

            // "INSERT | UPDATE | DELETE" query -> ExecuteNonQuery() -> affectedRow 반환
            ExecuteCommand,

            // "EXEC" Stored Procedure -> ExecuteNonQuery() -> Output Parameter 반환
            ExecuteStoredProcedure,

            // "SELECT" query -> ExecuteReader() -> 모든 row 값 반환
            ReadData,

            // "EXEC" Stored Procedure -> ExecuteReader() -> 모든 row 값 & Output Parameter 반환
            ReadFromStoredProcedure
        }

        #endregion Enumerations



        #region Properties

        public RequestType Type    { get; set; }

        // "TYPE = NORMAL"           : QUERY
        // "TYPE = STORED PROCEDURE" : NAME of STORED PROCEDURE
        public string      Message { get; set; }

        #endregion Properties



        #region Collections

        // KEY:   Parameter Name
        // VALUE: Parameter Type (Input / Output / InputOutput)
        public SortedDictionary<string, BridgeParameterInfo> Parameters { get; private set; }

        #endregion Collections



        #region Constructors

        public BridgeRequest ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public BridgeRequest (RequestType type, string message) : this()
        {
            if (string.IsNullOrWhiteSpace(message) == true)
            {
                throw new ArgumentNullException("string message");
            }

            this.Type    = type;
            this.Message = message;
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Type    = RequestType.Unknown;
            this.Message = string.Empty;
        }

        private void InitializeCollections ()
        {
            this.Parameters = new SortedDictionary<string, BridgeParameterInfo>();
        }

        public void AddParameter (BridgeParameterInfo param)
        {
            if (param == null)
            {
                throw new ArgumentNullException("BridgeParameterInfo param");
            }

            this.Parameters.Add(param.Name, param);
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}
