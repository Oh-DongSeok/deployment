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
-- Create date: 2016-03-18
-- Description: SmartWhere의 PRN 파일 정보를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Prn_for_Print_Selected]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Prn_for_Print_Selected];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Prn_for_Print_Selected] 
    -- Add the parameters for the stored procedure here
     @param_UserID      NVARCHAR(500)
    ,@param_fileUUID    NVARCHAR(500)

    ,@r_UUID            NVARCHAR(500)    OUTPUT -- => .UUID
    ,@r_SpoolName       NVARCHAR(500)    OUTPUT -- => .SpoolName
    ,@r_DocName         NVARCHAR(500)    OUTPUT -- => .DocName
    ,@r_TotalPages      NVARCHAR(500)    OUTPUT -- => .PageCount
    ,@r_ColorMode       NVARCHAR(500)    OUTPUT -- => .ColorMode
    ,@r_Duplex          NVARCHAR(500)    OUTPUT -- => .Duplex
    ,@r_NUp             NVARCHAR(500)    OUTPUT -- => .NUp
    ,@r_Copies          NVARCHAR(500)    OUTPUT -- => .PrintCount
    ,@r_Queue           NVARCHAR(500)    OUTPUT -- => .Queue
    ,@r_UserIP          NVARCHAR(500)    OUTPUT -- => .UserIP
    ,@r_DriverType      NVARCHAR(500)    OUTPUT -- => .DriverType

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
    DECLARE    @PolicyPriority    NVARCHAR(10)
    DECLARE    @TemplateID        NVARCHAR(10)
    -------------------------------------------------

    -------------------------------------------------
    -- 사용자 정보 값에 대한 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @UUID            NVARCHAR(500)
    DECLARE    @SpoolName       NVARCHAR(500)
    DECLARE    @DocName         NVARCHAR(500)
    DECLARE    @TotalPages      NVARCHAR(500)
    DECLARE    @ColorMode       NVARCHAR(500)
    DECLARE    @Duplex          NVARCHAR(500)
    DECLARE    @NUp             NVARCHAR(500)
    DECLARE    @Copies          NVARCHAR(500)
    DECLARE    @Queue           NVARCHAR(500)
    DECLARE    @UserIP          NVARCHAR(500)
    DECLARE    @DriverType      NVARCHAR(500)
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
        EXEC SP_Get_User_Count @param_UserID, @UserCount output;
        
        if (@UserCount < 1)
            begin
                SET @ResultMsg = 'ERR_USER_NOT_EXIST'
                Goto SP_ERROR
            end

        EXEC SP_Get_Policy_Priority @PolicyPriority output;
        
        IF (@PolicyPriority = 'U')
            begin
                EXEC SP_Get_Template_ID_to_User @param_UserID, @TemplateID output;
                
                IF (@TemplateID IS NULL)
                    EXEC SP_Get_Template_ID_to_Dept @param_UserID, @TemplateID output;
            end
        ELSE
            begin
                EXEC SP_Get_Template_ID_to_Dept @param_UserID, @TemplateID output;
                
                IF (@TemplateID IS NULL)
                    EXEC SP_Get_Template_ID_to_User @param_UserID, @TemplateID output;
            end
        
        -- Get User Prn File To UUID
        SELECT TOP 1
               @UUID       = PN.uuId,
               @SpoolName  = PN.spoolNm,
               @DocName    = PN.docNm,
               @TotalPages = ISNULL(PN.totalPages, 0),
               @ColorMode  = CASE
                                 WHEN (PO.forcedBlack = 'N')
                                     THEN PN.colorMode
                                 WHEN (PO.forcedBlack = 'Y')
                                     THEN PN.destColorMode
                                 ELSE
                                     ''
                             END,
               @Duplex     = CASE
                                 WHEN PO.forcedDuplex = 'N'
                                     THEN PN.duplexMode
                                 WHEN PO.forcedDuplex = 'Y'
                                     THEN CASE
                                              WHEN PN.duplexMode = 'S'
                                                  THEN PN.destDuplexMode
                                              ELSE
                                                  PN.duplexMode
                                          END
                                 ELSE
                                     ''
                             END,
               @NUp        = CASE WHEN (PO.forced2Up = 'N')
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
                             END,
               @Copies     = ISNULL(PN.copies, 0),
               @Queue      = PN.queue,
               @UserIP     = PN.userIp,
               @DriverType = PN.driverType
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
        WHERE PN.userId = @param_UserId AND PN.uuId = @param_fileUUID
        
        IF (@@ROWCOUNT < 1)
            begin
                SET @ResultMsg = 'ERR_NOT_FOUND_PRNFILE_FROM_UUID'
                
                Goto SP_ERROR
            end
            
        ELSE
            GoTo SP_SUCCESS
    -------------------------------------------------
    END TRY
    BEGIN CATCH
    -------------------------------------------------
        SET @ResultMsg = 'ERR_NOT_FOUND_PRNFILE_FROM_UUID'

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
    SET @r_UUID       = @UUID
    SET @r_SpoolName  = @SpoolName
    SET @r_DocName    = @DocName
    SET @r_TotalPages = @TotalPages
    SET @r_ColorMode  = @ColorMode
    SET @r_Duplex     = @Duplex
    SET @r_NUp        = @NUp
    SET @r_Copies     = @Copies
    SET @r_Queue      = @Queue
    SET @r_UserIP     = @UserIP
    SET @r_DriverType = @DriverType
    SET @r_Status     = 'success'
    SET @r_ResultMsg  = 'success'
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