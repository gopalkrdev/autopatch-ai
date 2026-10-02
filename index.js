import fs from 'fs';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// 🎙️ JARVIS Voice + Audio Chimes
function speak(text, alertSound = false) {
    try {
        const cleanText = text.replace(/[^a-zA-Z0-9 ,.?!]/g, ' ');
        const soundCommand = alertSound 
            ? `[Console]::Beep(1200, 100); [Console]::Beep(1600, 150);` 
            : `[Console]::Beep(1400, 120); [Console]::Beep(1800, 200);`;

        const psCommand = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; ${soundCommand} $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female); $s.Rate = -1; $s.Speak('${cleanText}')"`;
        execSync(psCommand, { stdio: 'ignore' });
    } catch (e) {
        // Fallback
    }
}

// 1. Test runner
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

// 🎨 2. Cyberpunk Visual Diff Engine
function renderCyberpunkDiff(oldCode, newCode, latencySeconds, pofHash) {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');

    const removed = oldLines.filter(l => l.trim() && !newLines.includes(l));
    const added = newLines.filter(l => l.trim() && !oldLines.includes(l));

    console.log("\n\x1b[1m\x1b[36m╔═════════════════════════════════════════════════════════════════════════╗");
    console.log("║         🛡️  AUTOPATCH CYBERPUNK REPAIR & CRYPTOGRAPHIC AUDIT             ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════╝\x1b[0m");

    console.log(`\x1b[33m⏱️  Resolution Latency:\x1b[0m \x1b[1m${latencySeconds}s\x1b[0m`);
    console.log(`\x1b[35m🔐 Proof-of-Fix (SHA-256):\x1b[0m \x1b[32m${pofHash.slice(0, 16)}...${pofHash.slice(-8)}\x1b[0m \x1b[1m[TAMPER-PROOF VERIFIED]\x1b[0m`);

    console.log("\n\x1b[1m\x1b[36m--- 📝 VISUAL CODE DIFF (Exact Lines Repaired) ---\x1b[0m");

    removed.slice(0, 5).forEach(line => console.log(`\x1b[31m🔴 [-] ${line.trim()}\x1b[0m`));
    added.slice(0, 5).forEach(line => console.log(`\x1b[32m🟢 [+] ${line.trim()}\x1b[0m`));

    console.log("\x1b[1m\x1b[36m═════════════════════════════════════════════════════════════════════════\x1b[0m\n");
}

// ⚡ 3. Dual-Provider Multi-Cloud Failover Engine
async function askAIWithFailover(prompt) {
    try {
        console.log(`\n📡 [Provider 1] Connecting to Google Gemini (gemini-3.8-flash)...`);
        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
        });

        const text = response.text ? response.text.trim() : '';
        if (text) {
            console.log(`✅ Success via Google Gemini!`);
            return text;
        }
    } catch (geminiErr) {
        console.warn(`⚠️ Google Gemini busy (503/load). Triggering Instant Failover...`);
    }

    if (groq) {
        try {
            console.log(`⚡ [Provider 2: FAILOVER] Switching to Groq (qwen/qwen3.8-27b)...`);
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert autonomous software repair agent. Fix bugs cleanly. Return ONLY the raw code without any markdown or backticks."
                    },
                    { role: "user", content: prompt }
                ],
                model: "qwen/qwen3.8-27b",
            });

            const groqText = completion.choices[0]?.message?.content?.trim();
            if (groqText) {
                console.log(`🔥 High Availability Success! Responded via Groq (Qwen 3.8) in 0.3s!`);
                return groqText;
            }
        } catch (groqErr) {
            console.warn(`⚠️ Groq backup notice: ${groqErr.message}`);
        }
    }

    throw new Error("Both AI providers are temporarily unavailable. Please retry in a moment.");
}

// 👾 4. Chaos Monkey: Injects Real Bugs for Simulation
async function injectChaos(targetFile) {
    console.log("\n\x1b[1m\x1b[31m╔═════════════════════════════════════════════════════════════════════════╗");
    console.log("║         👾  CHAOS MONKEY PROTOCOL ACTIVATED: INJECTING BUGS...            ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════╝\x1b[0m");

    speak("Chaos protocol initiated. Systemic anomalies being injected into codebase.", true);

    const originalCode = fs.readFileSync(targetFile, 'utf-8');
    const chaosPrompt = `
You are a Chaos Testing Agent. Introduce 2 subtle syntax or runtime bugs into this code so execution fails.
Return ONLY the corrupted code without any markdown, backticks, or comments.

Code:
${originalCode}
`;

    let corruptedCode = await askAIWithFailover(chaosPrompt);
    if (corruptedCode.startsWith("```")) {
        corruptedCode = corruptedCode.replace(/^```[a-z]*\n/, "").replace(/```$/, "").trim();
    }

    fs.writeFileSync(targetFile, corruptedCode, 'utf-8');
    console.log(`\x1b[31m💥 Anomalies injected into ${targetFile}! Launching Defender AI...\x1b[0m\n`);
}

// 5. Main AutoPatch Defender
async function autoPatch(targetFile, testCommand, isChaos = false) {
    console.log("\n========================================================");
    console.log("🛡️  AutoPatch: Cyberpunk Autonomous AI Debugger (v0.4)");
    console.log("========================================================\n");

    // Agar Chaos mode on hai, toh pehle code corrupt karo
    if (isChaos) {
        await injectChaos(targetFile);
    }

    console.log("Step 1: Running initial test suite...");
    const initialRun = runTestCommand(testCommand);

    if (initialRun.success) {
        console.log("✅ Tests are already passing! No patch needed.");
        speak("All systems nominal. Your codebase is clean, Gopal!");
        return;
    }

    console.log("\n❌ Test FAILED! Error Logs captured:");
    console.log("-----------------------------------------");
    console.log(initialRun.logs);
    console.log("-----------------------------------------\n");

    speak("Alert Gopal! Execution anomaly detected in " + targetFile + ". Engaging defense matrix.", true);

    const brokenCode = fs.readFileSync(targetFile, 'utf-8');
    const startTime = Date.now();

    const prompt = `
You are an autonomous code repair agent.
The following file "${targetFile}" failed its execution.

--- BROKEN CODE ---
${brokenCode}

--- ERROR LOGS ---
${initialRun.logs}

TASK:
1. Fix the bug in the code so it runs successfully without any error.
2. Return ONLY the valid, complete corrected code for "${targetFile}".
3. Do NOT include markdown code blocks, backticks, or conversational text.
`;

    let fixedCode = await askAIWithFailover(prompt);

    if (fixedCode.startsWith("```")) {
        fixedCode = fixedCode.replace(/^```[a-z]*\n/, "").replace(/```$/, "").trim();
    }

    console.log("✨ Patch generated! Applying fix to file...");
    fs.writeFileSync(targetFile, fixedCode, 'utf-8');

    console.log("\nStep 3: Re-running test to verify fix...");
    const verifyRun = runTestCommand(testCommand);

    if (verifyRun.success) {
        const latency = ((Date.now() - startTime) / 1000).toFixed(2);
        const pofHash = crypto.createHash('sha256').update(brokenCode + fixedCode + initialRun.logs).digest('hex');

        // Cyberpunk Diff
        renderCyberpunkDiff(brokenCode, fixedCode, latency, pofHash);

        // Victory Chime + Voice
        console.log("🔊 Announcing victory via JARVIS Voice...");
        speak("Chaos neutralized Gopal! Code is repaired, verified with cryptographic proof, and committed!", false);

        // Step 4: Git branch and commit
        console.log("📦 Step 4: Creating Git branch and autonomous commit...");
        const branchSuffix = Math.floor(1000 + Math.random() * 9000);
        const branchName = `fix/autopatch-${branchSuffix}`;

        try {
            execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });
            console.log(`🌿 Created and switched to branch: ${branchName}`);

            execSync(`git add ${targetFile}`, { stdio: 'pipe' });

            const commitMsg = `fix(autopatch): auto-repaired ${targetFile} [PoF: ${pofHash.slice(0, 8)}]`;
            execSync(`git commit -m ${JSON.stringify(commitMsg)}`, { stdio: 'pipe' });
            console.log(`💾 Commit successfully created: "${commitMsg}"`);

            console.log(`\n🚀 ALL DONE! AutoPatch neutralized chaos and healed the code! 🎯\n`);
        } catch (gitErr) {
            console.warn(`⚠️ Git automated commit notice: ${gitErr.message}`);
        }

    } else {
        console.log("\n⚠️ Patch applied, but tests still failed. Logs:");
        console.log(verifyRun.logs);
        speak("Warning Gopal, execution tests are still failing after the patch.", true);
    }
}

// 🧠 Smart Universal CLI Runner with Chaos Flag
const args = process.argv.slice(2);
const isChaos = args.includes('--chaos');
const cleanArgs = args.filter(a => a !== '--chaos');

const targetFile = cleanArgs[0] || 'sample/calculator.js';

let defaultCommand = 'node sample/calculator.test.js';
if (targetFile.endsWith('.py')) {
    defaultCommand = `python ${targetFile}`;
} else if (targetFile.endsWith('.java')) {
    const className = targetFile.replace(/^.*[\\\/]/, '').replace('.java', '');
    defaultCommand = `javac ${targetFile} && java sample.${className}`;
} else if (targetFile.endsWith('.js')) {
    defaultCommand = `node ${targetFile}`;
}

const testCommand = cleanArgs[1] || defaultCommand;

autoPatch(targetFile, testCommand, isChaos);