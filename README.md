# OMEGA DESKTOP — Browser Operating System

OMEGA DESKTOP is a full-featured browser operating system mini designed for extreme system torture testing across PLANNER, CODER, TESTER, AUTO-FIX, and REVIEWER pipelines.

## Architecture
- **State Management**: Immutable-style store with subscriptions, selectors, and event bus.
- **Database**: IndexedDB with automatic migrations and robust localStorage fallback.
- **Applications**: 12+ fully functional desktop apps (Task, Project, Calendar, Spreadsheet, Editor, Terminal, File Manager, Analytics, Settings, Notifications, Search, Developer Tools).
- **Workers**: Multi-worker architecture (`analytics.worker.js`, `search.worker.js`, `import.worker.js`) via Worker Manager.
- **Security**: Web Crypto API encryption, sandbox terminal and virtual filesystem, CSP-compliant design (no `eval`, no `new Function`).
- **Testing**: Self-test engine running 30+ comprehensive test suites directly inside Developer Tools.