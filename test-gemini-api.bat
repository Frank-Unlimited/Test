@echo off
chcp 65001 >nul
echo ========================================
echo    Gemini API Key 验证工具
echo ========================================
echo.

REM 检查是否安装了 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未找到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查参数
if "%~1"=="" (
    echo 请输入你的 Gemini API Key:
    set /p API_KEY=
) else (
    set API_KEY=%~1
)

if "%API_KEY%"=="" (
    echo ❌ 错误: API Key 不能为空
    echo.
    pause
    exit /b 1
)

echo.
echo 开始验证...
echo.

REM 运行验证脚本
node test-gemini-api.cjs "%API_KEY%"

echo.
echo ========================================
pause
