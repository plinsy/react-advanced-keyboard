#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Auto-publish script for react-advanced-keyboard
 * Automatically versions, builds, and publishes the package
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
      stdio: 'inherit',
      ...options 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function execCommandSilent(command, options = {}) {
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

function checkWorkingDirectory() {
  try {
    const status = execCommandSilent('git status --porcelain');
    if (status.trim()) {
      log('\n⚠️  Working directory is not clean:', 'yellow');
      log(status, 'yellow');
      
      if (!process.argv.includes('--force')) {
        throw new Error('Working directory has uncommitted changes. Use --force to override.');
      }
      log('Proceeding with --force flag...', 'yellow');
    }
  } catch (error) {
    if (!error.message.includes('--force')) {
      throw error;
    }
  }
}

function runTests() {
  log('\n🧪 Running tests...', 'cyan');
  try {
    // Check if there are test scripts
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    if (pkg.scripts && pkg.scripts.test) {
      execCommand('pnpm test');
    } else {
      log('No test script found, skipping tests.', 'yellow');
    }
  } catch (error) {
    if (!process.argv.includes('--skip-tests')) {
      throw new Error('Tests failed. Use --skip-tests to override.');
    }
    log('Tests failed but continuing with --skip-tests flag...', 'yellow');
  }
}

function runVersionBump() {
  log('\n📝 Running version bump...', 'cyan');
  const versionScript = path.join(__dirname, 'version-bump.js');
  const args = process.argv.includes('--yes') ? '--yes' : '';
  execCommand(`node "${versionScript}" ${args}`);
}

function buildPackage() {
  log('\n🏗️  Building package...', 'cyan');
  execCommand('pnpm run build:lib');
  log('✅ Build completed successfully', 'green');
}

function publishPackage() {
  log('\n📦 Publishing package...', 'cyan');
  
  const dryRun = process.argv.includes('--dry-run');
  const publishCmd = dryRun ? 'pnpm publish --dry-run' : 'pnpm publish';
  
  if (dryRun) {
    log('Running in dry-run mode...', 'yellow');
  }
  
  execCommand(publishCmd);
  
  if (!dryRun) {
    log('✅ Package published successfully!', 'green');
  } else {
    log('✅ Dry-run completed successfully!', 'green');
  }
}

function pushToGit() {
  if (process.argv.includes('--no-push')) {
    log('\nSkipping git push (--no-push flag)', 'yellow');
    return;
  }

  log('\n🚀 Pushing to git...', 'cyan');
  try {
    execCommand('git push');
    execCommand('git push --tags');
    log('✅ Pushed changes and tags to git', 'green');
  } catch (error) {
    log(`Warning: Could not push to git: ${error.message}`, 'yellow');
    log('You may need to push manually: git push && git push --tags', 'blue');
  }
}

function showSummary() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  log('\n🎉 Publish process completed!', 'bright');
  log('================================', 'cyan');
  log(`Package: ${pkg.name}`, 'blue');
  log(`Version: ${pkg.version}`, 'green');
  log(`Registry: ${pkg.publishConfig?.registry || 'https://registry.npmjs.org/'}`, 'blue');
  
  if (!process.argv.includes('--dry-run')) {
    log(`\nPackage available at: https://www.npmjs.com/package/${pkg.name}`, 'cyan');
  }
}

function main() {
  try {
    log('🚀 Auto-publish script for react-advanced-keyboard', 'bright');
    log('==============================================', 'cyan');

    // Parse command line arguments
    const isDryRun = process.argv.includes('--dry-run');
    const skipTests = process.argv.includes('--skip-tests');
    const force = process.argv.includes('--force');
    const noPush = process.argv.includes('--no-push');

    if (isDryRun) {
      log('\n🧪 DRY RUN MODE - No actual publishing will occur', 'yellow');
    }

    // Pre-flight checks
    log('\n🔍 Running pre-flight checks...', 'cyan');
    
    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found. Make sure you\'re in the project root.');
    }

    // Check git status
    checkWorkingDirectory();

    // Check if logged into npm
    try {
      execCommandSilent('npm whoami');
    } catch {
      throw new Error('Not logged into npm. Run: npm login');
    }

    // Run the publish pipeline
    if (!skipTests) {
      runTests();
    }

    runVersionBump();
    buildPackage();
    publishPackage();
    
    if (!isDryRun) {
      pushToGit();
    }

    showSummary();

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node auto-publish.js [options]

Options:
  --yes           Skip version bump confirmation
  --dry-run       Run without actually publishing
  --skip-tests    Skip running tests
  --force         Proceed even with uncommitted changes
  --no-push       Don't push to git after publishing
  --help, -h      Show this help message

This script automates the entire publish process:
1. Checks working directory is clean
2. Runs tests (if available)
3. Bumps version based on git changes
4. Builds the package
5. Publishes to npm
6. Pushes changes and tags to git

Example:
  node auto-publish.js --dry-run    # Test the process
  node auto-publish.js --yes        # Publish with auto-confirm
`);
  process.exit(0);
}

main();
