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
-- Create date: 2016-03-21
-- Description: 특정 UUID를 가지는 PRNINFO 레코드의
--              JobStatus를 1로 갱신하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Update_Job_Status]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Update_Job_Status];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Update_Job_Status] 
    -- Add the parameters for the stored procedure here
    @param_CommaString    nvarchar(max)
AS
BEGIN
    UPDATE [dbo].[PRNINFO] SET JOBSTATUS = 1 WHERE UUID IN (SELECT F.TypeID FROM dbo.FN_ParseArray(@param_CommaString, ',') F)
END
GO
-------------------------------------------------------------------