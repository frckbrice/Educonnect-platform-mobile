#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up EduConnected Mobile Development Environment...\n');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
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

// Check if required tools are installed
function checkRequirements() {
    logStep('Checking development requirements...');

    try {
        // Check Node.js version
        const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
        const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);

        if (nodeMajor < 18) {
            logError(`Node.js 18+ required. Current version: ${nodeVersion}`);
            process.exit(1);
        }
        logSuccess(`Node.js version: ${nodeVersion}`);

        // Check Yarn
        try {
            const yarnVersion = execSync('yarn --version', { encoding: 'utf8' }).trim();
            logSuccess(`Yarn version: ${yarnVersion}`);
        } catch {
            logWarning('Yarn not found. Installing...');
            execSync('npm install -g yarn', { stdio: 'inherit' });
        }

        // Check Expo CLI
        try {
            const expoVersion = execSync('expo --version', { encoding: 'utf8' }).trim();
            logSuccess(`Expo CLI version: ${expoVersion}`);
        } catch {
            logWarning('Expo CLI not found. Installing...');
            execSync('npm install -g @expo/cli', { stdio: 'inherit' });
        }

    } catch (error) {
        logError('Failed to check requirements');
        console.error(error);
        process.exit(1);
    }
}

// Install dependencies
function installDependencies() {
    logStep('Installing project dependencies...');

    try {
        execSync('yarn install', { stdio: 'inherit' });
        logSuccess('Dependencies installed successfully');
    } catch (error) {
        logError('Failed to install dependencies');
        console.error(error);
        process.exit(1);
    }
}

// Setup environment
function setupEnvironment() {
    logStep('Setting up environment configuration...');

    const envExamplePath = path.join(__dirname, '..', 'env.example');
    const envPath = path.join(__dirname, '..', '.env');

    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
        try {
            fs.copyFileSync(envExamplePath, envPath);
            logSuccess('Environment file created from template');
            logWarning('Please update .env with your actual configuration values');
        } catch (error) {
            logError('Failed to create environment file');
            console.error(error);
        }
    } else if (fs.existsSync(envPath)) {
        logSuccess('Environment file already exists');
    } else {
        logWarning('No environment template found');
    }
}

// Setup Git hooks
function setupGitHooks() {
    logStep('Setting up Git hooks...');

    try {
        execSync('yarn prepare', { stdio: 'inherit' });
        logSuccess('Git hooks configured successfully');
    } catch (error) {
        logWarning('Failed to setup Git hooks (this is optional)');
    }
}

// Run initial build check
function runBuildCheck() {
    logStep('Running initial build check...');

    try {
        execSync('yarn type-check', { stdio: 'inherit' });
        logSuccess('TypeScript compilation successful');
    } catch (error) {
        logWarning('TypeScript compilation failed (this is normal for initial setup)');
    }
}

// Display next steps
function displayNextSteps() {
    logStep('🎉 Setup Complete! Next Steps:');

    console.log(`
${colors.cyan}1.${colors.reset} Configure your environment variables in ${colors.bright}.env${colors.reset}
${colors.cyan}2.${colors.reset} Update app configuration in ${colors.bright}app.config.ts${colors.reset}
${colors.cyan}3.${colors.reset} Configure your EAS project ID
${colors.cyan}4.${colors.reset} Set up authentication providers (Google, GitHub)
${colors.cyan}5.${colors.reset} Start development: ${colors.bright}yarn start${colors.reset}

${colors.yellow}Useful Commands:${colors.reset}
  ${colors.bright}yarn start${colors.reset}          - Start development server
  ${colors.bright}yarn android${colors.reset}        - Run on Android
  ${colors.bright}yarn ios${colors.reset}            - Run on iOS
  ${colors.bright}yarn web${colors.reset}            - Run on Web
  ${colors.bright}yarn test${colors.reset}           - Run tests
  ${colors.bright}yarn lint${colors.reset}           - Lint code
  ${colors.bright}yarn format${colors.reset}         - Format code
  ${colors.bright}yarn storybook${colors.reset}      - Start Storybook

${colors.green}Happy coding! 🚀${colors.reset}
  `);
}

// Main execution
async function main() {
    try {
        checkRequirements();
        installDependencies();
        setupEnvironment();
        setupGitHooks();
        runBuildCheck();
        displayNextSteps();
    } catch (error) {
        logError('Setup failed');
        console.error(error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
