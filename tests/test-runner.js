import { runStateTests } from './state-tests.js';
import { runTaskTests } from './task-tests.js';

export async function runAllTests() {
  const results = [];
  results.push(...runStateTests());
  results.push(...runTaskTests());
  return results;
}