namespace FXKIS.SmartWhere.Gate
{
    using System;



    public class GateException : Exception
    {
        #region Constructors

        public GateException() : base()
        {
        }

        public GateException(string message) : base(message)
        {
        }

        public GateException(string message, Exception innerException) : base(message, innerException)
        {
        }

        #endregion Constructors
    }
}
