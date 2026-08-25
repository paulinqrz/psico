@echo off
title Criar Atalho na Area de Trabalho
color 0B

echo ========================================================
echo   Criando Atalho - Marcia Helena Psicologia
echo ========================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "TARGET_FILE=%SCRIPT_DIR%INICIAR_CLINICA.vbs"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.Environment]::GetFolderPath('Desktop'); $shortcut = $ws.CreateShortcut(\"$desktop\Marcia Helena - Psicologia.lnk\"); $shortcut.TargetPath = '%TARGET_FILE%'; $shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $shortcut.IconLocation = 'shell32.dll,23'; $shortcut.Description = 'Sistema de Gestao e Prontuarios Psicologicos'; $shortcut.Save()"

if %errorlevel% equ 0 (
    echo.
    echo [SUCESSO] O atalho 'Marcia Helena - Psicologia' foi criado na sua Area de Trabalho!
    echo Agora voce pode abrir o sistema diretamente por la com um clique duplo.
) else (
    echo.
    echo [AVISO] Nao foi possivel criar o atalho automaticamente.
    echo Voce pode clicar com o botao direito em 'INICIAR_CLINICA.vbs' e escolher 'Enviar para' -^> 'Area de trabalho (criar atalho)'.
)

echo.
echo ========================================================
pause
