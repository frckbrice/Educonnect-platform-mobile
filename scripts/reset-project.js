#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Resetting EduConnected Mobile Project...\n');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
    log(`\n${step}`, 'cyan');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

// Backup current app directory
function backupAppDirectory() {
    logStep('Backing up current app directory...');

    const appDir = path.join(__dirname, '..', 'app');
    const backupDir = path.join(__dirname, '..', 'app-backup');

    if (fs.existsSync(appDir)) {
        try {
            if (fs.existsSync(backupDir)) {
                fs.rmSync(backupDir, { recursive: true, force: true });
            }
            fs.renameSync(appDir, backupDir);
            logSuccess('Current app directory backed up to app-backup/');
        } catch (error) {
            logError('Failed to backup app directory');
            console.error(error);
            process.exit(1);
        }
    } else {
        logWarning('No app directory found to backup');
    }
}

// Create fresh app directory
function createFreshAppDirectory() {
    logStep('Creating fresh app directory...');

    const appDir = path.join(__dirname, '..', 'app');

    try {
        fs.mkdirSync(appDir, { recursive: true });

        // Create basic structure
        const basicStructure = {
            '_layout.tsx': `import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}`,
            'index.tsx': `import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EduConnected!</Text>
      <Text style={styles.subtitle}>Start building your learning platform</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});`,
        };

        Object.entries(basicStructure).forEach(([filename, content]) => {
            fs.writeFileSync(path.join(appDir, filename), content);
        });

        logSuccess('Fresh app directory created with basic structure');
    } catch (error) {
        logError('Failed to create fresh app directory');
        console.error(error);
        process.exit(1);
    }
}

// Clean build artifacts
function cleanBuildArtifacts() {
    logStep('Cleaning build artifacts...');

    const buildDirs = [
        '.expo',
        'dist',
        'web-build',
        'build',
        'coverage',
        'storybook-static',
    ];

    buildDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (fs.existsSync(dirPath)) {
            try {
                fs.rmSync(dirPath, { recursive: true, force: true });
                logSuccess(`Cleaned ${dir}/`);
            } catch (error) {
                logWarning(`Failed to clean ${dir}/`);
            }
        }
    });
}

// Reset package-lock files
function resetLockFiles() {
    logStep('Resetting lock files...');

    const lockFiles = [
        'yarn.lock',
        'package-lock.json',
        'pnpm-lock.yaml',
    ];

    lockFiles.forEach(lockFile => {
        const lockPath = path.join(__dirname, '..', lockFile);
        if (fs.existsSync(lockPath)) {
            try {
                fs.unlinkSync(lockPath);
                logSuccess(`Removed ${lockFile}`);
            } catch (error) {
                logWarning(`Failed to remove ${lockFile}`);
            }
        }
    });
}

// Clean node_modules
function cleanNodeModules() {
    logStep('Cleaning node_modules...');

    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

    if (fs.existsSync(nodeModulesPath)) {
        try {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            logSuccess('Cleaned node_modules/');
        } catch (error) {
            logWarning('Failed to clean node_modules/');
        }
    }
}

// Reinstall dependencies
function reinstallDependencies() {
    logStep('Reinstalling dependencies...');

    try {
        execSync('yarn install', { stdio: 'inherit' });
        logSuccess('Dependencies reinstalled successfully');
    } catch (error) {
        logError('Failed to reinstall dependencies');
        console.error(error);
        process.exit(1);
    }
}

// Display completion message
function displayCompletion() {
    logStep('🎉 Project Reset Complete!');

    console.log(`
${colors.green}What was reset:${colors.reset}
  ✅ App directory backed up to app-backup/
  ✅ Fresh app directory created
  ✅ Build artifacts cleaned
  ✅ Lock files removed
  ✅ Dependencies reinstalled

${colors.yellow}Next steps:${colors.reset}
  ${colors.bright}1.${colors.reset} Start development: ${colors.bright}yarn start${colors.reset}
  ${colors.bright}2.${colors.reset} Your old code is in app-backup/ if you need to reference it
  ${colors.bright}3.${colors.reset} Begin building your new features

${colors.cyan}Useful commands:${colors.reset}
  ${colors.bright}yarn start${colors.reset}          - Start development server
  ${colors.bright}yarn android${colors.reset}        - Run on Android
  ${colors.bright}yarn ios${colors.reset}            - Run on iOS
  ${colors.bright}yarn web${colors.reset}            - Run on Web

${colors.green}Happy coding! 🚀${colors.reset}
  `);
}

// Main execution
async function main() {
    try {
        backupAppDirectory();
        createFreshAppDirectory();
        cleanBuildArtifacts();
        resetLockFiles();
        cleanNodeModules();
        reinstallDependencies();
        displayCompletion();
    } catch (error) {
        logError('Project reset failed');
        console.error(error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
