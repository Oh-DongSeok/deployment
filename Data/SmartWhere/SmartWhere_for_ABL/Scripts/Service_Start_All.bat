@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Starting SmartWhere v3.0...
echo ---------------------------------------------------------------
sc start SmartWhere_WatchService
echo ---------------------------------------------------------------
echo - DONE
pause