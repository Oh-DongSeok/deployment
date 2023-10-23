@echo off

REM The following directory is for .NET 4.5
set DOTNETFX45=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319
set PATH=%PATH%;%DOTNETFX45%

echo Uninstalling SmartWhere v3.0...
echo ---------------------------------------------------------------
InstallUtil /u SmartWhere_WatchService.exe
InstallUtil /u SmartWhere_ReceiveService.exe
InstallUtil /u PdfReceive.exe
InstallUtil /u SmartWhere_AnalyzeService.exe
InstallUtil /u SmartWhere_AnalyzeService_Heavy.exe
InstallUtil /u SmartWhere_PostScheduleService.exe
InstallUtil /u SmartWhere_BackgroundService.exe
echo ---------------------------------------------------------------
echo - DONE