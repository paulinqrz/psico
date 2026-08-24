@echo off
cd /d "%~dp0"
echo ========================================================
echo  Iniciando Aplicativo - Marcia Helena Psicologia
echo ========================================================
echo.
echo Verificando dependencias...
call npm install
echo.
echo Compilando atualizacoes do sistema...
call npm run build
echo.
echo Abrindo o aplicativo...
call npm start
exit
