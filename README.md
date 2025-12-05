<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally and deploy it using Docker and CI/CD.

View your app in AI Studio: https://ai.studio/apps/drive/1X4NDEbY73l-Askw7b3bJOnBd-Rq8BXq-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Docker Deployment

### Prerequisites

- Docker installed on your local machine
- Access to Aliyun Container Registry (ACR)
- GitHub repository with Actions enabled

### Building the Docker Image Locally

To build the Docker image locally:

```bash
docker build -t hhc:local .
```

To run the container locally:

```bash
docker run -p 8080:80 hhc:local
```

The application will be available at `http://localhost:8080`

### CI/CD Pipeline Setup

This project includes an automated CI/CD pipeline using GitHub Actions that builds and pushes Docker images to Aliyun Container Registry.

#### Required GitHub Secrets Configuration

Before the workflow can run successfully, you must configure the following secrets in your GitHub repository:

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `ALIYUN_ACR_USERNAME` | Your Aliyun Container Registry username | `your-username` |
| `ALIYUN_ACR_PASSWORD` | Your Aliyun Container Registry password | `your-password` |

**Note:** Never commit these credentials to your repository. Always use GitHub Secrets.

#### Workflow Triggers

The CI/CD workflow automatically triggers in the following scenarios:

1. **Push to main/master branch**: Builds and pushes the Docker image with tags
2. **Pull Request to main/master**: Builds the image but does not push (validation only)
3. **Manual Trigger**: Can be triggered manually through GitHub Actions interface

#### How to Manually Trigger the Workflow

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select the **Build and Push to Aliyun ACR** workflow from the left sidebar
4. Click the **Run workflow** button on the right
5. Select the branch you want to build from
6. Click **Run workflow**

The workflow will execute and you can monitor its progress in real-time.

#### Image Tags

The workflow automatically generates the following tags for built images:

- `latest` - Only applied to builds from main/master branches
- `<branch-name>` - The name of the branch (e.g., `main`, `feature-auth`)
- `<branch-name>-<short-sha>` - Branch name with commit SHA (e.g., `main-a1b2c3d`)
- `pr-<number>` - For pull request builds (e.g., `pr-42`)

#### Pulling and Running the Built Image

After the workflow successfully pushes an image to Aliyun ACR, you can pull and run it:

1. **Login to Aliyun Container Registry:**

```bash
docker login crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com
```

Enter your Aliyun ACR username and password when prompted.

2. **Pull the image:**

```bash
docker pull crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest
```

Or pull a specific tag:

```bash
docker pull crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:main-a1b2c3d
```

3. **Run the container:**

```bash
docker run -p 8080:80 crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest
```

The application will be available at `http://localhost:8080`

4. **Run in detached mode (background):**

```bash
docker run -d -p 8080:80 --name hhc-app crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest
```

5. **Stop the container:**

```bash
docker stop hhc-app
docker rm hhc-app
```

### Troubleshooting

#### Workflow Fails at Authentication Step

**Problem:** The workflow fails with "Error: Cannot perform an interactive login from a non TTY device" or authentication errors.

**Solution:**
- Verify that `ALIYUN_ACR_USERNAME` and `ALIYUN_ACR_PASSWORD` secrets are correctly configured in GitHub
- Ensure the credentials are valid by testing them locally with `docker login`
- Check that the registry URL is correct: `crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com`

#### Workflow Fails at Build Step

**Problem:** The Docker build fails with errors about missing files or dependencies.

**Solution:**
- Check that all required files are committed to the repository
- Verify that `package.json` and `package-lock.json` are present
- Review the build logs in GitHub Actions for specific error messages
- Test the build locally using `docker build -t test .`

#### Workflow Fails at Push Step

**Problem:** The image builds successfully but fails to push to the registry.

**Solution:**
- Verify your Aliyun ACR credentials have push permissions
- Check that the namespace `hhc510105200301150090` exists in your Aliyun ACR
- Ensure you have sufficient storage quota in your Aliyun ACR account
- Verify network connectivity between GitHub Actions and Aliyun services

#### Image Pulls Successfully but Container Fails to Start

**Problem:** The container exits immediately or fails to start.

**Solution:**
- Check container logs: `docker logs <container-id>`
- Verify port 80 is not already in use on your host machine
- Try running with interactive mode to see errors: `docker run -it <image-name> sh`
- Ensure the nginx configuration is correct

#### Application Not Accessible After Container Starts

**Problem:** Container is running but the application is not accessible in the browser.

**Solution:**
- Verify the port mapping is correct: `-p 8080:80` maps host port 8080 to container port 80
- Check if the container is actually running: `docker ps`
- Try accessing with `curl http://localhost:8080` to rule out browser issues
- Check container logs for nginx errors: `docker logs <container-name>`

#### Pull Request Builds Are Pushing Images

**Problem:** Images are being pushed to the registry for pull requests.

**Solution:**
- This should not happen as the workflow has a conditional check
- Verify the workflow file has: `if: github.event_name != 'pull_request'` on the push step
- Check the workflow run logs to see which event triggered it

#### Wrong Image Tags Are Generated

**Problem:** The image tags don't match expectations.

**Solution:**
- Review the metadata action configuration in `.github/workflows/alibabacloud.yml`
- Check that the branch name doesn't contain special characters
- For custom tags, consider modifying the metadata action configuration

#### Cannot Access Aliyun Container Registry

**Problem:** `docker login` or `docker pull` fails with network or DNS errors.

**Solution:**
- Verify you have network access to Aliyun services
- Check if your firewall or VPN is blocking access
- Try accessing the registry URL in a browser to test connectivity
- Ensure the registry URL is correct and hasn't changed

### Configuration

The workflow uses the following configuration (defined in `.github/workflows/alibabacloud.yml`):

- **Registry:** `crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com`
- **Namespace:** `hhc510105200301150090`
- **Image Name:** `hhc`
- **Dockerfile Path:** `Dockerfile` (root directory)
- **Build Context:** `.` (root directory)

To modify these values, edit the environment variables in the workflow file.
