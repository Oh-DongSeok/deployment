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
-- Description: SmartWhere의 Policy Priority를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Policy_Priority]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Policy_Priority];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Policy_Priority] 
    -- Add the parameters for the stored procedure here
    @r_PolicyPriority    nvarchar(10)    OUTPUT
AS
BEGIN
    SELECT @r_PolicyPriority = CASE
                                   WHEN (PM.POLICYORDER = '1')
                                       THEN 'U'
                                   WHEN (PM.POLICYORDER = '2')
                                       THEN 'D'
                                END
    FROM   XPMS_STD.DBO.T_LX_COM_POLICY_M PM
    WHERE  PM.DBSTS = 'A'
END
GO
-------------------------------------------------------------------