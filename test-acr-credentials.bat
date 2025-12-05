@echo off
REM 阿里云 ACR 凭证测试脚本 (Windows)
REM 使用方法: test-acr-credentials.bat <username> <password>

echo ==========================================
echo 阿里云 ACR 凭证测试
echo ==========================================
echo.

REM 检查参数
if "%~1"=="" (
    echo 使用方法: %~nx0 ^<username^> ^<password^>
    echo.
    echo 示例:
    echo   %~nx0 myusername@example.com myPassword123
    echo.
    exit /b 1
)

if "%~2"=="" (
    echo 使用方法: %~nx0 ^<username^> ^<password^>
    echo.
    echo 示例:
    echo   %~nx0 myusername@example.com myPassword123
    echo.
    exit /b 1
)

set USERNAME=%~1
set PASSWORD=%~2
set REGISTRY=crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com

echo 正在测试登录到: %REGISTRY%
echo 用户名: %USERNAME%
echo.

REM 测试登录
echo %PASSWORD% | docker login %REGISTRY% --username %USERNAME% --password-stdin

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo ✓ 登录成功！
    echo ==========================================
    echo.
    echo 你的凭证是正确的，可以配置到 GitHub Secrets：
    echo.
    echo ALIYUN_ACR_USERNAME: %USERNAME%
    echo ALIYUN_ACR_PASSWORD: [已隐藏]
    echo.
    echo 下一步：
    echo 1. 访问: https://github.com/Frank-Unlimited/Test/settings/secrets/actions
    echo 2. 添加上述两个 secrets
    echo.
    
    echo 正在检查镜像仓库...
    docker pull %REGISTRY%/hhc510105200301150090/hhc:latest 2^>^&1
    
    exit /b 0
) else (
    echo.
    echo ==========================================
    echo ✗ 登录失败！
    echo ==========================================
    echo.
    echo 可能的原因：
    echo 1. 用户名或密码错误
    echo 2. 密码已过期，需要重置
    echo 3. 网络连接问题
    echo 4. Docker 守护进程未运行
    echo.
    echo 解决方案：
    echo 1. 访问阿里云控制台重置密码: https://cr.console.aliyun.com/cn-hangzhou/instances/credentials
    echo 2. 确保 Docker Desktop 正在运行
    echo 3. 检查网络连接
    echo.
    exit /b 1
)
