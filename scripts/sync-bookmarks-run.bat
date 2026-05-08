@echo off
REM Wrapper: uruchamia sync-bookmarks.cjs z logowaniem
set NODE="C:\Program Files\nodejs\node.exe"
set SCRIPT_DIR=%~dp0
set LOG_FILE=c:\tmp\sporting-bookmarks-sync.log

echo. >> "%LOG_FILE%"
echo ========================================  >> "%LOG_FILE%"
echo Sync run: %date% %time% >> "%LOG_FILE%"
echo ========================================  >> "%LOG_FILE%"
%NODE% "%SCRIPT_DIR%sync-bookmarks.cjs" >> "%LOG_FILE%" 2>&1
echo Exit code: %ERRORLEVEL% >> "%LOG_FILE%"
exit /b %ERRORLEVEL%
