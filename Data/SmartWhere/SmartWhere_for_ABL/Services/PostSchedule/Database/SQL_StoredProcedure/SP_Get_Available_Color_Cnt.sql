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
-- Create date: 2016-03-17
-- Description: SmartWhere의 Available Color 관련
--              Count의 값을 획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Available_Color_Cnt]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Available_Color_Cnt];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Available_Color_Cnt] 
    -- Add the parameters for the stored procedure here
    @param_UserId      NVARCHAR(500),
    @param_DeviceIp    NVARCHAR(500),
    @r_LimitColor      int              OUTPUT,
    @r_LimitGray       int              OUTPUT,
    @r_UsedColor       int              OUTPUT,
    @r_UsedGray        int              OUTPUT,
    @r_PrnCount        int              OUTPUT
AS
BEGIN
    -------------------------------------------------
    -- 상수 역할의 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @code_DEPT_JOB_LIMIT_COUNT      NVARCHAR(50)
    DECLARE    @code_DEVICE_JOB_LIMIT_COUNT    NVARCHAR(50)

    SET    @code_DEPT_JOB_LIMIT_COUNT      = 'DEPT_JOBLIMITCOUNT'
    SET    @code_DEVICE_JOB_LIMIT_COUNT    = 'DEVICE_JOBLIMITCOUNT'
    -------------------------------------------------
    
    -------------------------------------------------
    -- 처리를 위한 변수를 설정한다.
    -------------------------------------------------
    DECLARE    @CodeValue    NVARCHAR(50)
    -------------------------------------------------

    EXEC SP_Get_Job_Auth @CodeValue output

    IF (@CodeValue = @code_DEPT_JOB_LIMIT_COUNT)
        GoTo SP_GET_AVAILABLE_PRN_CNT_DEPT
    ELSE IF (@CodeValue = @code_DEVICE_JOB_LIMIT_COUNT)
        GoTo SP_GET_AVAILABLE_PRN_CNT_DEVICE
    ELSE
        Goto SP_GET_AVAILABLE_PRN_CNT_USER

-------------------------------------------------------------------
SP_GET_AVAILABLE_PRN_CNT_USER:
-------------------------------------------------------------------
begin
    SELECT @r_UsedGray   = ISNULL(JU.CURPRINTBLACK,   0),
           @r_UsedColor  = ISNULL(JU.CURPRINTCOLOR,   0),
           @r_LimitGray  = ISNULL(JA.PRINTMONOCHROME, 0),
           @r_LimitColor = ISNULL(JA.PRINTCOLOR,      0),
           @r_PrnCount   = (SELECT COUNT(PINF.DocNm)
                            FROM   DBO.PRNINFO PINF
                            WHERE  PINF.UserId = @param_UserId)
    FROM XPMS_STD.DBO.T_LX_USER_M UM
         LEFT OUTER JOIN XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE JU
              ON UM.USERID = JU.USERID
         LEFT OUTER JOIN XPMS_STD.DBO.T_LX_JOB_AUTH JA
              ON UM.AUTHID = JA.AUTHID
    WHERE UM.USERID = @param_UserId
end
-------------------------------------------------------------------

-------------------------------------------------------------------
SP_GET_AVAILABLE_PRN_CNT_DEPT:
-------------------------------------------------------------------
begin
    SELECT @r_UsedGray   = ISNULL(JD.CURPRINTBLACK,   0),
           @r_UsedColor  = ISNULL(JD.CURPRINTCOLOR,   0),
           @r_LimitGray  = ISNULL(JA.PRINTMONOCHROME, 0),
           @r_LimitColor = ISNULL(JA.PRINTCOLOR,      0),
           @r_PrnCount   = (SELECT COUNT(PINF.DocNm)
                            FROM   DBO.PRNINFO PINF
                            WHERE  PINF.UserId = @param_UserId)
    FROM XPMS_STD.DBO.T_LX_USER_M UM
        LEFT OUTER JOIN XPMS_STD.DBO.T_LX_DEPT_M DM
             ON UM.DEPTCODE = DM.DEPTCODE
        LEFT OUTER JOIN XPMS_STD.DBO.T_LX_JOB_AUTH JA
             ON DM.AUTHID = JA.AUTHID
        LEFT OUTER JOIN XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_DEPT JD
             ON UM.DEPTCODE = JD.DEPTCODE
    WHERE UM.USERID = @param_UserId
end
-------------------------------------------------------------------


-------------------------------------------------------------------
SP_GET_AVAILABLE_PRN_CNT_DEVICE:
-------------------------------------------------------------------
begin
    SELECT @r_UsedGray   = ISNULL((SELECT ISNULL(B.CURPRINTBLACK, 0) 
                                   FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_MACHINE B
                                   WHERE  A.MAC_IP = @param_DeviceIp AND A.MAC_CODE = B.MACCODE AND A.USEYN = 'Y'), 0),
           @r_UsedColor  = ISNULL((SELECT ISNULL(B.CURPRINTCOLOR, 0)
                                   FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.VIEW_XPMS_JOB_USAGE_MACHINE B
                                   WHERE  A.MAC_IP = @param_DeviceIp AND A.MAC_CODE = B.MACCODE AND A.USEYN = 'Y'), 0),
           @r_LimitGray  = ISNULL((SELECT ISNULL(B.PRINTMONOCHROME, 0)
                                   FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_JOB_AUTH B
                                   WHERE  A.AUTHID = B.AUTHID AND A.MAC_IP = @param_DeviceIp AND A.USEYN = 'Y'), 0),
           @r_LimitColor = ISNULL((SELECT ISNULL(B.PRINTCOLOR, 0)
                                   FROM   XPMS_STD.DBO.T_LX_MAC_M A, XPMS_STD.DBO.T_LX_JOB_AUTH B
                                   WHERE  A.AUTHID = B.AUTHID AND A.MAC_IP = @param_DeviceIp AND A.USEYN = 'Y'), 0),
           @r_PrnCount   = ISNULL((SELECT COUNT(PINF.DocNm)
                                   FROM   DBO.PRNINFO PINF
                                   WHERE  PINF.UserId = @param_UserId), 0)
    FROM  XPMS_STD.DBO.T_LX_USER_M UM
    WHERE UM.USERID = @param_UserId
end
-------------------------------------------------------------------
END