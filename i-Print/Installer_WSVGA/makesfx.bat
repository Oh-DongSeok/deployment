@ECHO OFF
SETLOCAL

@REM define maker and artefacts paths.

SET SFXMAKER_PATH=%~dp0lib
SET SFXMAKER="%SFXMAKER_PATH%\makesfx.exe" -s "%SFXMAKER_PATH%\winmain.sfx" "%SFXMAKER_PATH%\installer"
SET VALIDATOR="%SFXMAKER_PATH%\validateSFXConfig.exe"
SET VALIDATOR_XSD="%SFXMAKER_PATH%\SFXInstall.xsd"
SET PATH=%SFXMAKER_PATH%;%SFXMAKER_PATH%\installer\lib;%PATH%

@REM Check arguments

SET HAS_FILES=false

:Loop
IF "%~1"=="" GOTO Continue
IF EXIST %1 SET HAS_FILES=true
SHIFT
GOTO Loop
:Continue

IF %HAS_FILES%==false (
    ECHO Synopsis:
    ECHO makesfx.bat [-o output] -p pkg_1.zip [pkg_2.zip] . . . [pkg_n.zip] InstallerConfig.xml
    ECHO.
    ECHO Default output is sfxinst.exe.
    GOTO:EOF
)
@REM Validate configuration file
%VALIDATOR% --xsd %VALIDATOR_XSD% %*
IF ERRORLEVEL 1 GOTO:EOF

@REM Make the SFX
ECHO Making SFX Installer ...
%SFXMAKER% %*
