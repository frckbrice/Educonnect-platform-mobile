#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logHeader(message) {
    log(`\n🚀 ${message}`, 'magenta');
    log('='.repeat(message.length + 4), 'magenta');
}

// Test configurations
const testConfigs = {
    unit: {
        description: 'Unit Tests',
        command: 'jest',
        args: ['--testPathPattern=__tests__/components', '--verbose'],
    },
    integration: {
        description: 'Integration Tests',
        command: 'jest',
        args: ['--testPathPattern=__tests__/integration', '--verbose'],
    },
    e2e: {
        description: 'End-to-End Tests',
        command: 'jest',
        args: ['--testPathPattern=__tests__/e2e', '--verbose'],
    },
    coverage: {
        description: 'Tests with Coverage',
        command: 'jest',
        args: ['--coverage', '--verbose'],
    },
    watch: {
        description: 'Tests in Watch Mode',
        command: 'jest',
        args: ['--watch', '--verbose'],
    },
    debug: {
        description: 'Tests in Debug Mode',
        command: 'jest',
        args: ['--detectOpenHandles', '--forceExit', '--verbose'],
    },
    all: {
        description: 'All Tests',
        command: 'jest',
        args: ['--verbose'],
    },
};

// Run tests with specified configuration
function runTests(configKey) {
    const config = testConfigs[configKey];

    if (!config) {
        logError(`Unknown test configuration: ${configKey}`);
        logInfo('Available configurations:');
        Object.keys(testConfigs).forEach(key => {
            log(`  - ${key}: ${testConfigs[key].description}`, 'cyan');
        });
        return;
    }

    logHeader(`Running ${config.description}`);

    const args = config.args || [];
    const command = config.command;

    logInfo(`Command: ${command} ${args.join(' ')}`);
    logInfo('Starting tests...\n');

    const testProcess = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
    });

    testProcess.on('close', (code) => {
        if (code === 0) {
            logSuccess(`${config.description} completed successfully!`);
        } else {
            logError(`${config.description} failed with exit code ${code}`);
            process.exit(code);
        }
    });

    testProcess.on('error', (error) => {
        logError(`Failed to start ${config.description}: ${error.message}`);
        process.exit(1);
    });
}

// Run specific test file or pattern
function runSpecificTest(testPattern) {
    logHeader(`Running Tests Matching: ${testPattern}`);

    const args = ['--testPathPattern', testPattern, '--verbose'];

    logInfo(`Command: jest ${args.join(' ')}`);
    logInfo('Starting tests...\n');

    const testProcess = spawn('jest', args, {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
    });

    testProcess.on('close', (code) => {
        if (code === 0) {
            logSuccess(`Tests matching "${testPattern}" completed successfully!`);
        } else {
            logError(`Tests matching "${testPattern}" failed with exit code ${code}`);
            process.exit(code);
        }
    });

    testProcess.on('error', (error) => {
        logError(`Failed to start tests: ${error.message}`);
        process.exit(1);
    });
}

// Show test status and coverage
function showTestStatus() {
    logHeader('Test Status & Coverage');

    // Check if tests exist
    const fs = require('fs');
    const testDir = path.join(process.cwd(), '__tests__');

    if (!fs.existsSync(testDir)) {
        logWarning('No tests directory found. Run tests:setup first.');
        return;
    }

    // Count test files
    function countTestFiles(dir) {
        let count = 0;
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                count += countTestFiles(fullPath);
            } else if (item.endsWith('.test.ts') || item.endsWith('.test.tsx') ||
                item.endsWith('.spec.ts') || item.endsWith('.spec.tsx')) {
                count++;
            }
        });

        return count;
    }

    const totalTests = countTestFiles(testDir);
    logInfo(`Total test files: ${totalTests}`);

    // Check package.json scripts
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const scripts = packageJson.scripts || {};

        logInfo('\nAvailable test scripts:');
        Object.entries(scripts).forEach(([name, script]) => {
            if (script.includes('jest') || script.includes('test')) {
                log(`  - ${name}: ${script}`, 'cyan');
            }
        });
    }
}

// Setup test environment
function setupTests() {
    logHeader('Setting Up Test Environment');

    const fs = require('fs');
    const testDir = path.join(process.cwd(), '__tests__');

    if (fs.existsSync(testDir)) {
        logInfo('Tests directory already exists.');
        return;
    }

    logInfo('Creating tests directory structure...');

    try {
        // Create main test directories
        fs.mkdirSync(testDir, { recursive: true });
        fs.mkdirSync(path.join(testDir, 'components'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'utils'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'integration'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'e2e'), { recursive: true });

        // Create component test subdirectories
        fs.mkdirSync(path.join(testDir, 'components', 'common'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'components', 'card'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'components', 'screen'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'components', 'auth'), { recursive: true });

        logSuccess('Test directory structure created successfully!');
        logInfo('You can now run: npm test');

    } catch (error) {
        logError('Failed to create test directory structure');
        console.error(error);
    }
}

// Main function
function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'unit':
            runTests('unit');
            break;
        case 'integration':
            runTests('integration');
            break;
        case 'e2e':
            runTests('e2e');
            break;
        case 'coverage':
            runTests('coverage');
            break;
        case 'watch':
            runTests('watch');
            break;
        case 'debug':
            runTests('debug');
            break;
        case 'all':
            runTests('all');
            break;
        case 'file':
            if (args.length === 0) {
                logError('Please specify a test file pattern');
                logInfo('Usage: node scripts/run-tests.js file <pattern>');
                return;
            }
            runSpecificTest(args[0]);
            break;
        case 'status':
            showTestStatus();
            break;
        case 'setup':
            setupTests();
            break;
        case 'help':
        default:
            console.log(`
Usage: node scripts/run-tests.js <command> [options]

Commands:
  unit          Run unit tests only
  integration   Run integration tests only
  e2e           Run end-to-end tests only
  coverage      Run tests with coverage report
  watch         Run tests in watch mode
  debug         Run tests in debug mode
  all           Run all tests
  file <pattern> Run tests matching specific pattern
  status        Show test status and coverage
  setup         Setup test environment
  help          Show this help message

Examples:
  node scripts/run-tests.js unit
  node scripts/run-tests.js coverage
  node scripts/run-tests.js file course-details
  node scripts/run-tests.js watch

Available test configurations:
${Object.entries(testConfigs).map(([key, config]) =>
                `  ${key.padEnd(12)} ${config.description}`
            ).join('\n')}
      `);
            break;
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    runTests,
    runSpecificTest,
    showTestStatus,
    setupTests,
};
