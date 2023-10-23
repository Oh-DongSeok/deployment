namespace FXKIS.SmartWhere.Metadata.DatabaseConstants.PrnInfo
{
    public struct Table
    {
        public const string Name = @"PRNINFO";
    }

    public struct Query
    {
        public const string InsertRow = @"INSERT INTO PRNINFO                    " +
                                        @"(rcdTime,    jobTime,                  " +
                                        @" uuId,       userId,                   " +
                                        @" spoolNm,    docNm,                    " +
                                        @" totalPages, copies,                   " +
                                        @" colorMode,  destColorMode,            " +
                                        @" duplexMode, destDuplexMode,           " +
                                        @" nup,        destNup,                  " +
                                        @" userIp,     queue,                    " +
                                        @" jobStatus,  REMAIN_DAY,               " +
                                        @" printNm,    backupStatus, flag,       " +
                                        @" serverIdx,                            " +
                                        @" jobType,    driverType,   printValue) " +
                                        @"VALUES ({0})                           ";
    }

    public struct Parameter
    {
        public const string ReceivedTime  = @"@p_rcdTime";
        public const string JobTime       = @"@p_jobTime";
        public const string UUID          = @"@p_uuId";
        public const string UserID        = @"@p_userId";
        public const string SpoolName     = @"@p_spoolNm";
        public const string DocumentName  = @"@p_docNm";
        public const string TotalPages    = @"@p_totalPages";
        public const string Copies        = @"@p_copies";
        public const string Color         = @"@p_colorMode";
        public const string DestColor     = @"@p_destColorMode";
        public const string Duplex        = @"@p_duplexMode";
        public const string DestDuplex    = @"@p_destDuplexMode";
        public const string Nup           = @"@p_nup";
        public const string DestNup       = @"@p_destNup";
        public const string UserIPAddress = @"@p_userIp";
        public const string ServerIndex   = @"@p_serverIdx";
        public const string Queue         = @"@p_queue";
        public const string JobStatus     = @"@p_jobStatus";
        public const string RemainDay     = @"@p_REMAIN_DAY";
    }
}
