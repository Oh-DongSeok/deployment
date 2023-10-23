namespace FXKIS.SmartWhere.Metadata
{
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.DBBridge;
    using FXKIS.SmartWhere.Policy;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;



    public class PrnInfoDatabaseManager : PrnInfoManagerBase
    {
        #region Constants

        private const string SecretKeyForAES256      = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";
        private const int    DefaultSqlParameterSize = 1000;

        #endregion Constants



        #region Properties

        private string DBBridgeHost { get; set; }
        private int    DBBridgePort { get; set; }

        #endregion Properties



        #region Constructors

        public PrnInfoDatabaseManager (DatabaseEnvironment database) : base(ManagerType.Database)
        {
            this.DBBridgeHost = database.Host;
            this.DBBridgePort = database.Port;
        }

        #endregion Constructors



        #region Methods
        
        public override bool Insert(PrnInformation prn, PrnPrintOptionPolicy policy, int serverIdx = 0)
        {
            string destColor = string.Empty;
            string destDuplex = string.Empty;
            string destNup = string.Empty;

            if (policy.ForceBlackWhite == true)
            {
                destColor = @"B";
            }
            else
            {
                destColor = prn.ColorMode.ToColorString();
            }

            switch (policy.ForceDuplex)
            {
                case PrnPrintOptionPolicy.ForceDuplexType.Simplex:

                    destDuplex = PrnInformation.DuplexType.Simplex.ToDuplexString(); 
                    break;

                case PrnPrintOptionPolicy.ForceDuplexType.DuplexLongEdge:

                    destDuplex = PrnInformation.DuplexType.DuplexLongEdge.ToDuplexString();
                    break;

                case PrnPrintOptionPolicy.ForceDuplexType.DuplexShortEdge:

                    destDuplex = PrnInformation.DuplexType.DuplexShortEdge.ToDuplexString();
                    break;

                default:
                    destDuplex = prn.DuplexMode.ToDuplexString();
                    break;
            }

            if(policy.Force2Up == true)
            {
                if(prn.Nup == 1)
                {
                    destNup = 2.ToString();
                }
            }
            else
            {
                destNup = prn.Nup.ToString();
            }

            try
            {
                List<string> listValues = new List<string>
                {
                    prn.ReceivedTime.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                    prn.ReceivedTime.ToString("yyyyMMddHHmmssfff"),
                    prn.UUID,
                    prn.UserID,
                    prn.SpoolName,
                    prn.DocumentName,
                    prn.TotalPages.ToString(),
                    prn.Copies.ToString(),
                    prn.ColorMode.ToColorString(),
                    destColor,
                    prn.DuplexMode.ToDuplexString(),
                    destDuplex,
                    prn.Nup.ToString(),
                    destNup,
                    prn.UserIPAddress,
                    prn.Queue,
                    prn.GetJobStatus().ToString(),
                    prn.GetRemainDays().ToString(),
                    "P0001",
                    0.ToString(),
                    "A",
                    serverIdx.ToString(),
                    0.ToString(),
                    "swPrn_MMD2",
                    0.ToString()
                };

                // [ in SQL query ] 값 안에 '(quote)가 들어가는 경우
                for (int i = 0 ; i < listValues.Count ; i++)
                {
                    listValues[i] = listValues[i].Replace("'", "''");
                }

                // [ in SQL query ] 값 안에 ,(comma)가 들어가는 경우 
                string strValue = "'" + string.Join("','", listValues) + "'";

                string queryString = string.Format(DatabaseConstants.PrnInfo.Query.InsertRow, strValue);

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteCommand, queryString);
                
                using (BridgeRequestor requestor = new BridgeRequestor(this.DBBridgeHost, this.DBBridgePort))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, PrnInfoDatabaseManager.SecretKeyForAES256);
                    return (responseBridge.AffectedRows > 0);
                }
            }
            catch
            {
                return false;
            }
        }

        #endregion Methods
    }
    

    /// <summary>
    /// static class :: DatabaseEnumerationUtility (for Extension Methods)
    /// </summary>
    public static class DatabaseEnumerationUtility
    {
        public static string ToColorString (this PrnInformation.ColorType color)
        {
            switch (color)
            {
                case PrnInformation.ColorType.Color:
                    return PrnInformation.DBValueColor;

                case PrnInformation.ColorType.Grayscale:
                    return PrnInformation.DBValueBlackWhite;

                default:
                    return string.Empty;
            }
        }

        public static string ToDuplexString (this PrnInformation.DuplexType duplex)
        {
            switch (duplex)
            {
                case PrnInformation.DuplexType.Simplex:
                    return PrnInformation.DBValueSimplex;

                case PrnInformation.DuplexType.DuplexLongEdge:
                    return PrnInformation.DBValueDuplexLongEdge;

                case PrnInformation.DuplexType.DuplexShortEdge:
                    return PrnInformation.DBValueDuplexShortEdge;

                default:
                    return string.Empty;
            }
        }
    }
}
