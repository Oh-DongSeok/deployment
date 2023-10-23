namespace FXKIS.SmartWhere.Background.DatabaseConstants
{
    #region Constants

    public struct Column
    {
        public struct PrnInfo
        {
            public const string UUID          = @"UUID";         // @"uuId";
            public const string RcdTime       = @"RCDTIME";      // @"rcdTime";
            public const string SpoolName     = @"SPOOLNM";      // @"spoolNm";
            public const string UserIPAddress = @"USERIP";       // @"userIp";    
            public const string DriverType    = @"DRIVERTYPE";   // @"driverType";
            public const string BackupStatus  = @"BACKUPSTATUS"; // @"backupStatus";
            public const string RemainHours   = @"REMAIN_DAY";   // @"REMAIN_DAY";
            public const string ServerIdx     = @"SERVERIDX";    // @"serverIdx";
        }
    }

    public struct Query
    {
        public const string SelectPrnInfo                   = @"SELECT uuId, rcdTime, spoolNm, userIp, driverType, backupStatus, REMAIN_DAY, serverIdx FROM PRNINFO";

        public const string FormatSelectUserCount           = @"SELECT COUNT(*) FROM T_LX_USER_DETAIL WHERE USERID = '{0}'";
        public const string FormatSelectUserIdByMailAddress = @"SELECT USERID FROM T_LX_USER_DETAIL WHERE EMAIL = '{0}'";
        public const string FormatDeletePrnInfoByUuidList   = @"DELETE FROM PRNINFO WHERE uuId IN ({@Values})";
        public const string FormatDeletePrnInfoByUUIDs      = @"DELETE FROM PRNINFO WHERE uuId IN ({0})";
    }

    public struct Parameter
    {
        public const string AddArray       = "{@Values}";
        public const string FormatAddArray = "@Values{0}";
    }

    #endregion Constants
}
