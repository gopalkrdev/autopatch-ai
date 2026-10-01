# 🛡️ AutoPatch
> **Autonomous AI Debugger & Self-Healing CI/CD Agent**  
> *Built for Hacker House Goa 2026*

AutoPatch is an autonomous devtool agent that bridges the gap between test failures and code resolution. When a test suite or CI build fails, AutoPatch intercepts the stack trace, diagnoses the root cause using Google Gemini AI, applies an in-place patch, and verifies that tests pass before generating a clean git commit.

---

## ⚡ The Problem
Developers waste 30-40% of their time context-switching to debug trivial assertion errors, typos, and broken tests. Traditional linters and CI pipelines only tell you *that* something broke — **AutoPatch actually fixes it.**

---

## 🔄 How It Works (The Self-Healing Loop)


---

## 💻 Live Execution Demo

Here is AutoPatch diagnosing and repairing a broken calculator test in real-time:

```bash
$ node index.js

=================================
🛡️  AutoPatch: Autonomous AI Debugger
=================================

Step 1: Running initial test suite...
🚀 Executing: node sample/calculator.test.js

❌ Test FAILED! Error Logs captured:
-----------------------------------------
🧪 Running Test for add(10, 5)...
❌ Test Failed! Expected 15 but got: 5
-----------------------------------------

🤖 Asking Gemini AI (Attempt 1/3)...
✨ Gemini generated a patch! Applying fix to file...

Step 3: Re-running test to verify fix...
🚀 Executing: node sample/calculator.test.js

🎉 SUCCESS! AutoPatch fixed the code and tests are PASSING! 🚀
