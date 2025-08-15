# Auto-Versioning and Publishing Scripts

This directory contains automated scripts for version management and publishing of the react-advanced-keyboard package.

## Scripts Overview

### 1. `version-bump.js` (Node.js)
Automatically analyzes git changes and determines the appropriate version bump (major, minor, or patch).

### 2. `version-bump.ps1` (PowerShell)
PowerShell version of the version bump script for Windows users.

### 3. `auto-publish.js` (Node.js)
Complete automation script that handles version bumping, building, and publishing.

## Usage

### Quick Start
```bash
# Dry run to see what would happen
pnpm run publish:dry

# Automatic publish with confirmation
pnpm run publish:auto

# Just bump version with analysis
pnpm run version:bump

# Auto-bump without confirmation
pnpm run version:bump:auto
```

### Manual Script Execution

#### Version Bump Only
```bash
# Interactive version bump
node scripts/version-bump.js

# Auto-confirm version bump
node scripts/version-bump.js --yes

# PowerShell version (Windows)
.\scripts\version-bump.ps1
.\scripts\version-bump.ps1 -Yes
```

#### Full Auto-Publish
```bash
# Complete publish pipeline
node scripts/auto-publish.js

# Dry run (test without publishing)
node scripts/auto-publish.js --dry-run

# Skip confirmation prompts
node scripts/auto-publish.js --yes

# Skip tests (if they fail)
node scripts/auto-publish.js --skip-tests

# Force publish with uncommitted changes
node scripts/auto-publish.js --force

# Don't push to git after publishing
node scripts/auto-publish.js --no-push
```

## Version Detection Logic

The scripts analyze your changes to determine the appropriate version bump:

### Major Version (X.0.0)
- Breaking changes in API
- Changes to `types.ts` or main `index.ts`
- Commit messages with "BREAKING" or "major:"
- High impact score (≥20 points)

### Minor Version (X.Y.0)
- New features or components
- New files in `components/` directory
- Changes to `layouts.ts`
- Commit messages with "feat:" or "feature:"
- Medium impact score (≥10 points)

### Patch Version (X.Y.Z)
- Bug fixes
- Documentation updates
- Configuration changes
- Commit messages with "fix:" or "bugfix:"
- Low impact score (<10 points)

## Scoring System

The scripts use a scoring system to analyze the impact of changes:

| Change Type | Points | Examples |
|-------------|--------|----------|
| Breaking changes | +20 | `types.ts`, `index.ts`, API changes |
| Core components | +10 | `package.json` |
| Major components | +8 | `Keyboard.tsx`, `useKeyboard.ts` |
| New features | +5 | New files, `components/`, `layouts.ts` |
| Bug fixes | +2 | Test files, files with "fix" or "bug" |
| Documentation | +1 | README, .md files, config files |

## Commit Message Conventions

For best results, use conventional commit messages:

```bash
# Features
git commit -m "feat: add new keyboard layout support"
git commit -m "feature: implement autocomplete debouncing"

# Bug fixes
git commit -m "fix: resolve key press animation issue"
git commit -m "bugfix: handle empty suggestion arrays"

# Breaking changes
git commit -m "feat: redesign keyboard API (BREAKING CHANGE)"
git commit -m "major: remove deprecated props"

# Other
git commit -m "docs: update README with new examples"
git commit -m "chore: update dependencies"
```

## Prerequisites

Before using the auto-publish script, ensure:

1. **Git repository**: You're in a git repository with commits
2. **npm login**: You're logged into npm (`npm whoami` should work)
3. **Clean working directory**: No uncommitted changes (use `--force` to override)
4. **Build script**: Your `build:lib` script works correctly

## What the Auto-Publish Script Does

1. **Pre-flight checks**: Verifies git status, npm login, package.json exists
2. **Run tests**: Executes test script if available (skip with `--skip-tests`)
3. **Version bump**: Analyzes changes and updates version
4. **Build package**: Runs `pnpm run build:lib`
5. **Publish**: Publishes to npm registry
6. **Git operations**: Commits version bump, creates tags, pushes to remote

## Examples

### First-time Setup
```bash
# Make scripts executable (Unix/Mac)
chmod +x scripts/*.js

# Test the process without publishing
pnpm run publish:dry
```

### Regular Workflow
```bash
# After making changes and committing them
git add .
git commit -m "feat: add new emoji keyboard layout"

# Auto-publish (will detect minor version bump)
pnpm run publish:auto
```

### Emergency Hotfix
```bash
git add .
git commit -m "fix: critical security vulnerability"

# Quick publish without confirmation
node scripts/auto-publish.js --yes
```

### Manual Version Control
```bash
# Just analyze and bump version
pnpm run version:bump

# Then manually publish later
pnpm publish
```

## Troubleshooting

### "Not in a git repository"
- Ensure you're in the project root with a `.git` directory

### "Not logged into npm"
- Run `npm login` and enter your credentials

### "Working directory has uncommitted changes"
- Commit your changes first, or use `--force` flag

### "Tests failed"
- Fix the failing tests, or use `--skip-tests` flag

### "Command failed: git push"
- Check your git remote configuration
- Ensure you have push permissions
- Use `--no-push` to skip git operations

## Security Notes

- Scripts will never publish without explicit confirmation (unless `--yes` flag is used)
- Dry-run mode is available to test the process safely
- All git operations are performed locally first
- Scripts respect npm's `prepublishOnly` hooks for additional validation

## Customization

You can modify the scoring logic in the scripts by editing:
- File path patterns and their associated scores
- Commit message keywords and their weights
- Version bump thresholds

The scripts are designed to be conservative - when in doubt, they choose a smaller version bump.
