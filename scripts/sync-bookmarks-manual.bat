@echo off
REM Reczne uruchomienie sync-bookmarks z konsolla (skrot na pulpicie)
set NODE="C:\Program Files\nodejs\node.exe"
set SCRIPT_DIR=%~dp0

echo.
echo === Sync Bookmarks Sporting (Default -^> Profile 1) ===
echo.
%NODE% "%SCRIPT_DIR%sync-bookmarks.cjs" %*
echo.
if %ERRORLEVEL% EQU 0 (
  echo Gotowe. Otworz Chrome - zmiany powinny byc widoczne.
) else (
  echo BLAD: kod %ERRORLEVEL%
)
echo.
pause
