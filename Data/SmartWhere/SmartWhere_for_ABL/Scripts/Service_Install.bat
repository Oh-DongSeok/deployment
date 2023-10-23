@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Installing SmartWhere v3.0...
echo ---------------------------------------------------------------
InstallUtil SmartWhere_ReceiveService.exe
InstallUtil PdfReceive.exe
InstallUtil SmartWhere_AnalyzeService.exe
InstallUtil SmartWhere_AnalyzeService_Heavy.exe
InstallUtil SmartWhere_PostScheduleService.exe
InstallUtil SmartWhere_BackgroundService.exe
InstallUtil SmartWhere_WatchService.exe
sc start SmartWhere_WatchService
echo ---------------------------------------------------------------
echo - DONE
pause