import fs from 'fs';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function runTestCommand(command) {
    try {
        console.log(`🚀 Executing: ${command}`);
        const stdout = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        return { success: true, logs: stdout };
    } catch (error) {
        const logs = (error.stdout || '') + '\n' + (error.stderr || '');
        return { success: false, logs: logs.trim() };
    }
}

// Function to call Gemini with retry if server is busy
async function askGeminiWithRetry(prompt, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🤖 Asking Gemini AI (Attempt ${attempt}/${retries})...`);
            const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
            });
            return response.text.trim();
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message || 'Server busy'}`);
            if (attempt < retries) {
                console.log("⏳ Waiting 3 seconds before retrying...");
                await new Promise(r => setTimeout(r, 3000));
            } else {
                throw err;
            }
        }
    }
}

async function autoPatch(targetFile, testCommand) {
    console.log("\n=================================");
    console.log("🛡️  AutoPatch: Autonomous AI Debugger");
    console.log("=================================\n");

    console.log("Step 1: Running initial test suite...");
    const initialRun = runTestCommand(testCommand);

    if (initialRun.success) {
        console.log("✅ Tests are already passing! No patch needed.");
        return;
    }

    console.log("\n❌ Test FAILED! Error Logs captured:");
    console.log("-----------------------------------------");
    console.log(initialRun.logs);
    console.log("-----------------------------------------\n");

    const brokenCode = fs.readFileSync(targetFile, 'utf-8');

    const prompt = `
You are an autonomous code repair agent.
The following JavaScript file "${targetFile}" failed its unit test.

--- BROKEN CODE ---
${brokenCode}

--- TEST FAILURE LOGS ---
${initialRun.logs}

TASK:
1. Fix the bug in the code so the test passes.
2. Return ONLY the valid JavaScript code.
3. Do NOT include markdown code blocks, backticks, or any explanations.
`;

    let fixedCode = await askGeminiWithRetry(prompt);

    if (fixedCode.startsWith("```")) {
        fixedCode = fixedCode.replace(/^```[a-z]*\n/, "").replace(/```$/, "").trim();
    }

    console.log("✨ Gemini generated a patch! Applying fix to file...");
    fs.writeFileSync(targetFile, fixedCode, 'utf-8');

    console.log("\nStep 3: Re-running test to verify fix...");
    const verifyRun = runTestCommand(testCommand);

    if (verifyRun.success) {
        console.log("\n🎉 SUCCESS! AutoPatch fixed the code and tests are PASSING! 🚀\n");
    } else {
        console.log("\n⚠️ Patch applied, but tests still failed. Logs:");
        console.log(verifyRun.logs);
    }
}

autoPatch('sample/calculator.js', 'node sample/calculator.test.js');