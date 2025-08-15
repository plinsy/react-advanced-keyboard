# Auto-version script for react-advanced-keyboard (PowerShell version)
# Analyzes git changes to determine version bump level

param(
    [switch]$Yes,
    [switch]$Help,
    [string]$Type = "auto"
)

if ($Help) {
    Write-Host @"
Auto-version script for react-advanced-keyboard

USAGE:
    .\version-bump.ps1 [options]

OPTIONS:
    -Yes        Skip confirmation prompt
    -Type       Force version type: major, minor, patch, or auto (default)
    -Help       Show this help message

This script analyzes git changes to determine the appropriate version bump.
"@ -ForegroundColor Cyan
    exit 0
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Get-GitChanges {
    try {
        $lastTag = git describe --tags --abbrev=0 2>$null
        if ($LASTEXITCODE -eq 0 -and $lastTag) {
            return git diff --name-status "$lastTag..HEAD" 2>$null
        } else {
            return git diff --name-status HEAD~1..HEAD 2>$null
        }
    } catch {
        return git diff --name-status --cached 2>$null
    }
}

function Analyze-Changes {
    param([string[]]$Changes)
    
    if (-not $Changes -or $Changes.Count -eq 0) {
        return "patch"
    }

    $score = 0
    $hasBreakingChanges = $false
    $hasNewFeatures = $false
    $hasBugFixes = $false

    Write-ColorOutput "`nAnalyzing changes:" "Cyan"

    foreach ($line in $Changes) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        $parts = $line -split "`t"
        $status = $parts[0]
        $filepath = $parts[1]
        
        Write-ColorOutput "  $status $filepath" "Blue"

        # Breaking change indicators
        if ($filepath -match "(types\.ts|index\.ts|package\.json)") {
            $score += 10
        }

        # Major changes
        if ($filepath -match "(components/Keyboard\.tsx|hooks/useKeyboard\.ts)") {
            $score += 8
        }

        # New features
        if ($status -eq "A" -or $filepath -match "(components/|layouts\.ts)") {
            $score += 5
            $hasNewFeatures = $true
        }

        # Bug fixes
        if ($filepath -match "(test|spec|fix|bug)") {
            $score += 2
            $hasBugFixes = $true
        }

        # Documentation
        if ($filepath -match "(README|\.md|config|eslint|tsconfig)") {
            $score += 1
        }
    }

    # Check commit messages
    try {
        $lastTag = git describe --tags --abbrev=0 2>$null
        $commitRange = if ($lastTag) { "$lastTag..HEAD" } else { "HEAD~5..HEAD" }
        $commits = git log $commitRange --oneline 2>$null | Out-String

        if ($commits -match "(BREAKING|breaking change|major:)") {
            $hasBreakingChanges = $true
            $score += 20
        }

        if ($commits -match "(feat:|feature:)") {
            $hasNewFeatures = $true
            $score += 5
        }

        if ($commits -match "(fix:|bugfix:)") {
            $hasBugFixes = $true
            $score += 2
        }
    } catch {
        Write-ColorOutput "Warning: Could not analyze commit messages" "Yellow"
    }

    Write-ColorOutput "`nChange analysis score: $score" "Cyan"
    Write-ColorOutput "Breaking changes detected: $hasBreakingChanges" $(if($hasBreakingChanges){"Red"}else{"Green"})
    Write-ColorOutput "New features detected: $hasNewFeatures" $(if($hasNewFeatures){"Yellow"}else{"Green"})
    Write-ColorOutput "Bug fixes detected: $hasBugFixes" $(if($hasBugFixes){"Blue"}else{"Green"})

    # Determine version bump
    if ($hasBreakingChanges -or $score -ge 20) {
        return "major"
    } elseif ($hasNewFeatures -or $score -ge 10) {
        return "minor"
    } else {
        return "patch"
    }
}

function Bump-Version {
    param([string]$CurrentVersion, [string]$BumpType)
    
    $parts = $CurrentVersion -split '\.'
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]
    
    switch ($BumpType) {
        "major" { return "$($major + 1).0.0" }
        "minor" { return "$major.$($minor + 1).0" }
        "patch" { return "$major.$minor.$($patch + 1)" }
        default { throw "Invalid bump type: $BumpType" }
    }
}

# Main execution
try {
    Write-ColorOutput "🚀 Auto-versioning script for react-advanced-keyboard" "White"
    Write-ColorOutput "================================================" "Cyan"

    # Check git status
    $gitStatus = git status 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Not in a git repository"
    }

    # Get current version from package.json
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $currentVersion = $packageJson.version
    Write-ColorOutput "`nCurrent version: $currentVersion" "Blue"

    # Get and analyze changes
    $changes = Get-GitChanges
    if (-not $changes) {
        Write-ColorOutput "`nNo changes detected. Version will remain the same." "Yellow"
        exit 0
    }

    $bumpType = if ($Type -ne "auto") { $Type } else { Analyze-Changes $changes }
    Write-ColorOutput "`nRecommended version bump: $($bumpType.ToUpper())" "Magenta"

    # Calculate new version
    $newVersion = Bump-Version $currentVersion $bumpType
    Write-ColorOutput "New version: $newVersion" "Green"

    # Confirm with user
    if (-not $Yes) {
        $confirmation = Read-Host "`nProceed with version bump $currentVersion → $newVersion? (y/N)"
        if ($confirmation -notmatch "^(y|yes)$") {
            Write-ColorOutput "Version bump cancelled." "Yellow"
            exit 0
        }
    }

    # Update package.json
    $packageJson.version = $newVersion
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-ColorOutput "`n✅ Updated package.json to version $newVersion" "Green"

    # Git operations
    git add package.json
    Write-ColorOutput "✅ Staged package.json changes" "Green"

    git commit -m "chore: bump version to $newVersion"
    Write-ColorOutput "✅ Created version bump commit" "Green"

    git tag -a "v$newVersion" -m "Release v$newVersion"
    Write-ColorOutput "✅ Created git tag: v$newVersion" "Green"

    Write-ColorOutput "`n🎉 Version successfully updated to $newVersion!" "White"
    Write-ColorOutput "`nNext steps:" "Cyan"
    Write-ColorOutput "  1. Push changes: git push" "Blue"
    Write-ColorOutput "  2. Push tags: git push --tags" "Blue"
    Write-ColorOutput "  3. Publish: pnpm publish" "Blue"

} catch {
    Write-ColorOutput "`n❌ Error: $($_.Exception.Message)" "Red"
    exit 1
}
