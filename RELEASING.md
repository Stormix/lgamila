# Release Guide

This document outlines how to create releases for the LGamila project.

## Browser Extension Releases

The project includes an automated GitHub Actions workflow that builds the browser extension for both Chrome and Firefox and publishes it as a GitHub release.

### Automated Release (Recommended)

#### Via Git Tags

1. **Update the version** in `apps/extension/package.json`
2. **Commit your changes**:
   ```bash
   git add apps/extension/package.json
   git commit -m "chore: bump extension version to v1.0.1"
   ```
3. **Create and push a git tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
4. **The workflow will automatically**:
   - Build the extension for Chrome (MV3) and Firefox (MV2)
   - Package both builds into zip files
   - Create a GitHub release with both files attached
   - Include detailed installation instructions

#### Via Manual Trigger

1. Go to the [Actions tab](https://github.com/stormix/lgamila/actions) on GitHub
2. Select the "Release Extension" workflow
3. Click "Run workflow"
4. Enter the version (e.g., `v1.0.1`)
5. Click "Run workflow"

### Manual Release (Local Build)

If you need to build releases locally:

```bash
# Navigate to extension directory
cd apps/extension

# Build for both browsers
pnpm build:all

# Package for both browsers
pnpm package:all

# Files will be created in:
# - build/chrome-mv3-prod.zip (Chrome)
# - build/firefox-mv2-prod.zip (Firefox)
```

## Release Workflow Details

The release workflow (`.github/workflows/release.yml`) performs the following steps:

1. **Environment Setup**: Installs Node.js, pnpm, and project dependencies
2. **Multi-Browser Build**:
   - Builds extension for Chrome (Manifest V3)
   - Builds extension for Firefox (Manifest V2)
3. **Packaging**: Creates zip files for both browser builds
4. **Release Creation**: Creates a GitHub release with:
   - Proper semantic versioning
   - Detailed release notes
   - Installation instructions for both browsers
   - Both browser builds attached as assets

## Browser-Specific Notes

### Chrome (Manifest V3)

- Uses the latest Manifest V3 format
- Supports all modern Chrome extension APIs
- Compatible with Chrome, Edge, and other Chromium-based browsers

### Firefox (Manifest V2)

- Uses Manifest V2 for Firefox compatibility
- Includes Firefox-specific adaptations
- Tested with Firefox Developer Edition

## Version Management

- Extension version is managed in `apps/extension/package.json`
- Git tags should follow semantic versioning (e.g., `v1.0.0`, `v1.0.1`, `v1.1.0`)
- Release notes are automatically generated with installation instructions

## Testing Releases

Before creating a release:

1. **Test locally**:

   ```bash
   cd apps/extension
   pnpm build:all
   ```

2. **Load both builds** in their respective browsers to ensure functionality

3. **Verify all features** work correctly in both browsers

## Troubleshooting

### Workflow Fails

- Check that all dependencies are properly listed
- Ensure `apps/extension/package.json` has the correct version
- Verify Plasmo build commands work locally

### Missing Browser Builds

- Confirm Plasmo supports the target browser
- Check build logs for any browser-specific errors
- Ensure all required permissions are set in manifest

### Release Creation Issues

- Verify GitHub token has proper permissions
- Check that tag format matches workflow triggers
- Ensure no existing release exists with the same tag
