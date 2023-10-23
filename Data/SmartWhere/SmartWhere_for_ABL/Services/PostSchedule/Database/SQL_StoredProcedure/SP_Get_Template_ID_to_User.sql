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
-- Description: 사용자 ID를 통하여 SmartWhere의 Template ID를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Template_ID_to_User]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Template_ID_to_User];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Template_ID_to_User] 
    -- Add the parameters for the stored procedure here
    @param_UserID    NVARCHAR(500),
    @r_TemplateID    NVARCHAR(500)    OUTPUT
AS
BEGIN
    SELECT TOP 1 
           @r_TemplateID = UM.TEMPLATEID
    FROM   XPMS_STD.DBO.T_LX_USER_M UM
    WHERE  UM.USERID = @param_UserId
END
GO
-------------------------------------------------------------------