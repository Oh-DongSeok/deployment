namespace FXKIS.SmartWhere.PostSchedule.StoredProcedure
{
    #region Structures for Stored Procedure Constants

    public struct GetUsagePrnCnt
    {
        public const string Name = @"SP_Get_Usage_Prn_Cnt";

        public const string InputUserID   = @"@param_UserId";
        public const string InputDeviceIP = @"@param_DeviceIp";

        public const string OutputUserID         = @"@r_UserId";
        public const string OutputOverCountPrint = @"@r_OverCountPrint";
        public const string OutputUsedGray       = @"@r_UsedGray";
        public const string OutputUsedColor      = @"@r_UsedColor";
        public const string OutputLimitGray      = @"@r_LimitGray";
        public const string OutputLimitColor     = @"@r_LimitColor";
        public const string OutputPrnCount       = @"@r_PrnCount";
        public const string OutputFunctionCtrl   = @"@r_FunctionCtrl";
        public const string OutputStatus         = @"@r_Status";
        public const string OutputResultMsg      = @"@r_ResultMsg";
    }

    public struct GetPrnListPolicy
    {
        public const string Name = @"SP_Get_Prn_List_Policy";

        public const string InputUserID       = @"@param_UserId";
        public const string InputDeviceIP     = @"@param_DeviceIp";
        public const string InputLimitCount   = @"@param_LimitCount";
        public const string InputSorting      = @"@param_Sorting";
        public const string InputServiceIndex = @"@param_ServerIdx";

        public const string OutputDefaultBlack = @"@r_DefaultBlack";
        public const string OutputForcedBlack  = @"@r_ForcedBlack";
        public const string OutputForcedDuplex = @"@r_ForcedDuplex";
        public const string OutputForced2Up    = @"@r_Forced2Up";
        public const string OutputPrintAgain   = @"@r_PrintAgain";
        public const string OutputFunctionCtrl = @"@r_FunctionCtrl";
        public const string OutputPrnCount     = @"@r_PrnCount";
        public const string OutputUserID       = @"@r_UserId";
        public const string OutputStatus       = @"@r_Status";
        public const string OutputResultMsg    = @"@r_ResultMsg";

        public const string ColumnRcdTime    = @"rcdTime";
        public const string ColumnUUID       = @"uuId";
        public const string ColumnDocName    = @"docNm";
        public const string ColumnTotalPages = @"totalPages";
        public const string ColumnUseYN      = @"useYn";
        public const string ColumnSrcColor   = @"srcColor";
        public const string ColumnDestColor  = @"destColor";
        public const string ColumnSrcDuplex  = @"srcDuplex";
        public const string ColumnSrcNup     = @"srcNup";
        public const string ColumnDestNup    = @"destNup";
        public const string ColumnPrnType    = @"prnType";
        public const string ColumnDriverType = @"driverType";
        public const string ColumnCopies     = @"copies";
        public const string ColumnJobStatus  = @"jobStatus";
    }

    public struct RegisterCard
    {
        public const string Name                   = @"SP_Register_Card";
        public const string NameForActiveDirectory = @"SP_Register_Card_AD";

        public const string InputUserID = @"@param_UserId";
        public const string InputUserPW = @"@param_UserPw";
        public const string InputCardID = @"@param_CardId";

        public const string OutputStatus    = @"@r_Status";
        public const string OutputResultMsg = @"@r_ResultMsg";
    }

    public struct PrintAll
    {
        public const string NameForGetPrnList           = @"SP_Get_Prn_List_for_Print_All";
        public const string NameForGetAvailableColorCnt = @"SP_Get_Available_Color_Cnt";
        public const string NameForIsLinkedToImageLog   = @"SP_Is_Linked_To_Image_Log";

        public const string InputUserID       = @"@param_UserId";
        public const string InputDeviceIP     = @"@param_DeviceIp";
        public const string InputWsIp         = @"@param_WsIp";
        public const string InputDeviceColor  = @"@param_DeviceColor";
        public const string InputServiceIndex = @"@param_ServerIdx";

        public const string OutputDefaultBlack = @"@r_DefaultBlack";
        public const string OutputForcedBlack  = @"@r_ForcedBlack";
        public const string OutputForcedDuplex = @"@r_ForcedDuplex";
        public const string OutputForced2Up    = @"@r_Forced2Up";
        public const string OutputPrintAgain   = @"@r_PrintAgain";
        public const string OutputFunctionCtrl = @"@r_FunctionCtrl";
        public const string OutputPrnCount     = @"@r_PrnCount";
        public const string OutputUserID       = @"@r_UserId";
        public const string OutputStatus       = @"@r_Status";
        public const string OutputResultMsg    = @"@r_ResultMsg";

        public const string OutputLimitColor = @"@r_LimitColor";
        public const string OutputLimitGray  = @"@r_LimitGray";
        public const string OutputUsedColor  = @"@r_UsedColor";
        public const string OutputUsedGray   = @"@r_UsedGray";

        public const string OutputModelCode = @"@r_ModelCode";

        public const string ColumnUUID       = @"uuId";
        public const string ColumnSpoolName  = @"spoolNm";
        public const string ColumnColorMode  = @"colorMode";
        public const string ColumnDuplex     = @"duplexMode";
        public const string ColumnNUp        = @"nUp";
        public const string ColumnTotalPages = @"totalPages"; // pageCnt
        public const string ColumnCopies     = @"copies";     // printCnt
        public const string ColumnQueue      = @"queue";
        public const string ColumnPrnType    = @"prnType";
        public const string ColumnDriverType = @"driverType";
        public const string ColumnDocName    = @"docNm";
        public const string ColumnUserIP     = @"userIp";
    }

    public struct PrintSelected
    {
        public const string Name = @"SP_Get_Prn_for_Print_Selected";

        public const string InputUserID      = @"@param_UserID";
        public const string InputFileUUID    = @"@param_fileUUID";

        public const string OutputUUID       = @"@r_UUID";
        public const string OutputSpoolName  = @"@r_SpoolName";
        public const string OutputDocName    = @"@r_DocName";
        public const string OutputTotalPages = @"@r_TotalPages";
        public const string OutputColorMode  = @"@r_ColorMode";
        public const string OutputDuplex     = @"@r_Duplex";
        public const string OutputNUp        = @"@r_NUp";
        public const string OutputCopies     = @"@r_Copies";
        public const string OutputQueue      = @"@r_Queue";
        public const string OutputUserIP     = @"@r_UserIP";
        public const string OutputDriverType = @"@r_DriverType";

        public const string OutputStatus    = @"@r_Status";
        public const string OutputResultMsg = @"@r_ResultMsg";
    }

    public struct DeleteSelected
    {
        public const string Name = @"SP_Delete_Selected";

        public const string InputUserID      = @"@param_UserID";
        public const string InputCommaString = @"@param_CommaString";

        public const string ColumnSpoolName  = @"spoolNm";
        public const string ColumnQueue      = @"queue";
        public const string ColumnUserIP     = @"userIp";
        public const string ColumnDriverType = @"driverType";
    }

    public struct UpdateJobStatus
    {
        public const string Name = "SP_Update_Job_Status";

        public const string InputCommaString = "@param_CommaString";
    }

    #endregion Structures for Stored Procedure Constants
}
