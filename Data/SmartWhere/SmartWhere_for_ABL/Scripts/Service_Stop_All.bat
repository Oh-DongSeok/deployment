@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Stoping SmartWhere v3.0...
echo ---------------------------------------------------------------
sc stop SmartWhere_WatchService
sc stop SmartWhere_ReceiveService
sc stop PdfReceive
sc stop SmartWhere_AnalyzeService
sc stop SmartWhere_AnalyzeService_Heavy.exe
sc stop SmartWhere_PostScheduleService
sc stop SmartWhere_BackgroundService
echo ---------------------------------------------------------------
echo - DONE
pause