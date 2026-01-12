# Octopus Deploy Build Information Demo

A demonstration project showcasing how to integrate GitHub Actions with Octopus Deploy, specifically focusing on how build information flows from GitHub to Octopus Deploy.

## Overview

This project demonstrates the complete CI/CD pipeline integration between GitHub Actions and Octopus Deploy. It shows how to:

- Build and package a Node.js application
- Push packages to Octopus Deploy
- Send rich build information metadata to Octopus Deploy
- Conditionally deploy based on branch (main vs. pull requests)

## What This Demonstrates

Build information is valuable metadata that flows from your CI/CD system (GitHub Actions) to your deployment platform (Octopus Deploy). This includes:

- **Commit SHA**: The exact git commit that was built
- **Branch name**: Which branch triggered the build
- **Build number**: The GitHub Actions run number
- **Build URL**: Direct link back to the GitHub Actions run
- **Commit messages**: What changes were included
- **Committer information**: Who made the changes

This information becomes available in Octopus Deploy releases and can be used in:
- Deployment processes
- Release notes generation
- Audit trails
- Rollback decisions
- Change tracking

## Prerequisites

Before using this demo, you'll need:

1. **GitHub Account**: To fork/clone this repository
2. **Octopus Deploy Server**: Access to an Octopus Deploy instance
   - Cloud: `https://your-instance.octopus.app`
   - Self-hosted: Your server URL
3. **Octopus Deploy API Key**: Generate from your Octopus profile
4. **Octopus Deploy Space** (optional): Defaults to "Default" if not specified

## Setup Instructions

### 1. Fork or Clone This Repository

```bash
git clone https://github.com/YOUR_USERNAME/octopus-build-info-demo.git
cd octopus-build-info-demo
```

### 2. Configure GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add the following repository secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `OCTOPUS_SERVER_URL` | Your Octopus Deploy server URL | `https://your-instance.octopus.app` |
| `OCTOPUS_API_KEY` | API key for authentication | `API-XXXXXXXXXXXXX` |
| `OCTOPUS_SPACE` | The Octopus space name (optional) | `Default` or `MySpace` |

**To create an Octopus API Key:**
1. Log in to Octopus Deploy
2. Click your profile (top right)
3. Select "My API Keys"
4. Click "New API Key"
5. Give it a purpose (e.g., "GitHub Actions")
6. Copy the generated key

### 3. Octopus Deploy Project Setup

Note: This demo handles the GitHub Actions side of the integration. You'll need to set up the following in Octopus Deploy separately:

1. Create a project in Octopus Deploy
2. Configure deployment process (this can be as simple or complex as needed)
3. The package pushed by this workflow will be available for deployment

The actual Octopus Deploy project configuration is outside the scope of this demo.

## How It Works

### Workflow Trigger Strategy

The GitHub Actions workflow uses conditional logic to determine when to push to Octopus Deploy:

- **Pull Requests**: Build and package only (validate the build works)
- **Push to Main Branch**: Build, package, AND push to Octopus Deploy

This is controlled by the `SHOULD_DEPLOY` environment variable:

```yaml
# Set SHOULD_DEPLOY to true only for pushes to main branch
if [ "${{ github.event_name }}" == "push" ] && [ "${{ github.ref }}" == "refs/heads/main" ]; then
  echo "SHOULD_DEPLOY=true"
else
  echo "SHOULD_DEPLOY=false"
fi
```

### Package Versioning

Packages are versioned using the format: `1.0.<run_number>`

- `1.0` is the major.minor version (can be customized)
- `<run_number>` is the GitHub Actions run number (auto-increments)

Example: `1.0.42` for the 42nd workflow run

### Workflow Steps Explained

1. **Checkout Code**: Get the latest code from the repository
2. **Setup Node.js**: Install Node.js version 20
3. **Set Environment Variables**: Determine if we should deploy and set the package version
4. **Display Build Info**: Show debugging information
5. **Install Dependencies**: Run `npm install`
6. **Create Package**: Create a zip file named `octopus-build-info-demo.1.0.X.zip`
7. **Push Package to Octopus** (conditional): Upload the package if `SHOULD_DEPLOY=true`
8. **Push Build Information** (conditional): Send build metadata if `SHOULD_DEPLOY=true`
9. **Summary**: Display workflow summary

## Build Information Captured

When the workflow pushes build information to Octopus Deploy, the following metadata is automatically captured:

- **Version**: `1.0.<run_number>`
- **Commit SHA**: Full git commit hash
- **Branch**: The branch name (e.g., `main`, `feature/new-feature`)
- **Build URL**: Link to the GitHub Actions run
- **Commit Messages**: All commits in the push
- **Author/Committer**: Who made the changes
- **Timestamp**: When the build occurred

## Using Build Information in Octopus

Once build information reaches Octopus Deploy, you can:

### In Release Notes
```
Deployed version 1.0.42
Commits:
- abc1234: Fix authentication bug (John Doe)
- def5678: Add new API endpoint (Jane Smith)
GitHub Build: https://github.com/user/repo/actions/runs/123
```

### In Deployment Processes

Reference build information in deployment scripts:
- Show which commit is being deployed
- Link back to source control
- Display commit messages to approvers

### In the Octopus UI

- View commit details directly in Octopus
- Track which commits are in which releases
- See the full build history for a release

## Testing the Workflow

### Test 1: Pull Request (No Deployment)

1. Create a new branch
2. Make a change (e.g., update `src/index.js`)
3. Push and create a pull request to main
4. GitHub Actions will run and build the package
5. **Expected**: Build succeeds but does NOT push to Octopus

### Test 2: Push to Main (With Deployment)

1. Merge the pull request to main
2. GitHub Actions will run
3. **Expected**: Build succeeds AND pushes package + build info to Octopus

You can verify this by:
- Checking the GitHub Actions logs
- Looking in Octopus Deploy's package feed
- Viewing the build information in your Octopus project

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── build-and-deploy.yml    # GitHub Actions workflow
├── src/
│   └── index.js                    # Simple Express.js application
├── package.json                    # Node.js package configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Application Details

The demo application is a simple Express.js server that:

- Listens on port 3000 (configurable via `PORT` env var)
- Displays its version from `APP_VERSION` env var
- Provides a health check endpoint at `/health`
- Returns a JSON response with timestamp at `/`

To run locally:

```bash
npm install
npm start
```

Then visit `http://localhost:3000` to see the response.

## Additional Resources

- [Octopus Deploy Documentation](https://octopus.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octopus Deploy Build Information](https://octopus.com/docs/packaging-applications/build-servers/build-information)
- [push-package-action](https://github.com/OctopusDeploy/push-package-action)
- [push-build-information-action](https://github.com/OctopusDeploy/push-build-information-action)

## License

MIT

## Questions or Issues?

If you encounter issues with this demo, please check:

1. GitHub Secrets are configured correctly
2. Octopus Deploy API key has appropriate permissions
3. The Octopus Deploy space name is correct
4. Your Octopus Deploy server is accessible from GitHub Actions

For Octopus-specific questions, refer to the [Octopus Deploy documentation](https://octopus.com/docs).
