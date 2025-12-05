# Design Document: Docker CI/CD Deployment

## Overview

This design document outlines the implementation of a CI/CD pipeline using GitHub Actions to automatically build and deploy a React/Vite application as a Docker container to Aliyun Container Registry. The system consists of three main components: a Dockerfile for containerizing the application, a GitHub Actions workflow for automation, and configuration for the target repository and registry.

The application is a React-based web application built with Vite, using TypeScript and requiring environment variables for API keys. The Docker image will use a multi-stage build to optimize size and security, and the GitHub Actions workflow will handle authentication, building, tagging, and pushing to Aliyun ACR.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Developer      │
│  Pushes Code    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     GitHub Repository               │
│  https://github.com/Frank-          │
│  Unlimited/Test.git                 │
└────────┬────────────────────────────┘
         │
         │ Triggers
         ▼
┌─────────────────────────────────────┐
│    GitHub Actions Workflow          │
│  ┌───────────────────────────────┐  │
│  │ 1. Checkout Code              │  │
│  │ 2. Setup Docker Buildx        │  │
│  │ 3. Login to Aliyun ACR        │  │
│  │ 4. Extract Metadata/Tags      │  │
│  │ 5. Build Docker Image         │  │
│  │ 6. Push to Registry           │  │
│  └───────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         │ Pushes Image
         ▼
┌─────────────────────────────────────┐
│   Aliyun Container Registry         │
│   crpi-925djdtsud86yqkr.cn-         │
│   hangzhou.personal.cr.aliyuncs.com │
│   /hhc510105200301150090/hhc        │
└─────────────────────────────────────┘
```

### Component Interaction Flow

1. **Trigger Phase**: Code push or PR creation triggers the workflow
2. **Setup Phase**: Workflow prepares the build environment
3. **Authentication Phase**: Workflow authenticates with Aliyun ACR using secrets
4. **Build Phase**: Docker builds the application image using multi-stage build
5. **Push Phase**: Image is tagged and pushed to the registry (except for PRs)
6. **Reporting Phase**: Workflow outputs build results and image information

## Components and Interfaces

### 1. Dockerfile

**Purpose**: Define the container image build process for the React/Vite application

**Build Stages**:
- **Stage 1 (Builder)**: Build the application
  - Base: `node:18-alpine`
  - Install dependencies using npm
  - Build production assets with `npm run build`
  
- **Stage 2 (Production)**: Serve the application
  - Base: `nginx:alpine`
  - Copy built assets from builder stage
  - Configure nginx to serve the SPA
  - Expose port 80

**Environment Variables**:
- `GEMINI_API_KEY`: Required at build time for Vite's define plugin

### 2. GitHub Actions Workflow

**File Location**: `.github/workflows/alibabacloud.yml`

**Trigger Configuration**:
```yaml
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:
```

**Environment Variables**:
- `DOCKER_REGISTRY`: `crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com`
- `IMAGE_NAME`: `hhc`
- `IMAGE_NAMESPACE`: `hhc510105200301150090`
- `DOCKERFILE_PATH`: `Dockerfile`
- `BUILD_CONTEXT`: `.` (root directory)

**Required Secrets**:
- `ALIYUN_ACR_USERNAME`: Aliyun ACR username
- `ALIYUN_ACR_PASSWORD`: Aliyun ACR password

**Workflow Steps**:

1. **Checkout Code** (`actions/checkout@v4`)
   - Fetches the repository code

2. **Setup Docker Buildx** (`docker/setup-buildx-action@v3`)
   - Configures Docker BuildKit for advanced build features

3. **Login to Aliyun ACR**
   - Conditional: Only runs for non-PR events
   - Uses `docker login` with credentials from secrets

4. **Extract Metadata** (`docker/metadata-action@v5`)
   - Generates image tags based on:
     - Branch name
     - PR reference
     - Commit SHA
     - "latest" tag for main/master branches

5. **Build and Push** (`docker/build-push-action@v5`)
   - Builds the Docker image
   - Pushes to registry (conditional on non-PR events)
   - Applies generated tags and labels

6. **Output Image Info**
   - Displays build results
   - Shows image tags and registry URL

### 3. Nginx Configuration

**Purpose**: Configure nginx to properly serve the React SPA

**Key Configuration**:
- Serve static files from `/usr/share/nginx/html`
- Route all requests to `index.html` for client-side routing
- Enable gzip compression
- Set appropriate cache headers

## Data Models

### Image Tag Structure

Tags follow these patterns:

1. **Branch-based**: `<branch-name>`
   - Example: `main`, `feature-auth`

2. **SHA-based**: `<branch-name>-<short-sha>`
   - Example: `main-a1b2c3d`

3. **PR-based**: `pr-<number>`
   - Example: `pr-42`

4. **Latest**: `latest`
   - Only applied to main/master branch builds

### Full Image Path Format

```
<DOCKER_REGISTRY>/<IMAGE_NAMESPACE>/<IMAGE_NAME>:<TAG>
```

Example:
```
crpi-925djdtsud86yqkr.cn-hangzhou.personal.cr.aliyuncs.com/hhc510105200301150090/hhc:latest
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable criteria from the prework, I've identified that most of these are configuration validation examples rather than universal properties. Since we're dealing with static configuration files (YAML and Dockerfile), the testable aspects are primarily about verifying that specific configuration elements exist and are correctly formatted. These are best tested as examples rather than properties that hold across many inputs.

There are no logically redundant properties to eliminate, as each criterion validates a distinct aspect of the configuration.

### Correctness Properties

Since this feature involves static configuration files (GitHub Actions YAML and Dockerfile) rather than dynamic runtime behavior, most validation is example-based rather than property-based. The following examples verify that the configuration files are correctly structured:

**Example 1: Workflow triggers on main/master push**
The workflow configuration file should contain push triggers for main and master branches.
**Validates: Requirements 1.1, 1.3**

**Example 2: Workflow triggers on pull requests**
The workflow configuration file should contain pull_request triggers for main and master branches.
**Validates: Requirements 2.1**

**Example 3: Workflow supports manual dispatch**
The workflow configuration file should include workflow_dispatch trigger.
**Validates: Requirements 3.1**

**Example 4: Push is conditional on event type**
The build-and-push step should have a conditional that prevents pushing for pull request events.
**Validates: Requirements 1.2, 2.2**

**Example 5: Workflow uses GitHub Secrets for authentication**
The login step should reference secrets.ALIYUN_ACR_USERNAME and secrets.ALIYUN_ACR_PASSWORD.
**Validates: Requirements 4.1, 4.2**

**Example 6: Image tags include latest for main/master**
The metadata action configuration should include a tag rule for "latest" that is enabled only for main/master branches.
**Validates: Requirements 5.1**

**Example 7: Image tags include branch name**
The metadata action configuration should include type=ref,event=branch for branch-based tagging.
**Validates: Requirements 5.2**

**Example 8: Image tags include commit SHA**
The metadata action configuration should include type=sha with branch prefix for SHA-based tagging.
**Validates: Requirements 5.3**

**Example 9: Image tags include PR reference**
The metadata action configuration should include type=ref,event=pr for pull request tagging.
**Validates: Requirements 5.4**

**Example 10: Workflow uses correct Dockerfile path**
The build step should reference the DOCKERFILE_PATH environment variable in the file parameter.
**Validates: Requirements 6.1**

**Example 11: Workflow uses correct build context**
The build step should reference the BUILD_CONTEXT environment variable in the context parameter.
**Validates: Requirements 6.2**

**Example 12: Dockerfile installs dependencies**
The Dockerfile should contain commands to install npm dependencies (npm install or npm ci).
**Validates: Requirements 7.1**

**Example 13: Dockerfile copies application files**
The Dockerfile should contain COPY commands to include application source files.
**Validates: Requirements 7.2**

**Example 14: Dockerfile uses appropriate base images**
The Dockerfile should use node-based image for building and nginx for serving.
**Validates: Requirements 7.4**

**Example 15: Workflow defines registry environment variable**
The workflow should define DOCKER_REGISTRY in the env section.
**Validates: Requirements 8.1**

**Example 16: Workflow defines image name environment variable**
The workflow should define IMAGE_NAME in the env section.
**Validates: Requirements 8.2**

**Example 17: Workflow defines namespace environment variable**
The workflow should define IMAGE_NAMESPACE in the env section.
**Validates: Requirements 8.3**

**Example 18: Metadata action constructs correct image path**
The metadata action's images field should use the format: ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAMESPACE }}/${{ env.IMAGE_NAME }}.
**Validates: Requirements 8.4**

## Error Handling

### Workflow Errors

1. **Authentication Failures**
   - If docker login fails, the workflow will exit with an error
   - Error message will indicate authentication failure
   - Subsequent steps will not execute

2. **Build Failures**
   - If Docker build fails, the workflow will exit with an error
   - Build logs will be available in the GitHub Actions output
   - No image will be pushed to the registry

3. **Push Failures**
   - If image push fails, the workflow will exit with an error
   - Error message will indicate push failure
   - Previous successful builds remain in the registry

4. **Missing Secrets**
   - If required secrets are not configured, the login step will fail
   - Clear error message indicating missing secrets

### Dockerfile Errors

1. **Missing Dependencies**
   - If package.json is not found, npm install will fail
   - Build will exit with error

2. **Build Failures**
   - If npm run build fails, the Docker build will fail
   - Error logs will show the build failure reason

3. **Missing Files**
   - If COPY commands reference non-existent files, build will fail
   - Error message will indicate which files are missing

### Runtime Errors

1. **Port Conflicts**
   - If port 80 is already in use, container will fail to start
   - Error message will indicate port binding failure

2. **Missing Environment Variables**
   - If GEMINI_API_KEY is not provided at build time, the application may not function correctly
   - Application should handle missing API key gracefully

## Testing Strategy

### Configuration Validation Tests

Since this feature primarily involves static configuration files, testing will focus on validating that the configuration files are correctly structured and contain the required elements.

**Test Approach**:
- Parse YAML and Dockerfile files
- Verify presence of required configuration elements
- Validate syntax and structure
- Check for correct references to environment variables and secrets

**Test Framework**: 
- For YAML validation: Use a YAML parser library (e.g., `js-yaml` for Node.js)
- For Dockerfile validation: Use Dockerfile parser or regex-based validation
- Unit testing framework: Jest or Vitest

**Test Coverage**:
- Each correctness example should have a corresponding unit test
- Tests should verify the static configuration matches requirements
- Tests should be fast and not require external services

### Unit Tests

Unit tests will verify that configuration files contain the correct structure:

1. **Workflow Configuration Tests**
   - Verify trigger configuration (push, pull_request, workflow_dispatch)
   - Verify environment variables are defined
   - Verify steps are in correct order
   - Verify conditional expressions are correct
   - Verify secrets are referenced correctly

2. **Dockerfile Tests**
   - Verify multi-stage build structure
   - Verify base images are correct
   - Verify COPY commands include necessary files
   - Verify dependency installation commands are present
   - Verify EXPOSE directive is correct

3. **Integration Tests** (Optional)
   - Build the Docker image locally
   - Run the container and verify it starts successfully
   - Verify the application is accessible on the expected port
   - These tests require Docker to be installed and running

### Manual Testing

Before deploying to production:

1. **Test Workflow Execution**
   - Push to a test branch and verify workflow triggers
   - Create a PR and verify build-only behavior
   - Manually trigger workflow and verify execution

2. **Test Image Functionality**
   - Pull the built image from Aliyun ACR
   - Run the container locally
   - Verify the application works correctly

3. **Test Authentication**
   - Verify GitHub Secrets are configured correctly
   - Verify workflow can authenticate with Aliyun ACR

## Security Considerations

1. **Secrets Management**
   - Never commit credentials to the repository
   - Use GitHub Secrets for all sensitive data
   - Rotate credentials periodically

2. **Image Security**
   - Use official base images from trusted sources
   - Keep base images updated to patch vulnerabilities
   - Use alpine variants for smaller attack surface
   - Run container as non-root user where possible

3. **Access Control**
   - Limit who can trigger workflows
   - Restrict access to GitHub Secrets
   - Use least-privilege access for Aliyun ACR credentials

## Deployment Considerations

1. **Initial Setup**
   - Configure GitHub Secrets before first workflow run
   - Verify Aliyun ACR namespace exists
   - Test workflow with a test push

2. **Monitoring**
   - Monitor workflow execution in GitHub Actions tab
   - Check Aliyun ACR for successful image pushes
   - Set up notifications for workflow failures

3. **Rollback Strategy**
   - Previous image versions remain in registry
   - Can pull and deploy older tags if needed
   - Use semantic versioning tags for production deployments

## Future Enhancements

1. **Semantic Versioning**
   - Add support for version tags based on git tags
   - Implement automatic version bumping

2. **Multi-Architecture Builds**
   - Build images for multiple architectures (amd64, arm64)
   - Use Docker Buildx for cross-platform builds

3. **Image Scanning**
   - Integrate vulnerability scanning in the workflow
   - Fail builds if critical vulnerabilities are found

4. **Deployment Automation**
   - Automatically deploy to staging/production after successful build
   - Integrate with Kubernetes or other orchestration platforms

5. **Build Caching**
   - Implement layer caching to speed up builds
   - Note: Aliyun ACR may have limitations with BuildKit cache
