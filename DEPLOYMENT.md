# Deployment Guide

## Prerequisites

Before deploying to npm, ensure you have:

1. An npm account: https://www.npmjs.com/signup
2. npm CLI installed and logged in: `npm login`
3. Verified your email on npm

## Pre-deployment Checklist

✅ **Version**: Updated to 1.0.0  
✅ **Package.json**: All metadata updated (author, repository, keywords)  
✅ **README**: Comprehensive with installation and usage examples  
✅ **License**: MIT license included  
✅ **Build**: Library builds successfully  
✅ **TypeScript**: Type declarations generated  
✅ **Linting**: No critical errors in source files  
✅ **Files**: Only necessary files included via .npmignore  
✅ **CSS**: Styles properly bundled and exported  

## Deployment Steps

### 1. Final Build Test
```bash
pnpm run prepublishOnly
```

### 2. Check Package Contents
```bash
npm pack --dry-run
```

### 3. Test Locally (Optional)
```bash
npm pack
npm install ./react-advanced-keyboard-1.0.0.tgz
```

### 4. Publish to npm
```bash
npm publish
```

### 5. Verify Publication
Check your package at: https://www.npmjs.com/package/react-advanced-keyboard

## Package Information

- **Name**: `react-advanced-keyboard`
- **Version**: `1.0.0`
- **Bundle Sizes**:
  - ES Module: ~31KB (7.6KB gzipped)
  - UMD: ~21KB (6.5KB gzipped)
  - CSS: ~25KB (5.7KB gzipped)

## Installation for Users

```bash
npm install react-advanced-keyboard
```

```tsx
import { Keyboard } from 'react-advanced-keyboard';
import 'react-advanced-keyboard/styles';
```

## Post-deployment

1. Update GitHub repository with tags
2. Create GitHub release
3. Update documentation if needed
4. Monitor npm download statistics

## Future Updates

For subsequent releases:
1. Update version in package.json
2. Update CHANGELOG.md
3. Run `pnpm run prepublishOnly`
4. Run `npm publish`
