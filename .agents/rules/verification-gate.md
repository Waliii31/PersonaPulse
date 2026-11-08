---
trigger: always_on
description: "Enforces automated testing and detailed step-by-step manual testing instructions after every task."
---
- Never mark a phase complete until you have run terminal checks (`npm run build`, `pytest`, or `curl` endpoint checks) and verified zero TypeScript or runtime errors.
- Always conclude your response with a step-by-step **Manual Verification Checklist** explaining:
  1. Which server(s) I need to run and on which ports.
  2. What exact input to enter or endpoint to hit.
  3. What exact output confirms 100% success before moving to the next phase.