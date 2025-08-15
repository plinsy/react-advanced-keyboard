#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Auto-version script for react-advanced-keyboard
 * Analyzes git changes to determine version bump level
 */

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function getPackageJson() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function updatePackageJson(newVersion) {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const pkg = getPackageJson();
  pkg.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
}

function getLastTag() {
  try {
    return execCommand('git describe --tags --abbrev=0');
  } catch {
    return null;
  }
}

function getGitChanges(since = null) {
  const command = since 
    ? `git diff --name-status ${since}..HEAD`
    : 'git diff --name-status --cached';
  
  try {
    return execCommand(command);
  } catch {
    // If no changes staged, get all changes since last commit
    return execCommand('git diff --name-status HEAD~1..HEAD');
  }
}

function analyzeChanges(changes) {
  if (!changes.trim()) {
    return 'patch'; // Default to patch if no changes detected
  }

  const lines = changes.split('\n').filter(line => line.trim());
  let score = 0;
  let hasBreakingChanges = false;
  let hasNewFeatures = false;
  let hasBugFixes = false;

  log('\nAnalyzing changes:', 'cyan');

  for (const line of lines) {
    const [status, filepath] = line.split('\t');
    log(`  ${status} ${filepath}`, 'blue');

    // Breaking change indicators
    if (filepath.includes('types.ts') || 
        filepath.includes('index.ts') ||
        filepath.includes('package.json')) {
      score += 10;
    }

    // Major changes
    if (filepath.includes('components/Keyboard.tsx') ||
        filepath.includes('hooks/useKeyboard.ts')) {
      score += 8;
    }

    // New features
    if (status === 'A' || // Added files
        filepath.includes('components/') ||
        filepath.includes('layouts.ts')) {
      score += 5;
      hasNewFeatures = true;
    }

    // Bug fixes and minor changes
    if (filepath.includes('test') ||
        filepath.includes('spec') ||
        filepath.includes('fix') ||
        filepath.includes('bug')) {
      score += 2;
      hasBugFixes = true;
    }

    // Documentation and config changes
    if (filepath.includes('README') ||
        filepath.includes('.md') ||
        filepath.includes('config') ||
        filepath.includes('eslint') ||
        filepath.includes('tsconfig')) {
      score += 1;
    }
  }

  // Check commit messages for breaking change indicators
  try {
    const lastTag = getLastTag();
    const commitRange = lastTag ? `${lastTag}..HEAD` : 'HEAD~5..HEAD';
    const commits = execCommand(`git log ${commitRange} --oneline`);
    
    if (commits.includes('BREAKING') || 
        commits.includes('breaking change') ||
        commits.includes('major:')) {
      hasBreakingChanges = true;
      score += 20;
    }

    if (commits.includes('feat:') || commits.includes('feature:')) {
      hasNewFeatures = true;
      score += 5;
    }

    if (commits.includes('fix:') || commits.includes('bugfix:')) {
      hasBugFixes = true;
      score += 2;
    }
  } catch (error) {
    log(`Warning: Could not analyze commit messages: ${error.message}`, 'yellow');
  }

  log(`\nChange analysis score: ${score}`, 'cyan');
  log(`Breaking changes detected: ${hasBreakingChanges}`, hasBreakingChanges ? 'red' : 'green');
  log(`New features detected: ${hasNewFeatures}`, hasNewFeatures ? 'yellow' : 'green');
  log(`Bug fixes detected: ${hasBugFixes}`, hasBugFixes ? 'blue' : 'green');

  // Determine version bump
  if (hasBreakingChanges || score >= 20) {
    return 'major';
  } else if (hasNewFeatures || score >= 10) {
    return 'minor';
  } else {
    return 'patch';
  }
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
}

function createGitTag(version) {
  try {
    execCommand(`git tag -a v${version} -m "Release v${version}"`);
    log(`Created git tag: v${version}`, 'green');
  } catch (error) {
    log(`Warning: Could not create git tag: ${error.message}`, 'yellow');
  }
}

async function main() {
  try {
    log('🚀 Auto-versioning script for react-advanced-keyboard', 'bright');
    log('================================================', 'cyan');

    // Check if we're in a git repository
    try {
      execCommand('git status');
    } catch {
      throw new Error('Not in a git repository');
    }

    // Get current version
    const pkg = getPackageJson();
    const currentVersion = pkg.version;
    log(`\nCurrent version: ${currentVersion}`, 'blue');

    // Get changes
    const lastTag = getLastTag();
    log(`\nLast tag: ${lastTag || 'none'}`, 'blue');

    const changes = getGitChanges(lastTag);
    if (!changes.trim()) {
      log('\nNo changes detected. Version will remain the same.', 'yellow');
      return;
    }

    // Analyze changes and determine version bump
    const bumpType = analyzeChanges(changes);
    log(`\nRecommended version bump: ${bumpType.toUpperCase()}`, 'magenta');

    // Calculate new version
    const newVersion = bumpVersion(currentVersion, bumpType);
    log(`New version: ${newVersion}`, 'green');

    // Confirm with user (unless --yes flag is provided)
    if (!process.argv.includes('--yes') && !process.argv.includes('-y')) {
      const readline = (await import('readline')).default;
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question(`\nProceed with version bump ${currentVersion} → ${newVersion}? (y/N): `, resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        log('Version bump cancelled.', 'yellow');
        return;
      }
    }

    // Update package.json
    updatePackageJson(newVersion);
    log(`\n✅ Updated package.json to version ${newVersion}`, 'green');

    // Stage the package.json change
    execCommand('git add package.json');
    log('✅ Staged package.json changes', 'green');

    // Create commit with version bump
    execCommand(`git commit -m "chore: bump version to ${newVersion}"`);
    log('✅ Created version bump commit', 'green');

    // Create git tag
    createGitTag(newVersion);

    log(`\n🎉 Version successfully updated to ${newVersion}!`, 'bright');
    log('\nNext steps:', 'cyan');
    log('  1. Push changes: git push', 'blue');
    log('  2. Push tags: git push --tags', 'blue');
    log('  3. Publish: pnpm publish', 'blue');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node version-bump.js [options]

Options:
  --yes, -y     Skip confirmation prompt
  --help, -h    Show this help message

This script analyzes git changes to automatically determine the appropriate
version bump (major, minor, or patch) and updates package.json accordingly.

Version bump rules:
- MAJOR: Breaking changes, major API changes, or score >= 20
- MINOR: New features, component additions, or score >= 10  
- PATCH: Bug fixes, documentation, minor changes

The script considers:
- File paths (types.ts, main components get higher scores)
- Change types (additions, modifications, deletions)
- Commit messages (BREAKING, feat:, fix: keywords)
`);
  process.exit(0);
}

main();
