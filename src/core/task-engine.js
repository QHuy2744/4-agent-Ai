export function validateTaskDependencies(tasks, taskId, dependencyId) {
  if (taskId === dependencyId) return false;
  let visited = new Set();
  let queue = [dependencyId];
  while (queue.length > 0) {
    let curr = queue.shift();
    if (curr === taskId) return false;
    if (visited.has(curr)) continue;
    visited.add(curr);
    let t = tasks.find(x => x.id === curr);
    if (t && t.dependencies) {
      queue.push(...t.dependencies);
    }
  }
  return true;
}