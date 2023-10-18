@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Installing SmartGate...
echo ---------------------------------------------------------------
InstallUtil SmartWhereGate.exe
sc start SmartWhereGate
echo ---------------------------------------------------------------
echo - DONE
pause