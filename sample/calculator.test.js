import { add } from './calculator.js';

console.log("🧪 Running Test for add(10, 5)...");

const result = add(10, 5);

//Humein pata hai 10 + 5 = 15 hona chahiye
if (result !== 15) {
    console.error(`❌ Test Failed! Expected 15 but got: ${result}`);
    process.exit(1); //Exit code 1 means error
}

console.log("✅ Test Passed successfully!");
