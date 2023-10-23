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
-- Create date: 2016-03-21, 2017-06-19
-- Description: 특정 UUID를 가지는 PRNINFO 레코드를
--              제거하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Delete_Selected]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Delete_Selected];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Delete_Selected] 
    -- Add the parameters for the stored procedure here
     @param_UserID         NVARCHAR(500)
    ,@param_CommaString    NVARCHAR(max)
AS
BEGIN
    SELECT spoolNm, userIp, driverType FROM [dbo].[PRNINFO]
           WHERE uuId IN (SELECT F.TypeID FROM dbo.FN_ParseArray(@param_CommaString, ',') F)

    DELETE FROM [dbo].[PRNINFO]
           WHERE uuId IN (SELECT F.TypeID FROM dbo.FN_ParseArray(@param_CommaString, ',') F)
END
GO
-------------------------------------------------------------------