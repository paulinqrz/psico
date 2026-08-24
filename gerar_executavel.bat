@echo off
cd /d "%~dp0"
echo ========================================================
echo  Gerador de Executavel (.exe) - Marcia Helena Psicologia
echo ========================================================
echo.
echo Preparando dependencias...
call npm install
echo.
echo Construindo executavel (isso pode levar alguns minutos)...
call npm run build:exe
echo.
echo ========================================================
echo PRONTO! Seu aplicativo foi gerado com sucesso.
echo Procure pelo arquivo .exe dentro da pasta "release".
echo ========================================================
pause
