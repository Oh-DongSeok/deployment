@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Starting SmartWhere v3.0... (without Watcher)
echo ---------------------------------------------------------------
sc start SmartWhere_ReceiveService
sc start PdfReceive
sc start SmartWhere_AnalyzeService
sc start SmartWhere_AnalyzeService_Heavy.exe
sc start SmartWhere_PostScheduleService
sc start SmartWhere_BackgroundService
echo ---------------------------------------------------------------
echo - DONE
pause