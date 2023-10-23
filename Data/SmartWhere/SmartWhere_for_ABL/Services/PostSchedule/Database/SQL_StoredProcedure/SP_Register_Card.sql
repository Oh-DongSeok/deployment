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
-- Create date: 2016-03-15
-- Description: SmartWhere PrnPostProcessService의
--              Request 'RegisterCard'의 Response를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Register_Card]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Register_Card];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Register_Card]
     @param_UserId    NVARCHAR(500)
    ,@param_UserPw    NVARCHAR(500)
    ,@param_CardId    NVARCHAR(500)
    ,@r_ResultMsg     NVARCHAR(50)     OUTPUT
    ,@r_Status        NVARCHAR(50)     OUTPUT  -- success:   정상,             useridNull: 유저 아이디가 null이거나 ""일 때
                                               -- userFail:  id나 pw가 틀림,   userpwNull: 유저 비밀번호가 null이거나 ""일 때
                                               -- cardExist: 카드값이 존재함,  cardidNull: cardidNull가 null이거나 "" 일 때
                                               -- fail:      시스템 or DB 오류
AS
BEGIN
-------------------------------------------------------------------
    SET NOCOUNT ON

    -------------------------------------------------
    -- 처리 구문을 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @IsValidUser       tinyint
    DECLARE    @IsUsedCard        tinyint
    -------------------------------------------------

    -------------------------------------------------
    -- 값 정보에 대한 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @Status           NVARCHAR(50)
    DECLARE    @ResultMsg        NVARCHAR(50)
    -------------------------------------------------

    -------------------------------------------------
    BEGIN TRY
    -------------------------------------------------
        -- Check: IsUserIDIsNull
        IF (@param_UserId IS NULL OR LEN(@param_UserId) < 1)
            begin
                SET @Status = 'useridNull'
                GoTo SP_CLOSE
            end
            
        -- Check: IsCardIDIsNull
        IF (@param_CardId IS NULL OR LEN(@param_CardId) < 1)
            begin
                SET @Status = 'cardidNull'
                GoTo SP_CLOSE
            end
            
        -- Check: IsUserPWIsNull
        IF (@param_UserPw IS NULL OR LEN(@param_UserPw) < 1)
            begin
                SET  @Status = 'userpwNull'
                GoTo SP_CLOSE
            end

        -- Check: IsValidUser
        SELECT @IsValidUser = CASE
                                  WHEN (COUNT(UM.USERID) = 1)
                                      THEN 1
                                  ELSE
                                      0
                              END
        FROM   XPMS_STD.DBO.T_LX_USER_M UM
        WHERE  UM.USERID = @param_UserId AND UM.USERPWD = SUBSTRING(master.DBO.FN_VARBINTOHEXSTR(HASHBYTES('MD5', CONVERT(VARCHAR(40), @param_UserPw))), 3, 32)

        IF (@@ROWCOUNT < 1)
            begin
                SET  @ResultMsg = 'ERR_NOT_ALLOW_USER'
                GoTo SP_FAIL
            end

        IF (@IsValidUser < 1)
            begin
                SET  @Status = 'userFail'
                GoTo SP_CLOSE
            end

        -- Check: IsUsedCard
        SELECT @IsUsedCard = CASE 
                                 WHEN (COUNT(UM.USERID) < 1)
                                     THEN 0
                                 ELSE
                                     1
                             END
        FROM   XPMS_STD.DBO.T_LX_USER_CARD UM
        WHERE  UM.CARDID = @param_CardId

        IF (@@ROWCOUNT < 1)
            begin
                SET  @ResultMsg = 'ERR_IS_USED_CARD'
                GoTo SP_FAIL
            end

        IF (@IsUsedCard > 0)
            begin
                SET  @Status = 'cardExist'
                GoTo SP_CLOSE
            end

        -- InsertCard
        INSERT INTO XPMS_STD.DBO.T_LX_USER_CARD (USERID, CARDID, USEYN, UPD_DATE)
        VALUES (@param_UserId, @param_CardId, 'Y', (SELECT CONVERT(varchar(8), getdate(), 112) + REPLACE(CONVERT(varchar(8), getdate(), 108),':','')) )

        IF (@@ROWCOUNT < 1)
            begin
                SET  @ResultMsg = 'ERR_FAILED_INSERT_CARD'
                GoTo SP_FAIL
            end

        SET  @Status = 'success'
        GoTo SP_CLOSE

    -------------------------------------------------
    END TRY
    BEGIN CATCH
    -------------------------------------------------
        SET  @ResultMsg = 'ERR_DB_ACCESS'
        GoTo SP_FAIL
    -------------------------------------------------
    END CATCH
    -------------------------------------------------

-------------------------------------------------------------------
SP_FAIL:
-------------------------------------------------------------------
begin
    -------------------------------------------------
    -- 실패 결과 정보를 세팅한다.
    -------------------------------------------------
    SET @r_Status    = 'fail'
    SET @r_ResultMsg = @ResultMsg
    -------------------------------------------------

    return
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_CLOSE:
-------------------------------------------------------------------
begin
    -------------------------------------------------
    -- 결과 정보를 세팅한다.
    -------------------------------------------------
    SET @r_Status    = @Status
    SET @r_ResultMsg = @Status
    -------------------------------------------------

    ----------------------------------------------------
    -- 획득 결과를 반환한다.
    ----------------------------------------------------
    return
end
-------------------------------------------------------------------
END