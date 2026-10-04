/**
 * Model Checker & State Machine Simulation
 */
export class ModelChecker {
  constructor(initialState, transitions) {
    this.state = initialState;
    this.transitions = transitions;
  }

  explore(steps = 10) {
    let current = this.state;
    const history = [current];
    for (let i = 0; i < steps; i++) {
      const next = this.transitions(current, i);
      if (!next) break;
      history.push(next);
      current = next;
    }
    return history;
  }
}
