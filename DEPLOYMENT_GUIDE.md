# 部署指南

本指南将帮助你完成 CI/CD 流水线的设置和本地 Docker 测试。

## 第一步：配置 GitHub Secrets（CI/CD 流水线设置）

### 1.1 获取阿里云 ACR 凭证

首先，你需要获取阿里云容器镜像服务的访问凭证：

1. 登录 [阿里云控制台](https://cr.console.aliyun.com/)
2. 进入 **容器镜像服务** → **访问凭证**
3. 记录以下信息：
   - 用户名（通常是你的阿里云账号）
   - 密码（如果忘记可以重置）
   - 仓库地址：`crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com`

### 1.2 在 GitHub 中配置 Secrets

1. 打开你的 GitHub 仓库：https://github.com/Frank-Unlimited/Test
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮
5. 添加以下两个 secrets：

**Secret 1:**
- Name: `ALIYUN_ACR_USERNAME`
- Value: 你的阿里云 ACR 用户名

**Secret 2:**
- Name: `ALIYUN_ACR_PASSWORD`
- Value: 你的阿里云 ACR 密码

### 1.3 验证配置

配置完成后，你可以通过以下方式触发工作流：

**方式 1：推送代码到 main/master 分支**
```bash
git add .
git commit -m "test: trigger CI/CD pipeline"
git push origin main
```

**方式 2：手动触发工作流**
1. 进入 GitHub 仓库的 **Actions** 标签页
2. 在左侧选择 **Build and Push to Aliyun ACR** 工作流
3. 点击右侧的 **Run workflow** 按钮
4. 选择分支（通常是 main）
5. 点击绿色的 **Run workflow** 按钮

### 1.4 监控工作流执行

1. 在 **Actions** 标签页中，你会看到正在运行的工作流
2. 点击工作流名称查看详细日志
3. 等待所有步骤完成（通常需要 3-5 分钟）
4. 成功后，你会看到绿色的勾号 ✓

### 1.5 验证镜像已推送

工作流成功后，镜像会被推送到阿里云 ACR。你可以：

1. 登录阿里云控制台
2. 进入 **容器镜像服务** → **镜像仓库**
3. 找到命名空间 `hhc510105200301150090` 下的 `hhc` 仓库
4. 查看镜像标签（应该包含 `latest`、分支名、commit SHA 等）

---

## 第二步：本地 Docker 构建测试

### 2.1 启动 Docker Desktop

在进行本地测试之前，确保 Docker Desktop 正在运行：

**Windows:**
1. 打开 Docker Desktop 应用程序
2. 等待 Docker 引擎启动（任务栏图标变为绿色）
3. 验证 Docker 是否运行：
   ```bash
   docker --version
   docker ps
   ```

**如果 Docker 未安装：**
- 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

### 2.2 本地构建 Docker 镜像

在项目根目录执行：

```bash
docker build -t hhc:local .
```

**预期输出：**
- 构建过程会显示两个阶段（Stage 1: Builder, Stage 2: Production）
- 安装依赖、构建应用、配置 nginx
- 最后显示 `Successfully built` 和镜像 ID

**构建时间：** 首次构建约 2-5 分钟（取决于网络速度）

### 2.3 运行容器

构建成功后，运行容器：

```bash
docker run -p 8080:80 hhc:local
```

**参数说明：**
- `-p 8080:80`：将容器的 80 端口映射到主机的 8080 端口
- `hhc:local`：使用刚才构建的镜像

### 2.4 访问应用

1. 打开浏览器
2. 访问：http://localhost:8080
3. 你应该能看到应用界面

**注意：** 由于 `.env.local` 中的 API key 是占位符，应用的 AI 功能可能无法正常工作。这是预期的，只要页面能加载就说明 Docker 镜像构建成功。

### 2.5 后台运行容器（可选）

如果想让容器在后台运行：

```bash
# 启动容器（后台模式）
docker run -d -p 8080:80 --name hhc-app hhc:local

# 查看运行中的容器
docker ps

# 查看容器日志
docker logs hhc-app

# 停止容器
docker stop hhc-app

# 删除容器
docker rm hhc-app
```

### 2.6 清理（可选）

测试完成后，可以清理本地镜像：

```bash
# 停止并删除容器
docker stop hhc-app
docker rm hhc-app

# 删除镜像
docker rmi hhc:local

# 清理未使用的镜像和缓存
docker system prune -a
```

---

## 常见问题

### Q1: Docker 构建失败，提示找不到文件

**解决方案：**
- 确保在项目根目录执行构建命令
- 检查 `package.json`、`package-lock.json` 是否存在
- 确保所有源代码文件都已提交

### Q2: 容器启动后无法访问

**解决方案：**
- 检查端口是否被占用：`netstat -ano | findstr :8080`
- 尝试使用其他端口：`docker run -p 3000:80 hhc:local`
- 查看容器日志：`docker logs <container-id>`

### Q3: GitHub Actions 工作流失败

**解决方案：**
- 检查 Secrets 是否正确配置
- 查看工作流日志中的具体错误信息
- 确保阿里云 ACR 凭证有效
- 验证命名空间 `hhc510105200301150090` 存在

### Q4: 镜像构建成功但应用不工作

**解决方案：**
- 这可能是因为 API key 是占位符
- 在 `.env.local` 中设置真实的 `GEMINI_API_KEY`
- 重新构建镜像

---

## 下一步

完成以上两步后，你的 CI/CD 流水线就完全配置好了！

**自动化流程：**
1. 每次推送代码到 main/master 分支
2. GitHub Actions 自动构建 Docker 镜像
3. 镜像自动推送到阿里云 ACR
4. 你可以从 ACR 拉取镜像部署到任何环境

**生产部署建议：**
- 使用真实的 API key
- 配置 HTTPS
- 使用 Kubernetes 或其他容器编排工具
- 设置监控和日志收集
- 配置自动扩缩容

