# 推送代码到 GitHub 指南

## 当前状态

✅ 代码已提交到本地 Git 仓库
✅ 远程仓库已配置：https://github.com/Frank-Unlimited/Test.git
✅ GitHub Secrets 已配置（ALIYUN_ACR_USERNAME 和 ALIYUN_ACR_PASSWORD）
⏳ 等待推送到 GitHub

## 推送方法

### 方法 1：使用 GitHub Desktop（最推荐）

**步骤：**

1. **下载并安装 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **登录 GitHub 账号**
   - 打开 GitHub Desktop
   - File → Options → Accounts → Sign in

3. **添加本地仓库**
   - File → Add Local Repository
   - 选择路径：`E:\PythonProject\bloom---mtf-transformation-guide`
   - 点击 "Add Repository"

4. **推送到 GitHub**
   - 点击顶部的 "Publish repository" 按钮
   - 取消勾选 "Keep this code private"（如果是公开仓库）
   - Repository name: `Test`
   - 点击 "Publish repository"

5. **验证推送成功**
   - 访问：https://github.com/Frank-Unlimited/Test
   - 应该能看到所有文件

### 方法 2：命令行推送（需要稳定网络）

**在网络稳定时执行：**

```bash
# 进入项目目录
cd E:\PythonProject\bloom---mtf-transformation-guide

# 推送到 GitHub
git push -u origin main
```

**如果失败，尝试配置代理：**

```bash
# 配置代理（根据你的代理端口调整）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 重试推送
git push -u origin main

# 如果还是失败，取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方法 3：使用 SSH 方式（如果已配置 SSH 密钥）

```bash
# 更改远程仓库地址为 SSH
git remote set-url origin git@github.com:Frank-Unlimited/Test.git

# 推送
git push -u origin main
```

### 方法 4：手动上传（备用方案）

如果以上方法都不行：

1. 访问：https://github.com/Frank-Unlimited/Test
2. 点击 "uploading an existing file"
3. 将项目文件夹拖拽到页面上传
4. 提交更改

## 推送成功后的验证

### 1. 检查代码是否上传

访问：https://github.com/Frank-Unlimited/Test

应该能看到以下文件：
- `.github/workflows/alibabacloud.yml` ✅
- `Dockerfile` ✅
- `nginx.conf` ✅
- `README.md` ✅
- 其他项目文件

### 2. 检查 GitHub Actions 是否触发

1. 访问：https://github.com/Frank-Unlimited/Test/actions
2. 应该能看到一个正在运行的工作流：**"Build and Push to Aliyun ACR"**
3. 点击工作流查看实时日志

### 3. 监控工作流执行

工作流会执行以下步骤：
- ✅ Checkout code
- ✅ Set up Docker Buildx
- ✅ Login to Aliyun Container Registry
- ✅ Extract metadata (tags, labels) for Docker
- ✅ Build and push Docker image
- ✅ Display build results

**预计时间：** 3-5 分钟

### 4. 验证镜像已推送到阿里云 ACR

**方法 1：通过阿里云控制台**
1. 登录：https://cr.console.aliyun.com/
2. 进入 **镜像仓库**
3. 找到命名空间：`hhc510105200301150090`
4. 找到仓库：`hhc`
5. 查看镜像标签，应该包含：
   - `latest`
   - `main`
   - `main-<commit-sha>`

**方法 2：通过 Docker 命令**
```bash
# 登录阿里云 ACR
docker login crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com

# 拉取镜像
docker pull crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest

# 运行容器测试
docker run -p 8080:80 crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest

# 访问 http://localhost:8080 验证应用
```

## 常见问题

### Q: 推送时提示 "Connection was aborted" 或 "Couldn't connect to server"

**原因：** 网络不稳定或无法访问 GitHub

**解决方案：**
1. 使用 GitHub Desktop（推荐）
2. 配置代理或 VPN
3. 等待网络稳定后重试
4. 使用手机热点尝试

### Q: 推送时提示 "Authentication failed"

**原因：** 需要 GitHub 访问令牌

**解决方案：**
1. 访问：https://github.com/settings/tokens
2. 生成新的 Personal Access Token
3. 使用令牌作为密码推送

### Q: GitHub Actions 工作流失败

**检查步骤：**
1. 查看工作流日志找到具体错误
2. 确认 GitHub Secrets 配置正确
3. 确认阿里云 ACR 凭证有效
4. 检查 Dockerfile 和工作流配置

### Q: 镜像构建成功但推送失败

**可能原因：**
1. 阿里云 ACR 凭证错误
2. 命名空间不存在
3. 权限不足

**解决方案：**
1. 重新配置 GitHub Secrets
2. 在阿里云控制台创建命名空间
3. 检查账号权限

## 下一步

推送成功并且 CI/CD 流水线运行成功后：

1. **自动化已完成** 🎉
   - 每次推送到 main 分支都会自动构建和推送镜像
   - 可以在 Actions 页面监控每次构建

2. **部署镜像**
   - 从阿里云 ACR 拉取镜像
   - 部署到生产环境

3. **持续改进**
   - 添加更多测试
   - 优化构建时间
   - 配置自动部署

## 需要帮助？

如果遇到问题：
1. 查看 GitHub Actions 日志
2. 查看本项目的 README.md 和 DEPLOYMENT_GUIDE.md
3. 检查阿里云 ACR 控制台

---

**重要提醒：**
- 确保 GitHub Secrets 已正确配置
- 确保阿里云 ACR 凭证有效
- 推送前确保网络连接稳定
