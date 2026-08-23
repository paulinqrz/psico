@echo off
title Compilador do Clinica Psico App
color 0A
echo ========================================================
echo      Gerador de Executavel (.exe) - Clinica Psico
echo ========================================================
echo.

:: Verifica se o Node.js esta instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] O Node.js nao foi encontrado no seu computador!
    echo Por favor, baixe e instale a versao recomendada em: https://nodejs.org/
    echo (Feche tudo, instale o Node.js e depois de 2 cliques neste arquivo novamente)
    echo.
    pause
    exit /b
)

echo [1/3] Node.js detectado com sucesso!
echo.
echo [2/3] Baixando dependencias do projeto... (Isso pode demorar um pouco)
call npm install

echo.
echo [3/3] Gerando o aplicativo instalavel (.exe)...
call npm run build:exe

echo.
echo ========================================================
echo [CONCLUIDO] Tudo pronto!
echo O seu aplicativo (.exe) foi gerado dentro da pasta "release"!
echo ========================================================
echo.
pause
