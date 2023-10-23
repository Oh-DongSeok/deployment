namespace FXKIS.SmartWhere.DBBridge
{
    using System;
    using System.Data;
    using System.Data.SqlClient;
    using System.IO;

    using Common.Extension;



    public class BridgeParameterInfo
    {
        #region Enumerations

        public enum ParameterType
        {
            Unknown,
            Input,
            Output,
            InputOutput
        }

        public enum ParameterDataType
        {
            Unknown,
            VarChar,
            NVarChar,
            Integer,
            Float,
            BigInt,
            DateTime,
            TinyInt
        }

        #endregion Enumerations



        #region Constants

        private const int DefaultDataSize = 1000;

        #endregion Constants



        #region Properties
        
        public string            Name     { get; set; }
        public ParameterType     Type     { get; set; }
        public ParameterDataType DataType { get; set; }
        public object            Value    { get; set; }

        public int Size
        {
            get
            {
                return this._Size;
            }
            set
            {
                if (value < 1)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 1 ({0} < 1)", value));
                }

                this._Size = value;
            }
        }
        private int _Size = BridgeParameterInfo.DefaultDataSize;

        #endregion Properties



        #region Constructors

        public BridgeParameterInfo ()
        {
            this.InitializeProperties();
        }

        public BridgeParameterInfo (string name, ParameterType type, ParameterDataType dataType = ParameterDataType.NVarChar, int size = BridgeParameterInfo.DefaultDataSize, object value = null) : this()
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            this.Name     = name;
            this.Type     = type;
            this.DataType = dataType;
            this.Size     = size;

            if (value != null)
            {
                this.Value = value;
            }
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Name     = string.Empty;
            this.Type     = ParameterType.Unknown;
            this.DataType = ParameterDataType.Unknown;
            this.Size     = BridgeParameterInfo.DefaultDataSize;
            this.Value    = null;
        }

        public ParameterDirection GetSqlDirection ()
        {
            return this.Type.GetSqlDirection();
        }

        public SqlDbType GetSqlDbType ()
        {
            return this.DataType.GetSqlDbType();
        }

        public SqlParameter ToSqlParameter ()
        {
            try
            {
                SqlParameter param = new SqlParameter
                {
                    ParameterName = this.Name,
                    Direction     = this.GetSqlDirection(),
                    SqlDbType     = this.GetSqlDbType(),
                    Size          = this.Size
                };

                if (this.Value != null)
                {
                    param.Value = this.Value;
                }

                return param;
            }
            catch
            {
                return null;
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static ParameterDirection GetSqlDirectionByType (BridgeParameterInfo.ParameterType type)
        {
            return type.GetSqlDirection();
        }

        public static SqlDbType GetSqlDbTypeByDataType (BridgeParameterInfo.ParameterDataType type)
        {
            return type.GetSqlDbType();
        }

        #endregion Static Methods
    }



    /// <summary>
    /// static class :: BridgeParameterInfoUtility (for Extension Methods)
    /// </summary>
    public static class BridgeParameterInfoUtility
    {
        public static ParameterDirection GetSqlDirection (this BridgeParameterInfo.ParameterType type)
        {
            switch (type)
            {
                case BridgeParameterInfo.ParameterType.Input:
                    return ParameterDirection.Input;

                case BridgeParameterInfo.ParameterType.Output:
                    return ParameterDirection.Output;

                case BridgeParameterInfo.ParameterType.InputOutput:
                    return ParameterDirection.InputOutput;

                default:
                    throw new InvalidDataException(string.Format("Convert failed (TYPE: {0})", type.ToString()));
            }
        }

        public static SqlDbType GetSqlDbType (this BridgeParameterInfo.ParameterDataType dataType)
        {
            switch (dataType)
            {
                case BridgeParameterInfo.ParameterDataType.VarChar:
                    return SqlDbType.VarChar;

                case BridgeParameterInfo.ParameterDataType.NVarChar:
                    return SqlDbType.NVarChar;

                case BridgeParameterInfo.ParameterDataType.Integer:
                    return SqlDbType.Int;

                case BridgeParameterInfo.ParameterDataType.Float:
                    return SqlDbType.Float;

                case BridgeParameterInfo.ParameterDataType.BigInt:
                    return SqlDbType.BigInt;

                case BridgeParameterInfo.ParameterDataType.DateTime:
                    return SqlDbType.DateTime;

                case BridgeParameterInfo.ParameterDataType.TinyInt:
                    return SqlDbType.TinyInt;

                default:
                    throw new InvalidDataException(string.Format("Convert failed (TYPE: {0})", dataType.ToString()));
            }
        }
    }
}