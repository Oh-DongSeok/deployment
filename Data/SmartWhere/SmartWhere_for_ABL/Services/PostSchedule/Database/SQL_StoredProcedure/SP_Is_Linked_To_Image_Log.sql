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
-- Description: SmartWhere의 ImageLogLinkage
--              값을 획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Is_Linked_To_Image_Log]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Is_Linked_To_Image_Log];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Is_Linked_To_Image_Log] 
    -- Add the parameters for the stored procedure here
    @param_DeviceIp    NVARCHAR(500),
    @r_ModelCode       NVARCHAR(10)      OUTPUT
AS
BEGIN
   SELECT @r_ModelCode = B.MFPPRT_TYPE
   FROM   XPMS_STD.DBO.T_LX_MAC_M A
          INNER JOIN
          XPMS_STD.DBO.T_LX_MODEL_M B
          ON
          A.MODEL_CODE = B.MODEL_CODE
   WHERE  A.MAC_IP = @param_DeviceIp AND A.USEYN = 'Y'

   IF (@r_ModelCode IS NULL)
       SET @r_modelCode = 'undefined'
END