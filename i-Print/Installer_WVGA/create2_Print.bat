@echo on
REM /* SmartUI Installer Maker            */
REM /* Bandizip 설치 필수                  */
REM /* Output File: SmartUI_Installer.exe */

REM Installer 생성을 시작합니다...
set CURPATH=%cd%
"%CURPATH%\makesfx.bat" -o iPrint_Billing_Print_FB_WVGA_v3.0.0_Installer.exe -p CreateData2_Print.zip InstallerConfig2_Print.xml
pause