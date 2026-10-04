export function logActivity(action, details) {
  console.log(`[LOG] ${new Date().toISOString()} - ${action}`, details);
}