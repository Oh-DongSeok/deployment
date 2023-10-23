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
-- Description: 사용자 ID를 통하여 사용자 부서의 SmartWhere의 Template ID를
--              획득하는 용도로 사용된다.
-- =============================================
IF EXISTS(SELECT * 
          FROM   sysobjects 
          WHERE  id = object_id(N'[dbo].[SP_Get_Template_ID_to_Dept]') 
                 AND OBJECTPROPERTY(id, N'IsProcedure') = 1 )
    BEGIN
        DROP PROCEDURE [dbo].[SP_Get_Template_ID_to_Dept];
    END
GO
-------------------------------------------------------------------
CREATE PROCEDURE [dbo].[SP_Get_Template_ID_to_Dept] 
    -- Add the parameters for the stored procedure here
    @param_UserID    NVARCHAR(500),
    @r_TemplateID    NVARCHAR(500)    OUTPUT
AS
BEGIN
    WITH CTE(DEPTCODE, HIGHDEPTCODE, DEPTNAME, TEMPLATEID, SEQNO_DEPT, INCLUDE_CHILDREN)
        AS (SELECT DM1.DEPTCODE, DM1.HIGHDEPTCODE, DM1.DEPTNAME, DM1.TEMPLATEID, DM1.SEQNO_DEPT, 
                   (SELECT DPM.INCLUDE_CHILDREN
                    FROM   XPMS_STD.DBO.T_LX_DEPT_POLICY_M DPM
                    WHERE  DPM.DEPTCODE = DM1.DEPTCODE) INCLUDE_CHILDREN
            FROM XPMS_STD.DBO.T_LX_DEPT_M DM1 
            WHERE DM1.DEPTCODE = (SELECT DEPTCODE 
                                  FROM   XPMS_STD.DBO.T_LX_USER_M
                                  WHERE  USERID = @param_UserId) 
            UNION ALL
            SELECT DM2.DEPTCODE, DM2.HIGHDEPTCODE, DM2.DEPTNAME, DM2.TEMPLATEID, DM2.SEQNO_DEPT,
                   (SELECT DPM.INCLUDE_CHILDREN
                    FROM   XPMS_STD.DBO.T_LX_DEPT_POLICY_M DPM
                    WHERE  DPM.DEPTCODE = DM2.DEPTCODE) INCLUDE_CHILDREN 
            FROM XPMS_STD.DBO.T_LX_DEPT_M DM2
            INNER JOIN CTE C ON DM2.DEPTCODE = C.HIGHDEPTCODE)
    SELECT TOP 1
           @r_TemplateID = A.TEMPLATEID 
    FROM   CTE A 
    WHERE  A.TEMPLATEID IS NOT NULL
    ORDER BY CASE
                 WHEN (A.INCLUDE_CHILDREN IS NULL OR A.INCLUDE_CHILDREN = 'Y')
                     THEN 0
                 ELSE
                     1
             END
    ASC, A.SEQNO_DEPT DESC
END
GO
-------------------------------------------------------------------