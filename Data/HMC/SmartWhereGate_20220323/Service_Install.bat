@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Installing SmartWhere Gate...
echo ---------------------------------------------------------------
InstallUtil SmartWhereGate.exe
echo ---------------------------------------------------------------
echo - DONE
pause