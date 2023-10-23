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
-- Description: SmartWhere의 Job Authority를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Job_Auth]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Job_Auth];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Job_Auth] 
    -- Add the parameters for the stored procedure here
    @r_CodeValue    nvarchar(50)    OUTPUT
AS
BEGIN
    SELECT @r_CodeValue = CODEVALUE
    FROM   XPMS_STD.dbo.T_LX_COMMON_M
    WHERE  CODEM = 'AUTHL' AND CODESUB = '0' AND CODENAME = 'JOB_AUTH'
END
GO
-------------------------------------------------------------------