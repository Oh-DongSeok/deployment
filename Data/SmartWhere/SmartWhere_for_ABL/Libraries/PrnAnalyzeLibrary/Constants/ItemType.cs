namespace FXKIS.PDL.Analyze
{
    using System;



    public struct ItemType
    {
        #region Enumerations

        public enum PJL
        {
            Unknown,
            All,
            Date,
            Time,
            DocumentName,
            Qty,
            Copies,
            Duplex,
            Binding,
            Nup,
            UserID
        }

        public enum PCLXL
        {
            Unknown,
            All,
            ColorType, // FXPC=01 / 03
        }

        #endregion Enumerations



        #region Static Methods

        public static PJL StringToPJL (string strType)
        {
            if (string.IsNullOrWhiteSpace(strType) == true)
            {
                throw new ArgumentNullException("string strType");
            }

            strType = strType.Trim().ToUpper();

            switch (strType)
            {
                case PDL.Constants.PJLVariable.JobAccountingUserName:
                    return PJL.UserID;

                case PDL.Constants.PJLVariable.Date:
                    return PJL.Date;

                case PDL.Constants.PJLVariable.Time:
                    return PJL.Time;

                case PDL.Constants.PJLVariable.DocumentName:
                    return PJL.DocumentName;

                case PDL.Constants.PJLVariable.Quantity:
                    return PJL.Qty;

                case PDL.Constants.PJLVariable.Copies:
                    return PJL.Copies;

                case PDL.Constants.PJLVariable.Duplex:
                    return PJL.Duplex;

                case PDL.Constants.PJLVariable.Binding:
                    return PJL.Binding;

                case PDL.Constants.PJLVariable.FxJobNUp:
                    return PJL.Nup;

                default:
                    return PJL.Unknown;
            }
        }

        #endregion Static Methods
    }
}
