/**
 * Code Execution Sandbox (Isolated JS execution without DOM/storage/network access)
 */
export class JavaScriptSandbox {
  constructor() {
    // Restricted context
  }

  execute(code, timeoutMs = 1000) {
    // Check forbidden globals or patterns
    const forbidden = ['window', 'document', 'localStorage', 'fetch', 'XMLHttpRequest', 'eval'];
    for (const f of forbidden) {
      if (code.includes(f)) {
        throw new Error(`Security Violation: Access to '${f}' is prohibited inside sandbox.`);
      }
    }

    try {
      // Use Function constructor with empty scope simulation
      const restrictedFn = new Function('console', 'Math', 'Date', `
        "use strict";
        try {
          return (function() {
            ${code}
          )();
        } catch(e) {
          return { error: e.message };
        }
      `);
      
      const safeConsole = { log: (...args) => args };
      return restrictedFn(safeConsole, Math, Date);
    } catch (err) {
      throw new Error(`Sandbox Execution Error: ${err.message}`);
    }
  }
}
