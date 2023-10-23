namespace FXKIS.SmartWhere.Policy.DatabaseConstants.UserPolicy
{
    public struct Table
    {
        public const string Name = @"[XPMS_STD].[dbo].[T_LX_USER_POLICY_M]";
    }

    public struct Query
    {
        public const string SelectByUserID = @"SELECT START_DATE, END_DATE, POID,                " +
                                             @"       EXCEPTIONAL_USER_YN, EXCEPTIONAL_IP,       " +
                                             @"       HEADERNUM,    HFID1, HFID2, HFID3,         " +
                                             @"       FOOTERNUM,    HFID4, HFID5, HFID6,         " +
                                             @"       WATERMARKNUM, WMID1, WMID2, WMID3, WMID4   " +
                                             @"FROM   [XPMS_STD].[dbo].[T_LX_USER_POLICY_M]      " +
                                             @"WHERE  USERID = @p_userid                         ";
    }

    public struct Parameter
    {
        public const string UserID = "@p_userid";
    }

    public struct Column
    {
        public const string StartDate               = @"START_DATE";
        public const string EndDate                 = @"END_DATE";

        public const string IsExceptional           = @"EXCEPTIONAL_USER_YN";
        public const string IsExceptionalByPolicy   = @"EXCEPTIONAL_POLICY";
        public const string IsExceptionalToImageLog = @"EXCEPTIONAL_IMAGELOG";
        public const string ExceptionalIPAddress    = @"EXCEPTIONAL_IP";

        public const string PrintOptionID           = @"POID";

        public const string HeaderCount             = @"HEADERNUM";
        public const string HeaderID1               = @"HFID1";
        public const string HeaderID2               = @"HFID2";
        public const string HeaderID3               = @"HFID3";

        public const string FooterCount             = @"FOOTERNUM";
        public const string FooterID1               = @"HFID4";
        public const string FooterID2               = @"HFID5";
        public const string FooterID3               = @"HFID6";

        public const string WatermarkCount          = @"WATERMARKNUM";
        public const string WatermarkID1            = @"WMID1";
        public const string WatermarkID2            = @"WMID2";
        public const string WatermarkID3            = @"WMID3";
        public const string WatermarkID4            = @"WMID4";
    }
}



namespace FXKIS.SmartWhere.Policy.DatabaseConstants.PrintOptionPolicy
{
    public struct Table
    {
        public const string Name = @"[XPMS_STD].[dbo].[T_LX_PRINT_OPTION]";
    }

    public struct Query
    {
        public const string SelectByID = @"SELECT POTITLE,        TONER_SAVE,    REMAIN_DAY,   " +
                                         @"       FORCED_BLACK,   FORCED_DUPLEX, FORCED_TWOUP  " +
                                         @"FROM   [XPMS_STD].[dbo].[T_LX_PRINT_OPTION]         " +
                                         @"WHERE  POID = @p_poid                               ";
    }

    public struct Parameter
    {
        public const string ID = "@p_poid";
    }

    public struct Column
    {
        public const string Title           = @"POTITLE";
        public const string ForceBlackWhite = @"FORCED_BLACK";
        public const string ForceDuplex     = @"FORCED_DUPLEX";
        public const string Force2up        = @"FORCED_TWOUP";
        public const string MassChecked     = @"MASS_LIMIT_YN";
        public const string MassLimit       = @"MASS_LIMIT_CNT";
        public const string ColorChecked    = @"COLOR_LIMIT_YN";
        public const string ColorLimit      = @"COLOR_LIMIT_CNT";
        public const string TonerSave       = @"TONER_SAVE";
        public const string RemainDay       = @"REMAIN_DAY";
    }
}



namespace FXKIS.SmartWhere.Policy.DatabaseConstants.HeaderFooterPolicy
{
    public struct Table
    {
        public const string Name = @"[XPMS_STD].[dbo].[T_LX_HEADERFOOTER]";
    }

    public struct Query
    {
        public const string SelectByID  = @"SELECT TITLE,       HFTYPE,       LOCATION,     " +
                                          @"       PCTIMEYN,    PCTIMENUM,    PCTIMEFORMAT, " +
                                          @"       DOCNAMEYN,   DOCNAMENUM,                 " +
                                          @"       USERIDYN,    USERIDNUM,                  " + 
                                          @"       PCIPYN,      PCIPNUM,      IPMASKING,    " +
                                          @"       USESTRINGYN, USESTRINGNUM, USESTRING,    " +
                                          @"       HFFONT,      HFCOLOR,      HFSIZE        " +
                                          @"FROM   [XPMS_STD].[dbo].[T_LX_HEADERFOOTER]     " +
                                          @"WHERE  HFID = @p_hfid                           ";

        public const string SelectByIDs = @"SELECT TITLE,       HFTYPE,       LOCATION,     " +
                                          @"       PCTIMEYN,    PCTIMENUM,    PCTIMEFORMAT, " +
                                          @"       DOCNAMEYN,   DOCNAMENUM,                 " +
                                          @"       USERIDYN,    USERIDNUM,                  " +
                                          @"       PCIPYN,      PCIPNUM,      IPMASKING,    " +
                                          @"       USESTRINGYN, USESTRINGNUM, USESTRING,    " +
                                          @"       HFFONT,      HFCOLOR,      HFSIZE        " +
                                          @"FROM   [XPMS_STD].[dbo].[T_LX_HEADERFOOTER]     " +
                                          @"WHERE  HFID IN ({0})                            ";
    }

    public struct Parameter
    {
        public const string ID = "@p_hfid";
    }

    public struct Column
    {
        public const string Type                 = @"HFTYPE";
        public const string Title                = @"TITLE";
        public const string Location             = @"LOCATION";
        public const string PCTimeUsed           = @"PCTIMEYN";
        public const string PCTimeOrder          = @"PCTIMENUM";
        public const string PCTimeFormat         = @"PCTIMEFORMAT";
        public const string DocumentNameUsed     = @"DOCNAMEYN";
        public const string DocumentNameOrder    = @"DOCNAMENUM";
        public const string UserIDUsed           = @"USERIDYN";
        public const string UserIDOrder          = @"USERIDNUM";
        public const string IPAddressUsed        = @"PCIPYN";
        public const string IPAddressOrder       = @"PCIPNUM";
        public const string IPAddressMaskingType = @"IPMASKING";
        public const string CustomStringUsed     = @"USESTRINGYN";
        public const string CustomStringOrder    = @"USESTRINGNUM";
        public const string CustomString         = @"USESTRING";
        public const string FontName             = @"HFFONT";
        public const string FontColor            = @"HFCOLOR";
        public const string FontSize             = @"HFSIZE";
    }
}



namespace FXKIS.SmartWhere.Policy.DatabaseConstants.WatermarkPolicy
{
    public struct Table
    {
        public const string Name = @"[XPMS_STD].[dbo].[T_LX_WATERMARK]";
    }
    public struct Query
    {
        public const string SelectByID  = @"SELECT TITLE,          WMTYPE,       LOCATION, " +
                                          @"       SYSFILENAME,    IMAGESIZE,              " + // ImageInfo
                                          @"       WMTITLETYPE,    WMTITLE,                " + // TextInfo
                                          @"       TXTFONT,        TXTCOLOR,     TXTSIZE,  " +
                                          @"       TXTBOLD,        TXTITALIC,              " + // Font
                                          @"       TRANSPARENTRATE,                        " +
                                          @"       PAGEREPEATYN,   PAGEREPEATTYPE,         " +
                                          @"       GRIDTYPE,       ANGLE,                  " +
                                          @"       HORIZONTAL_ADJ, VERTICAL_ADJ            " +
                                          @"FROM   [XPMS_STD].[dbo].[T_LX_WATERMARK]       " +
                                          @"WHERE  WMID = @p_wmid                          ";

        public const string SelectByIDs = @"SELECT TITLE,          WMTYPE,       LOCATION, " +
                                          @"       SYSFILENAME,    IMAGESIZE,              " + // ImageInfo
                                          @"       WMTITLETYPE,    WMTITLE,                " + // TextInfo
                                          @"       TXTFONT,        TXTCOLOR,     TXTSIZE,  " +
                                          @"       TXTBOLD,        TXTITALIC,              " + // Font
                                          @"       TRANSPARENTRATE,                        " +
                                          @"       PAGEREPEATYN,   PAGEREPEATTYPE,         " +
                                          @"       GRIDTYPE,       ANGLE,                  " +
                                          @"       HORIZONTAL_ADJ, VERTICAL_ADJ            " +
                                          @"FROM   [XPMS_STD].[dbo].[T_LX_WATERMARK]       " +
                                          @"WHERE  WMID IN ({0})                           ";
    }

    public struct Parameter
    {
        public const string ID = "@p_wmid";
    }

    public struct Column
    {
         public const string Type                 = @"WMTYPE";
         public const string Title                = @"TITLE";
         public const string Location             = @"LOCATION";
         public const string ImageFileName        = @"SYSFILENAME";
         public const string ImageSize            = @"IMAGESIZE";
         public const string TextType             = @"WMTITLETYPE";
         public const string CustomString         = @"WMTITLE";
         public const string FontName             = @"TXTFONT";
         public const string FontColor            = @"TXTCOLOR";
         public const string FontSize             = @"TXTSIZE";
         public const string FontBold             = @"TXTBOLD";
         public const string FontItalic           = @"TXTITALIC";
         public const string Transparency         = @"TRANSPARENTRATE";
         public const string PageRepetitionUsed   = @"PAGEREPEATYN";
         public const string PageRepetiton        = @"PAGEREPEATTYPE";
         public const string Grid                 = @"GRIDTYPE";
         public const string Angle                = @"ANGLE";
         public const string AdjustmentHorizontal = @"HORIZONTAL_ADJ";
         public const string AdjustmentVertical   = @"VERTICAL_ADJ";
    }
}



namespace FXKIS.SmartWhere.Policy.DatabaseConstants.SecurityPolicy
{
    using System.Data;
    using System.Data.SqlClient;



    public struct StoredProcedure
    {
        #region Enumerations

        public enum ParameterType
        {
            Unknown,
            InputUserID,
            InputTemplateCD,
            OutputUserID,
            OutputTemplateCD,
            OutputResultCode,
            OutputResultDescription
        }

        #endregion Enumerations



        #region Constants

        // is_already exists
        public const string GetSecurityTemplateCdByUserID   = @"[ILSDB].[dbo].[SP_Get_Security_Process_By_UserID_____only_output_TemplateCD]";

        #endregion Constants



        #region Static Methods

        public static SqlParameter CreateSqlParameter (ParameterType paramType, object value = null)
        {
            ParameterDirection direction;
            SqlDbType          dbType;

            string name = string.Empty;
            int    size = 0;


            switch (paramType)
            {
                case ParameterType.InputUserID:
                    {
                        direction = ParameterDirection.Input;
                        dbType    = Parameter.DBType.InputUserID;
                        name      = Parameter.Name.InputUserID;
                        size      = Parameter.Size.InputUserID;
                    }
                    break;

                case ParameterType.InputTemplateCD:
                    {
                        direction = ParameterDirection.Input;
                        dbType    = Parameter.DBType.InputTemplateCD;
                        name      = Parameter.Name.InputTemplateCD;
                        size      = Parameter.Size.InputTemplateCD;
                    }
                    break;

                case ParameterType.OutputUserID:
                    {
                        direction = ParameterDirection.Output;
                        dbType    = Parameter.DBType.OutputUserID;
                        name      = Parameter.Name.OutputUserID;
                        size      = Parameter.Size.OutputUserID;
                    }
                    break;

                case ParameterType.OutputTemplateCD:
                    {
                        direction = ParameterDirection.Output;
                        dbType    = Parameter.DBType.OutputTemplateCD;
                        name      = Parameter.Name.OutputTemplateCD;
                        size      = Parameter.Size.OutputTemplateCD;
                    }
                    break;

                case ParameterType.OutputResultCode:
                    {
                        direction = ParameterDirection.Output;
                        dbType    = Parameter.DBType.OutputResultCode;
                        name      = Parameter.Name.OutputResultCode;
                        size      = Parameter.Size.OutputResultCode;
                    }
                    break;

                case ParameterType.OutputResultDescription:
                    {
                        direction = ParameterDirection.Output;
                        dbType    = Parameter.DBType.OutputResultDescription;
                        name      = Parameter.Name.OutputResultDescription;
                        size      = Parameter.Size.OutputResultDescription;
                    }
                    break;

                default:
                    return null;
            }

            if (direction == ParameterDirection.Input && value != null)
            {
                return new SqlParameter()
                {
                    ParameterName = name,
                    SqlDbType     = dbType,
                    Direction     = direction,
                    Size          = size,
                    Value         = value
                };
            }

            return new SqlParameter()
            {
                ParameterName = name,
                SqlDbType     = dbType,
                Direction     = direction,
                Size          = size
            };
        }

        #endregion Static Methods
    }

    public struct Query
    {
        public const string SelectByTemplateCD = @"SELECT A.SecurityCD, B.SecurityNM,        " +
                                                 @"       B.SecurityTP, B.SecurityVL,        " +
                                                 @"       C.YN_Mask,    C.YN_Approval,       " +
                                                 @"       A.ProcessPG,  A.ProcessMK,         " +
                                                 @"       A.LimitCNT,   B.SecurityDesc       " +
                                                 @"FROM   ILSDB.dbo.ILS_SECURITY_TEMPLATE A  " +
                                                 @"       INNER JOIN                         " +
                                                 @"       ILSDB.dbo.ILS_SECURITY_ITEM B      " +
                                                 @"           ON A.SecurityCD = B.SecurityCD " + 
                                                 @"              AND                         " +
                                                 @"              A.SecurityTP = B.SecurityTP " +
                                                 @"       INNER JOIN                         " +
                                                 @"       ILSDB.dbo.ILS_SECURITY_PROCESS C   " +
                                                 @"           ON A.ProcessCD = C.ProcessCD   " +
                                                 @"WHERE  A.TemplateCD = @p_templateCD       ";
    }

    public struct Parameter
    {
        public struct Name
        {
            public const string InputUserID             = @"@p_userid";
            public const string InputTemplateCD         = @"@p_templateCD";
            public const string OutputUserID            = @"@r_userid";
            public const string OutputTemplateCD        = @"@r_templateCD";
            public const string OutputResultCode        = @"@r_resultBool";
            public const string OutputResultDescription = @"@r_resultDesc";
        }

        public struct Size
        {
            public const int InputUserID             = 30;
            public const int InputTemplateCD         = 5;
            public const int OutputUserID            = 30;
            public const int OutputTemplateCD        = 5;
            public const int OutputResultCode        = 5;
            public const int OutputResultDescription = 1000;
        }

        public struct DBType
        {
            public const SqlDbType InputUserID             = SqlDbType.VarChar;
            public const SqlDbType InputTemplateCD         = SqlDbType.Char;
            public const SqlDbType OutputUserID            = SqlDbType.VarChar;
            public const SqlDbType OutputTemplateCD        = SqlDbType.Char;
            public const SqlDbType OutputResultCode        = SqlDbType.VarChar;
            public const SqlDbType OutputResultDescription = SqlDbType.NVarChar;
        }
    }

    public struct Column
    {
         public const string ID            = @"SecurityCD";
         public const string Name          = @"SecurityNM";
         public const string Type          = @"SecurityTP";
         public const string Value         = @"SecurityVL";
         public const string UseMasking    = @"YN_Mask";
         public const string UseApproval   = @"YN_Approval";
         public const string PageDetection = @"ProcessPG";
         public const string Masking       = @"ProcessMK";
         public const string LimitCount    = @"LimitCNT";
         public const string Description   = @"SecurityDesc";
    }
}