export function processSyncQueue(queue) {
  return queue.map(item => ({ ...item, synced: true }));
}