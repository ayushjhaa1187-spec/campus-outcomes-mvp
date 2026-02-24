const fs = require('fs');
const path = require('path');

async function runTests() {
  const testsDir = __dirname;
  const files = fs.readdirSync(testsDir).filter(file => file.startsWith('test_') && file.endsWith('.js'));

  if (files.length === 0) {
    console.log('No test files found.');
    process.exit(0);
  }

  console.log(`Found ${files.length} test file(s). Running...`);

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(testsDir, file);
    console.log(`Running ${file}...`);
    try {
      const testModule = require(filePath);
      if (typeof testModule.run === 'function') {
        await testModule.run();
        console.log(`✅ ${file} passed`);
        passed++;
      } else {
        console.error(`⚠️ ${file} does not export a 'run' function.`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${file} failed:`);
      console.error(error);
      failed++;
    }
  }

  console.log('\n--- Test Summary ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test runner encountered an error:', err);
  process.exit(1);
});
