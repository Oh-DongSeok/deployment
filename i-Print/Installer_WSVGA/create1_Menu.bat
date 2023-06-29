@echo on
REM /* SmartUI Installer Maker            */
REM /* Bandizip 설치 필수                  */
REM /* Output File: SmartUI_Installer.exe */

REM Installer 생성을 시작합니다...
set CURPATH=%cd%
"%CURPATH%\makesfx.bat" -o iPrint_Billing_Menu_FB_WSVGA_v3.0.0_Installer_nossl.exe -p CreateData1_Menu.zip InstallerConfig1_Menu.xml
pause