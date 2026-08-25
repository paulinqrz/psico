@echo off
cd /d "%~dp0"
echo ========================================================
echo  Iniciando Aplicativo - Marcia Helena Psicologia
echo ========================================================
echo.
echo Verificando dependencias...
call npm install
if not exist "node_modules\@rollup\rollup-win32-x64-msvc" (
    echo Ajustando dependencias nativas do Windows...
    call npm install -D @rollup/rollup-win32-x64-msvc --no-save >nul 2>&1
)
echo.
echo Compilando atualizacoes do sistema...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Tentando corrigir modulo Rollup do Windows...
    call npm install -D @rollup/rollup-win32-x64-msvc
    call npm run build
)

if not exist "dist\server.cjs" (
    echo.
    echo ========================================================
    echo  ERRO: Nao foi possivel compilar o aplicativo.
    echo  Abra o CMD nesta pasta e execute:
    echo  npm install -D @rollup/rollup-win32-x64-msvc
    echo  npm run build
    echo ========================================================
    pause
    exit /b 1
)

echo.
echo Abrindo o aplicativo...
call npm start
exit
