@echo off
echo ========================================
echo 从阿里云 ACR 运行 Docker 容器
echo ========================================
echo.

REM 设置你的 API Key（请替换为真实的 key）
set GEMINI_API_KEY=PLACEHOLDER_API_KEY

echo 提示：请在脚本中设置真实的 GEMINI_API_KEY
echo 当前 API Key: %GEMINI_API_KEY%
echo.

REM 停止并删除旧容器（如果存在）
docker stop hhc-prod 2>nul
docker rm hhc-prod 2>nul

echo 启动容器...
docker run -d ^
  -p 8080:80 ^
  --name hhc-prod ^
  -e GEMINI_API_KEY=%GEMINI_API_KEY% ^
  crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 容器启动成功！
    echo.
    echo 📦 容器名称: hhc-prod
    echo 🌐 访问地址: http://localhost:8080
    echo.
    echo 查看日志: docker logs hhc-prod
    echo 停止容器: docker stop hhc-prod
    echo 删除容器: docker rm hhc-prod
    echo.
    echo 正在打开浏览器...
    timeout /t 2 >nul
    start http://localhost:8080
) else (
    echo.
    echo ❌ 容器启动失败！
    echo 请检查 Docker 是否正在运行
)

pause
