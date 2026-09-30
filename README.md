# AutoPatch 
> Autonomous AI Debugger & Self-Healing CI/CD Agent

AutoPatch is an autonomous devtool that listens to CI/CD failure logs, isolates failing tests in a sandbox, generates verified code patches, and opens clean GitHub Pull Requests automatically.

### Architecture & Core Loop
1. **Webhook Listener**: Captures failing GitHub Actions workflow runs and error traces.
2. **Agentic Root-Cause Engine**: LLM analyzes AST diffs, test logs, and repository context.
3. **Sandboxed Verification**: Runs code modifications inside an isolated Docker environment to ensure 100% test pass rate.
4. **Auto-PR**: Opens a GitHub PR with comprehensive fix explanation.

*Status: In active development for Hacker House Goa 2026.*
