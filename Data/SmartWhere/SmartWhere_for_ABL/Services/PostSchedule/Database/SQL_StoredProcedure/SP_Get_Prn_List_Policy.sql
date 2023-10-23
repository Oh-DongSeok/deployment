-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      sangmin.cho@kor.fujixerox.com, 조상민
-- Create date: 2016-03-08
-- Description: SmartWhere PrnPostProcessService의
--              Request 'GetPrnListPolicy'의 Response를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Prn_List_Policy]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Prn_List_Policy];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Prn_List_Policy]
     @param_UserId      NVARCHAR(500)
    ,@param_DeviceIp    NVARCHAR(500)
    ,@param_LimitCount  int
    ,@param_Sorting     tinyint
    ,@r_DefaultBlack    NVARCHAR(50)     OUTPUT
    ,@r_ForcedBlack     NVARCHAR(50)     OUTPUT
    ,@r_ForcedDuplex    NVARCHAR(50)     OUTPUT
    ,@r_Forced2Up       NVARCHAR(50)     OUTPUT
    ,@r_PrintAgain      NVARCHAR(50)     OUTPUT
    ,@r_FunctionCtrl    NVARCHAR(50)     OUTPUT
    ,@r_PrnCount        int              OUTPUT
    ,@r_UserId          NVARCHAR(500)    OUTPUT
    ,@r_Status          NVARCHAR(500)    OUTPUT
    ,@r_ResultMsg       NVARCHAR(500)    OUTPUT
AS
BEGIN
-------------------------------------------------------------------
    SET NOCOUNT ON

    -------------------------------------------------
    -- 처리 구문을 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @UserCount         int
    DECLARE    @PolicyOrder       NVARCHAR(50)
    DECLARE    @PolicyPriority    NVARCHAR(50)
    DECLARE    @TemplateID        NVARCHAR(500)
    -------------------------------------------------

    -------------------------------------------------
    -- 사용자 정보 값에 대한 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @DefaultBlack    NVARCHAR(50)
    DECLARE    @ForcedBlack     NVARCHAR(50)
    DECLARE    @ForcedDuplex    NVARCHAR(50)
    DECLARE    @Forced2Up       NVARCHAR(50)
    DECLARE    @PrintAgain      NVARCHAR(50)
    DECLARE    @FunctionCtrl    NVARCHAR(50)
    DECLARE    @PrnCount        int
    DECLARE    @UserId          NVARCHAR(500)
    -------------------------------------------------

    -------------------------------------------------
    -- 값 정보에 대한 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @Status          NVARCHAR(500)
    DECLARE    @ResultMsg       NVARCHAR(500)
    -------------------------------------------------

    -------------------------------------------------
    BEGIN TRY
    -------------------------------------------------
        -- User 존재유무 확인
        EXEC SP_Get_User_Count @param_UserID, @UserCount output;

        IF (@UserCount < 1)
            begin
                SET @Status    = 'fail'
                SET @ResultMsg = 'useridNull';
                
                GOTO SP_ERROR
            end

        -- 정책 우선순위 조회
        EXEC SP_Get_Policy_Priority @PolicyPriority output;

        -- Template ID 조회
        if (@PolicyPriority = 'U')
            EXEC SP_Get_Template_ID_to_User @param_UserId, @TemplateID output;

        ELSE IF (@PolicyPriority = 'D')
            EXEC SP_Get_Template_ID_to_Dept @param_UserId, @TemplateID output;

        -- Get Function Control
        EXEC SP_Get_Function_Ctrl @param_UserId, @param_DeviceIp, @FunctionCtrl output

        -- SelectUserPolicyInfo
        SELECT TOP 1 
               @UserId       = @param_UserId,
               @ForcedBlack  = CASE
                                   WHEN ((SELECT   COLOR_TYPE
                                          FROM     XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_MODEL_M B
                                          WHERE    A.MODEL_CODE = B.MODEL_CODE AND A.USEYN = 'Y' AND A.MAC_IP = @param_DeviceIp
                                          GROUP BY A.MODEL_CODE, A.MAC_IP, B.COLOR_TYPE) = 'B')
                                       THEN 'Y'
                                   ELSE
                                       RTRIM(A.forcedBlack)
                               END,
               @DefaultBlack = CASE
                                   WHEN ((SELECT   COLOR_TYPE
                                          FROM     XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_MODEL_M b
                                          WHERE    A.MODEL_CODE = B.MODEL_CODE AND A.USEYN = 'Y' AND A.MAC_IP = @param_DeviceIp
                                          GROUP BY A.MODEL_CODE, A.MAC_IP, B.COLOR_TYPE) = 'B')
                                       THEN 'N'
                                   ELSE
                                       RTRIM(A.defaultBlack)
                               END,
               @ForcedDuplex = RTRIM(A.forcedDuplex),
               @Forced2Up    = RTRIM(A.forced2Up),
               @PrintAgain   = A.printAgain,
               @PrnCount     = A.prnCount
        FROM (SELECT PO.FORCED_BLACK forcedBlack,
                     CASE
                         WHEN (PO.FORCED_DUPLEX  = 'S')
                             THEN 'N'
                         ELSE
                             'Y'
                     END forcedDuplex,
                     PO.DEFAULT_BLACK   defaultBlack,
                     PO.FORCED_TWOUP    forced2Up,
                     PO.INCLUDE_PRINTED printAgain,
                     CASE
                         WHEN (PO.INCLUDE_PRINTED = 'Y')
                             THEN (SELECT COUNT(PN.uuId)
                                   FROM   DBO.PRNINFO PN
                                   WHERE  PN.userId = @param_UserId)
                         ELSE
                             (SELECT COUNT(PN.uuId)
                              FROM   DBO.PRNINFO PN
                              WHERE  PN.userId = @param_UserId)
                     END prnCount,
                     0 ORDER_COLUMN
              FROM  XPMS_STD.DBO.T_LX_PRINT_OPTION PO
              WHERE PO.POID = (SELECT TP.POID
                               FROM   XPMS_STD.DBO.T_LX_TEMPLATE_PO TP
                               WHERE  TP.DBSTS = 'A' 
                                      AND
                                      TP.TEMPLATEID = @TemplateID 
                                      AND
                                      GETDATE() BETWEEN TP.START_DATE 
                                      AND
                                      CASE
                                          WHEN (TP.END_DATE = NULL OR RTRIM(TP.END_DATE) = '')
                                              THEN GETDATE()
                                          ELSE
                                              END_DATE
                                      END)
              UNION ALL
              SELECT 'N' forcedBlack,
                     'N' forcedDuplex,
                     'N' forced2Up,
                     'N' printAgain,
                     'N' defaultBlack,
                     (SELECT COUNT(PN.uuId)
                      FROM   DBO.PRNINFO PN
                      WHERE  PN.userId = @param_UserId AND PN.jobStatus in ('0','1','2')) prnCount,
              1 ORDER_COLUMN) A
        ORDER BY A.ORDER_COLUMN ASC
        
        -- Prn 갯수가 없더라도 I/F 특성상 정상 처리함(because UserInfo)
        if (@PrnCount < 1)
            begin
                SET @ResultMsg = 'success'

                GOTO SP_SUCCESS
            end
            
        -- SelectUserPrnFileListOption
        SELECT TOP (@param_LimitCount)
               REPLACE(CONVERT(VARCHAR, PN.rcdTime, 20), '-', '/') rcdTime, 
               PN.uuId                                             uuId,
               PN.userId                                           userId,
               PN.spoolNm                                          spoolNm,
               PN.docNm                                            docNm,
               PN.printNm                                          printNm,
               ISNULL(PN.totalPages, 0)                            totalPages,
               PN.useYn                                            useYn,
               PN.jobTime                                          jobTime,
               PN.colorMode                                        srcColor,
               PN.destColorMode                                    destColor,
               CASE
                   WHEN (PO.forcedBlack = 'N')
                       THEN PN.colorMode
                   WHEN (PO.forcedBlack = 'Y')
                       THEN PN.destColorMode
                   ELSE
                       ''
               END                                                 colorMode,
               PN.duplexMode                                       srcDuplex,
               PN.destDuplexMode                                   destDuplex,
               CASE
                   WHEN (PO.forcedDuplex = 'N')
                       THEN PN.duplexMode
                   WHEN (PO.forcedDuplex = 'Y')
                       THEN CASE
                                WHEN (PN.duplexMode = 'S')
                                    THEN PN.destDuplexMode
                                ELSE PN.duplexMode
                            END
                   ELSE
                       ''
              END                                                  duplexMode,
              PN.nup                                               srcNup,
              PN.destNup                                           destNup,
              CASE
                  WHEN (PO.forced2Up = 'N')
                      THEN PN.nup
                  WHEN (PO.forced2Up = 'Y')
                      THEN CASE
                               WHEN (PN.nup > PN.destNup)
                                   THEN PN.nup
                               ELSE
                                   PN.destNup
                           END
                  ELSE
                      ''
              END                                                  nUp,
              CASE
                  WHEN (CHARINDEX('PS', PN.driverType) > 0)
                      THEN 'Y'
                  ELSE
                      'N'
              END                                                  prnType,
              PN.driverType                                        driverType,
              ISNULL(PN.copies, 0)                                 copies,
              PN.userIp                                            userIp,
              ISNULL(PN.backupStatus, 0)                           backupStatus,
              PN.queue                                             queue,
              PN.serverArea                                        serverArea,
              PN.flag                                              flag,
              ISNULL(PN.jobType, 0)                                jobType,
              ISNULL(PN.jobStatus, 0)                              jobStatus,
              ISNULL(PN.printValue, 0)                             printValue,
              PO.defaultBlack
        FROM DBO.PRNINFO PN
             JOIN (SELECT TOP 1
                          A.userId,
                          RTRIM(A.forcedBlack)  forcedBlack,
                          RTRIM(A.forcedDuplex) forcedDuplex,
                          RTRIM(A.forced2Up)    forced2Up,
                          RTRIM(A.defaultBlack) defaultBlack
                   FROM (SELECT @param_UserId           userId,
                                RTRIM(PO.FORCED_BLACK)  forcedBlack,
                                RTRIM(PO.DEFAULT_BLACK) defaultBlack,
                                CASE
                                    WHEN (RTRIM(PO.FORCED_DUPLEX)  = 'S')
                                        THEN 'N'
                                    ELSE
                                        'Y'
                                END                     forcedDuplex,
                                RTRIM(PO.FORCED_TWOUP)  forced2Up,
                                0 ORDER_COLUMN
                         FROM  XPMS_STD.DBO.T_LX_PRINT_OPTION PO
                         WHERE PO.POID = (SELECT TP.POID
                                          FROM XPMS_STD.DBO.T_LX_TEMPLATE_PO TP
                                          WHERE TP.DBSTS = 'A' 
                                                AND
                                                TP.TEMPLATEID = @TemplateID
                                                AND
                                                GETDATE() BETWEEN TP.START_DATE
                                                AND
                                                CASE
                                                    WHEN (TP.END_DATE = NULL OR RTRIM(TP.END_DATE) = '')
                                                        THEN GETDATE()
                                                    ELSE
                                                        END_DATE
                                                END)
                         UNION ALL
                         SELECT @param_UserId userId,
                                'N' forcedBlack,
                                'N' forcedDuplex,
                                'N' forced2Up,
                                'N' defaultBlack,
                                1 ORDER_COLUMN) A
                         ORDER BY ORDER_COLUMN ASC) PO ON PN.userId = PO.userId
        WHERE PN.userId = @param_UserId AND PN.jobStatus in ('0','1','2')
        ORDER BY CASE
                     WHEN (PN.useYn = 'N')
                         THEN 0
                     ELSE 1
                 END ASC,
                 CASE
                     WHEN @param_Sorting != 0
                         THEN rcdTime END ASC,
                 CASE
                     WHEN @param_Sorting = 0
                         THEN rcdTime end DESC

    -------------------------------------------------
    END TRY
    BEGIN CATCH
    -------------------------------------------------
        SET @ResultMsg = 'ERR_DB_ACCESS'

        GOTO SP_ERROR
    -------------------------------------------------
    END CATCH
    -------------------------------------------------

-------------------------------------------------------------------
SP_SUCCESS:
-------------------------------------------------------------------
begin
    -------------------------------------------------
    -- 결과 정보를 세팅한다.
    -------------------------------------------------
    SET @r_DefaultBlack = @DefaultBlack
    SET @r_ForcedBlack  = @ForcedBlack
    SET @r_ForcedDuplex = @ForcedDuplex
    SET @r_Forced2Up    = @Forced2Up
    SET @r_PrintAgain   = @PrintAgain
    SET @r_FunctionCtrl = @FunctionCtrl
    SET @r_PrnCount     = @PrnCount
    SET @r_UserId       = @UserId
    SET @r_Status       = 'success'
    SET @r_ResultMsg    = @ResultMsg
    -------------------------------------------------

    ----------------------------------------------------
    -- 획득 결과를 반환한다.
    ----------------------------------------------------
    return
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_ERROR:
-------------------------------------------------------------------
begin
    -------------------------------------------------
    -- 오류에 대한 결과 정보를 세팅한다.
    -------------------------------------------------
    set @r_Status    = 'fail'
    set @r_ResultMsg = @ResultMsg
    -------------------------------------------------

    ----------------------------------------------------
    -- 오류에 대한 결과를 반환한다.
    ----------------------------------------------------
    return
end
-------------------------------------------------------------------
END