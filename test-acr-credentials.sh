#!/bin/bash

# 阿里云 ACR 凭证测试脚本
# 使用方法: ./test-acr-credentials.sh <username> <password>

echo "=========================================="
echo "阿里云 ACR 凭证测试"
echo "=========================================="
echo ""

# 检查参数
if [ $# -ne 2 ]; then
    echo "使用方法: $0 <username> <password>"
    echo ""
    echo "示例:"
    echo "  $0 myusername@example.com myPassword123"
    echo ""
    exit 1
fi

USERNAME=$1
PASSWORD=$2
REGISTRY="crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com"

echo "正在测试登录到: $REGISTRY"
echo "用户名: $USERNAME"
echo ""

# 测试登录
echo "$PASSWORD" | docker login $REGISTRY --username $USERNAME --password-stdin

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ 登录成功！"
    echo "=========================================="
    echo ""
    echo "你的凭证是正确的，可以配置到 GitHub Secrets："
    echo ""
    echo "ALIYUN_ACR_USERNAME: $USERNAME"
    echo "ALIYUN_ACR_PASSWORD: [已隐藏]"
    echo ""
    echo "下一步："
    echo "1. 访问: https://github.com/Frank-Unlimited/Test/settings/secrets/actions"
    echo "2. 添加上述两个 secrets"
    echo ""
    
    # 尝试列出镜像
    echo "正在检查镜像仓库..."
    docker pull $REGISTRY/hhc510105200301150090/hhc:latest 2>&1 | head -5
    
    exit 0
else
    echo ""
    echo "=========================================="
    echo "✗ 登录失败！"
    echo "=========================================="
    echo ""
    echo "可能的原因："
    echo "1. 用户名或密码错误"
    echo "2. 密码已过期，需要重置"
    echo "3. 网络连接问题"
    echo "4. Docker 守护进程未运行"
    echo ""
    echo "解决方案："
    echo "1. 访问阿里云控制台重置密码: https://cr.console.aliyun.com/cn-hangzhou/instances/credentials"
    echo "2. 确保 Docker Desktop 正在运行"
    echo "3. 检查网络连接"
    echo ""
    exit 1
fi
