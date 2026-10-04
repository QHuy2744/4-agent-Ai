/**
 * Fuzz Tester for Omega Singularity Engine
 */
export class Fuzzer {
  constructor(targetFunction) {
    this.target = targetFunction;
    this.inputs = [
      null,
      undefined,
      NaN,
      Infinity,
      '',
      'A'.repeat(10000),
      { a: 1, b: { c: 2 } },
      [1, 2, 3],
      '{"malformed": json',
      '=SUM(invalid)'
    ];
  }

  run() {
    const failures = [];
    for (const input of this.inputs) {
      try {
        this.target(input);
      } catch (err) {
        // Expected exceptions are fine, but unexpected crashes / unhandled rejections are recorded
        if (err.message.includes('FATAL')) {
          failures.push({ input, error: err.message });
        }
      }
    }
    return { success: failures.length === 0, failures };
  }
}
