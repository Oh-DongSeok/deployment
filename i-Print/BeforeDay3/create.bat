@echo off
REM /* SmartUI Installer Maker            */
REM /* Bandizip 설치 필수                  */
REM /* Output File: SmartUI_Installer.exe */

REM Source Data Create...
set CURPATH=%cd%

MOVE %CURPATH%\*.exe %CURPATH%\backup

REM Installer 생성을 시작합니다...
%CURPATH%\makesfx.bat -o iprint_CS_Installer_v1.1.21.exe -p Release1.zip Release2.zip Release3.zip Release4.zip Release5.zip configCommon.xml

cd %CURPATH%

pause