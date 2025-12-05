#!/bin/bash

echo "========================================"
echo "从阿里云 ACR 拉取并运行 Docker 容器"
echo "========================================"
echo ""

# 设置变量
REGISTRY="crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com"
IMAGE_PATH="hhc510105200301150090/hhc"
IMAGE_TAG="latest"
CONTAINER_NAME="hhc-app"
PORT="8080"

# 设置你的 API Key（请替换为真实的 key）
GEMINI_API_KEY="${GEMINI_API_KEY:-PLACEHOLDER_API_KEY}"

echo "📋 配置信息:"
echo "   镜像仓库: ${REGISTRY}"
echo "   镜像路径: ${IMAGE_PATH}"
echo "   镜像标签: ${IMAGE_TAG}"
echo "   容器名称: ${CONTAINER_NAME}"
echo "   端口映射: ${PORT}:80"
echo "   API Key: ${GEMINI_API_KEY}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/engine/install/"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ 错误: Docker 服务未运行"
    echo "请启动 Docker 服务: sudo systemctl start docker"
    exit 1
fi

echo "✓ Docker 已就绪"
echo ""

# 登录阿里云 ACR
echo "🔐 登录阿里云容器镜像服务..."
if docker login ${REGISTRY}; then
    echo "✓ 登录成功"
else
    echo "❌ 登录失败"
    echo "请检查你的阿里云 ACR 凭证"
    exit 1
fi
echo ""

# 拉取镜像
echo "📥 拉取 Docker 镜像..."
FULL_IMAGE="${REGISTRY}/${IMAGE_PATH}:${IMAGE_TAG}"
if docker pull ${FULL_IMAGE}; then
    echo "✓ 镜像拉取成功"
else
    echo "❌ 镜像拉取失败"
    exit 1
fi
echo ""

# 停止并删除旧容器（如果存在）
echo "🧹 清理旧容器..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop ${CONTAINER_NAME} 2>/dev/null
    docker rm ${CONTAINER_NAME} 2>/dev/null
    echo "✓ 已清理旧容器"
else
    echo "✓ 无需清理"
fi
echo ""

# 运行容器
echo "🚀 启动容器..."
if docker run -d \
    -p ${PORT}:80 \
    --name ${CONTAINER_NAME} \
    -e GEMINI_API_KEY="${GEMINI_API_KEY}" \
    --restart unless-stopped \
    ${FULL_IMAGE}; then
    
    echo ""
    echo "✅ 容器启动成功！"
    echo ""
    echo "📦 容器信息:"
    echo "   容器名称: ${CONTAINER_NAME}"
    echo "   容器 ID: $(docker ps -qf name=${CONTAINER_NAME})"
    echo ""
    echo "🌐 访问地址:"
    echo "   http://localhost:${PORT}"
    echo "   http://$(hostname -I | awk '{print $1}'):${PORT}"
    echo ""
    echo "📝 常用命令:"
    echo "   查看日志: docker logs ${CONTAINER_NAME}"
    echo "   查看日志(实时): docker logs -f ${CONTAINER_NAME}"
    echo "   停止容器: docker stop ${CONTAINER_NAME}"
    echo "   启动容器: docker start ${CONTAINER_NAME}"
    echo "   删除容器: docker rm -f ${CONTAINER_NAME}"
    echo "   进入容器: docker exec -it ${CONTAINER_NAME} sh"
    echo ""
    
    # 等待容器启动
    echo "⏳ 等待应用启动..."
    sleep 3
    
    # 检查容器状态
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "✓ 容器运行正常"
        
        # 测试应用是否可访问
        if command -v curl &> /dev/null; then
            echo ""
            echo "🔍 测试应用连接..."
            if curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT} | grep -q "200"; then
                echo "✓ 应用可以正常访问"
            else
                echo "⚠ 应用可能还在启动中，请稍后访问"
            fi
        fi
    else
        echo "❌ 容器启动后立即停止，请查看日志:"
        docker logs ${CONTAINER_NAME}
        exit 1
    fi
    
else
    echo ""
    echo "❌ 容器启动失败"
    exit 1
fi

echo ""
echo "========================================"
echo "部署完成！"
echo "========================================"
