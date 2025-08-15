@echo off
REM Auto-publish batch script for Windows
REM This is a simple wrapper around the Node.js script

echo 🚀 React Advanced Keyboard Auto-Publisher
echo ==========================================

if "%1"=="--help" (
    echo Usage: auto-publish.bat [options]
    echo.
    echo Options:
    echo   --dry-run       Test without actually publishing
    echo   --yes           Skip confirmations
    echo   --skip-tests    Skip running tests
    echo   --force         Proceed with uncommitted changes
    echo   --no-push       Don't push to git
    echo   --help          Show this help
    echo.
    goto :eof
)

if "%1"=="dry-run" (
    node scripts/auto-publish.js --dry-run
) else if "%1"=="version" (
    node scripts/version-bump.js
) else (
    node scripts/auto-publish.js %*
)

echo.
echo Process completed! Check the output above for any errors.
pause
