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
--              Request 'GetUsagePrnCnt'의 Response를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Usage_Prn_Cnt]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Usage_Prn_Cnt];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Usage_Prn_Cnt]
     @param_UserId        nvarchar(500)
    ,@param_DeviceIp      nvarchar(500)
    ,@r_UserId            nvarchar(500)    OUTPUT
    ,@r_OverCountPrint    nvarchar(500)    OUTPUT
    ,@r_UsedGray          nvarchar(500)    OUTPUT
    ,@r_UsedColor         nvarchar(500)    OUTPUT
    ,@r_LimitGray         nvarchar(500)    OUTPUT
    ,@r_LimitColor        nvarchar(500)    OUTPUT
    ,@r_PrnCount          nvarchar(500)    OUTPUT
    ,@r_FunctionCtrl      nvarchar(500)    OUTPUT
    ,@r_Status            nvarchar(500)    OUTPUT
    ,@r_ResultMsg         nvarchar(500)    OUTPUT
AS
BEGIN
-------------------------------------------------------------------
    SET NOCOUNT ON

    -------------------------------------------------
    -- 상수 역할의 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @code_FULL_COLOR                nvarchar(50)
    DECLARE    @code_BLACK_ONLY                nvarchar(50)
    DECLARE    @code_USER_JOB_AUTH             nvarchar(50)
    DECLARE    @code_USER_JOB_LIMIT_COUNT      nvarchar(50)
    DECLARE    @code_DEPT_JOB_AUTH             nvarchar(50)
    DECLARE    @code_DEPT_JOB_LIMIT_COUNT      nvarchar(50)
    DECLARE    @code_DEVICE_JOB_AUTH           nvarchar(50)
    DECLARE    @code_DEVICE_JOB_LIMIT_COUNT    nvarchar(50)

    SET    @code_FULL_COLOR                = 'FULLCOLOR'
    SET    @code_BLACK_ONLY                = 'BLACKONLY'
    SET    @code_USER_JOB_AUTH             = 'USER_JOBAUTH'
    SET    @code_USER_JOB_LIMIT_COUNT      = 'USER_JOBLIMITCOUNT'
    SET    @code_DEPT_JOB_AUTH             = 'DEPT_JOBAUTH'
    SET    @code_DEPT_JOB_LIMIT_COUNT      = 'DEPT_JOBLIMITCOUNT'
    SET    @code_DEVICE_JOB_AUTH           = 'DEVICE_JOBAUTH'
    SET    @code_DEVICE_JOB_LIMIT_COUNT    = 'DEVICE_JOBLIMITCOUNT'
    -------------------------------------------------



    -------------------------------------------------
    -- 처리 구문을 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @CodeValue         nvarchar(50)
    DECLARE    @IsLimitedColor    smallint
    DECLARE    @IsLimitedGray     smallint
    -------------------------------------------------

    -------------------------------------------------
    -- 값 정보에 대한 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @UserId            nvarchar(500)
    DECLARE    @OverCountPrint    nvarchar(500)
    DECLARE    @UsedGray          nvarchar(500)
    DECLARE    @UsedColor         nvarchar(500)
    DECLARE    @LimitGray         nvarchar(500)
    DECLARE    @LimitColor        nvarchar(500)
    DECLARE    @PrnCount          nvarchar(500)
    DECLARE    @FunctionCtrl      nvarchar(500)
    DECLARE    @Status            nvarchar(500)
    DECLARE    @ResultMsg         nvarchar(500)
    -------------------------------------------------



    -------------------------------------------------
    BEGIN TRY
    -------------------------------------------------
        -- Get Job Authority
        EXEC SP_Get_Job_Auth @CodeValue output

            IF (@CodeValue = @code_FULL_COLOR)
                Begin
                    SET @IsLimitedColor = 0
                    SET @IsLimitedGray  = 0
                    GoTo SP_USER_LIMIT_QUERY
                End

            ELSE IF (@CodeValue = @code_BLACK_ONLY)
                Begin
                    SET @IsLimitedColor = -1
                    SET @IsLimitedGray  = 0
                    GoTo SP_USER_LIMIT_QUERY
                End

            ELSE IF (@CodeValue = @code_USER_JOB_AUTH OR @CodeValue = @code_USER_JOB_LIMIT_COUNT)
                Begin
                    SET @IsLimitedColor = 1
                    SET @IsLimitedGray  = 1
                    GoTo SP_USER_LIMIT_QUERY
                End

            ELSE IF (@CodeValue = @code_DEPT_JOB_AUTH OR @CodeValue = @code_DEPT_JOB_LIMIT_COUNT)
                Goto SP_DEPT_LIMIT_QUERY

            ELSE IF (@CodeValue = @code_DEVICE_JOB_AUTH OR @CodeValue = @code_DEVICE_JOB_LIMIT_COUNT)
                Goto SP_DEVICE_LIMIT_QUERY

            ELSE
                Begin
                    SET @ResultMsg = 'ERR_PROTOCOL'

                    GOTO SP_ERROR
                End
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
SP_USER_LIMIT_QUERY:
-------------------------------------------------------------------
begin
    SELECT
        @UserId         = UM.USERID,
        @OverCountPrint = (CASE 
                               WHEN ((SELECT TOP 1 OVERPAGEYN
                                      FROM   XPMS_STD.dbo.T_LX_COM_POLICY_M) = '0')
                                   THEN 'Y'
                               ELSE 
                                   'N'
                           END),
        @UsedGray       = ISNULL(JU.CURPRINTBLACK,   0),
        @UsedColor      = ISNULL(JU.CURPRINTCOLOR,   0),
        @LimitGray      = (CASE
                               WHEN (@IsLimitedGray > 0)
                                   THEN ISNULL(JA.PRINTMONOCHROME, 0)
                               ELSE
                                   '999999'
                           END),
        @LimitColor      = (CASE
                                WHEN (@IsLimitedColor > 0)
                                    THEN ISNULL(JA.PRINTCOLOR, 0)
                                WHEN (@IsLimitedColor < 0)
                                    THEN 0
                                ELSE
                                    '999999'
                           END),
        @PrnCount       = (SELECT COUNT(PINF.DocNm)
                           FROM   DBO.PRNINFO PINF
                           WHERE  PINF.UserId = @param_UserId AND PINF.jobStatus in ('0','1','2'))
    FROM XPMS_STD.DBO.T_LX_USER_M UM
        LEFT OUTER JOIN XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE JU
            ON UM.USERID = JU.USERID
        LEFT OUTER JOIN XPMS_STD.DBO.T_LX_JOB_AUTH JA
            ON UM.AUTHID = JA.AUTHID
    WHERE UM.USERID = @param_UserId
    
    IF (@UserID = null)
        Begin
            SET @ResultMsg = 'ERR_NOT_ALLOW_USER'

            GOTO SP_ERROR
        End
    
    Goto SP_SUCCESS
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_DEPT_LIMIT_QUERY:
-------------------------------------------------------------------
begin
    SELECT
        @UserId         = UM.USERID,
        @OverCountPrint = (CASE 
                               WHEN ((SELECT TOP 1 OVERPAGEYN
                                      FROM   XPMS_STD.DBO.T_LX_COM_POLICY_M) = '0')
                                  THEN 'Y'
                               ELSE
                                   'N'
                           END),
        @UsedGray       = ISNULL(JD.CURPRINTBLACK,   0),
        @UsedColor      = ISNULL(JD.CURPRINTCOLOR,   0),
        @LimitGray      = ISNULL(JA.PRINTMONOCHROME, 0),
        @LimitColor     = ISNULL(JA.PRINTCOLOR,      0),
        @PrnCount       = (SELECT COUNT(PINF.DocNm)
                           FROM   DBO.PRNINFO PINF
                           WHERE  PINF.UserId = @param_UserId AND PINF.jobStatus in ('0','1','2'))
    FROM XPMS_STD.DBO.T_LX_USER_M UM
        LEFT OUTER JOIN XPMS_STD.DBO.T_LX_DEPT_M DM
            ON UM.DEPTCODE = DM.DEPTCODE
        LEFT OUTER JOIN XPMS_STD.DBO.T_LX_JOB_AUTH JA
            ON DM.AUTHID = JA.AUTHID
        LEFT OUTER JOIN XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_DEPT JD
            ON UM.DEPTCODE = JD.DEPTCODE
    WHERE UM.USERID = @param_UserId
    
    IF (@UserID = null)
        Begin
            SET @ResultMsg = 'ERR_NOT_ALLOW_USER'

            GOTO SP_ERROR
        End

    Goto SP_SUCCESS
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_DEVICE_LIMIT_QUERY:
-------------------------------------------------------------------
begin
    SELECT
        @UserId         = UM.USERID,
        @OverCountPrint = (CASE
                               WHEN ((SELECT TOP 1 OVERPAGEYN FROM XPMS_STD.DBO.T_LX_COM_POLICY_M) = '0')
                                   THEN 'Y'
                               ELSE 'N'
                           END),
        @UsedGray       = (SELECT ISNULL(B.CURPRINTBLACK, 0)
                           FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_MACHINE B
                           WHERE  A.MAC_IP = @param_DeviceIp AND A.MAC_CODE = B.MACCODE AND A.USEYN = 'Y'),
        @UsedColor      = (SELECT ISNULL(B.CURPRINTCOLOR, 0)
                           FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_MACHINE B
                           WHERE  A.MAC_IP = @param_DeviceIp AND A.MAC_CODE = B.MACCODE AND A.USEYN = 'Y'),
        @LimitGray      = (SELECT ISNULL(B.PRINTMONOCHROME, 0)
                           FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_JOB_AUTH B
                           WHERE  A.AUTHID = B.AUTHID AND A.MAC_IP = @param_DeviceIp AND A.USEYN = 'Y'),
        @LimitColor     = (SELECT ISNULL(B.PRINTCOLOR, 0)
                           FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_JOB_AUTH B
                           WHERE  A.AUTHID = B.AUTHID AND A.MAC_IP = @param_DeviceIp AND A.USEYN = 'Y'),
        @PrnCount       = (SELECT COUNT(PINF.DocNm)
                           FROM   DBO.PRNINFO PINF
                           WHERE  PINF.UserId = @param_UserId)
    FROM  XPMS_STD.DBO.T_LX_USER_M UM
    WHERE UM.USERID = @param_UserId
    
    IF (@UserID = null)
        Begin
            SET @ResultMsg = 'ERR_NOT_ALLOW_USER'

            GOTO SP_ERROR
        End
    
    Goto SP_SUCCESS
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_SUCCESS:
-------------------------------------------------------------------
begin
    -- Get Function Control
    EXEC SP_Get_Function_Ctrl @param_UserId, @param_DeviceIp, @FunctionCtrl output

    -------------------------------------------------
    -- 결과 정보를 세팅한다.
    -------------------------------------------------
    SET @r_UserId         = @UserId
    SET @r_OverCountPrint = @OverCountPrint
    SET @r_UsedGray       = @UsedGray
    SET @r_UsedColor      = @UsedColor
    SET @r_LimitGray      = @LimitGray
    SET @r_LimitColor     = @LimitColor
    SET @r_PrnCount       = @PrnCount
    SET @r_FunctionCtrl   = @FunctionCtrl
    SET @r_Status         = 'success'
    SET @r_ResultMsg      = 'success'
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