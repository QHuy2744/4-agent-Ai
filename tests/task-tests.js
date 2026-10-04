import { validateTaskDependencies } from '../src/core/task-engine.js';

export function runTaskTests() {
  const tasks = [{ id: '1', dependencies: [] }, { id: '2', dependencies: ['1'] }];
  const cycle = validateTaskDependencies(tasks, '1', '2');
  return [{ name: 'Task Dependency Cycle Test', status: cycle ? 'PASS' : 'FAIL' }];
}