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
-- Create date: 2016-03-11
-- Description: SmartWhere의 Function Control을
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Function_Ctrl]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Function_Ctrl];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Function_Ctrl] 

    -- Add the parameters for the stored procedure here
     @param_UserId      nvarchar(500)
    ,@param_DeviceIp    nvarchar(500)
    ,@r_FunctionCtrl    nvarchar(10)    OUTPUT

AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    -- Insert statements for procedure here               
    SELECT @r_FunctionCtrl = CASE
                                 WHEN (CM.CODEVALUE = 'FULLCOLOR')
                                     THEN '0'
                                 WHEN (CM.CODEVALUE = 'BLACKONLY')
                                     THEN '1'
                                 WHEN (CM.CODEVALUE = 'USER_JOBAUTH' OR CM.CODEVALUE = 'DEPT_JOBAUTH' OR CM.CODEVALUE = 'DEVICE_JOBAUTH')
                                     THEN (SELECT CASE
                                                     WHEN (JA.PRINTCOLOR = '1' AND JA.PRINTMONOCHROME = '1')
                                                         THEN '2'
                                                     WHEN (JA.PRINTCOLOR = '1' AND JA.PRINTMONOCHROME = '0')
                                                         THEN '3'
                                                     WHEN (JA.PRINTCOLOR = '0' AND JA.PRINTMONOCHROME = '1')
                                                         THEN '4'
                                                     WHEN (JA.PRINTCOLOR = '0' AND JA.PRINTMONOCHROME = '0')
                                                         THEN '5'
                                                 END
                                             FROM  XPMS_STD.DBO.T_LX_JOB_AUTH JA
                                             WHERE JA.AUTHID = (SELECT CASE WHEN (CM.CODEVALUE = 'USER_JOBAUTH')
                                                                             THEN (SELECT UM.AUTHID
                                                                                     FROM   XPMS_STD.DBO.T_LX_USER_M UM
                                                                                     WHERE  UM.USERID = @param_UserId)
                                                                         WHEN (CM.CODEVALUE = 'DEPT_JOBAUTH')
                                                                             THEN (SELECT DM.AUTHID
                                                                                     FROM   XPMS_STD.DBO.T_LX_DEPT_M DM
                                                                                     WHERE  DM.DEPTCODE = (SELECT UM.DEPTCODE
                                                                                                         FROM   XPMS_STD.DBO.T_LX_USER_M UM
                                                                                                         WHERE  UM.USERID = @param_UserId))
                                                                         WHEN (CM.CODEVALUE = 'DEVICE_JOBAUTH')
                                                                             THEN (SELECT DM.AUTHID
                                                                                     FROM   XPMS_STD.DBO.T_LX_MAC_M DM
                                                                                     WHERE  DM.MAC_IP = @param_DeviceIp AND DM.USEYN = 'Y')
                                                                     END))
                                 WHEN (CM.CODEVALUE = 'USER_JOBLIMITCOUNT' OR CM.CODEVALUE = 'DEPT_JOBLIMITCOUNT' OR CM.CODEVALUE = 'DEVICE_JOBLIMITCOUNT')
                                     THEN '6'
                                 ELSE
                                     ''
                             END 
    FROM  XPMS_STD.DBO.T_LX_COMMON_M CM 
    WHERE CM.CODEM = 'AUTHL' AND CM.CODENAME = 'JOB_AUTH'
END
GO
-------------------------------------------------------------------