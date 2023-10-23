namespace FXKIS.SmartWhere.PostSchedule.StoredProcedure
{
    using System;
    using System.Data;
    using System.Data.SqlClient;



    public static class ProcedureFunction
    {
        #region Constants

        private const int DefaultDataSize = 1000;

        #endregion Constants



        #region Static Methods

        public static SqlParameter CreateInputParameter (string name, object value, SqlDbType type = SqlDbType.NVarChar, int size = ProcedureFunction.DefaultDataSize)
        {
            return new SqlParameter
            {
                ParameterName = name,
                Direction     = ParameterDirection.Input,
                SqlDbType     = type,
                Size          = size,
                Value         = value
            };
        }

        public static SqlParameter CreateOutputParameter (string name, SqlDbType type = SqlDbType.NVarChar, int size = ProcedureFunction.DefaultDataSize)
        {
            return new SqlParameter
            {
                ParameterName = name,
                Direction     = ParameterDirection.Output,
                SqlDbType     = type,
                Size          = size
            };
        }

        public static T ReadValueFromParameter<T> (SqlParameterCollection parameters, string paramName, T defaultValue)
        {
            if (parameters.Contains(paramName) == false)
            {
                return defaultValue;
            }

            Type type = typeof(T);

            object objParam = parameters[paramName].Value;

            if (objParam is int && type == typeof(int))
            {
                return (T)Convert.ChangeType((int)objParam, typeof(T));
            }

            string strParam = objParam as string;

            if (type == typeof(string))
            {
                return (T)Convert.ChangeType(strParam, typeof(T));
            }
            else if (type == typeof(int))
            {
                int integerValue = 0;

                if (int.TryParse(strParam, out integerValue))
                {
                    return (T)Convert.ChangeType(integerValue, typeof(T));
                }
            }

            return defaultValue;
        }

        #endregion Static Methods
    }
}
