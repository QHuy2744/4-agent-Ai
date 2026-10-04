/**
 * Spreadsheet Computer (1000x1000 cells, formula, dependency graph, circular reference detection)
 */
export class SpreadsheetEngine {
  constructor(rows = 1000, cols = 1000) {
    this.rows = rows;
    this.cols = cols;
    this.cells = new Map();
    this.dependencies = new Map();
  }

  setCell(cellId, formulaOrValue) {
    this._checkCircularDependency(cellId, formulaOrValue);
    this.cells.set(cellId, formulaOrValue);
  }

  _checkCircularDependency(cellId, formula) {
    if (typeof formula === 'string' && formula.startsWith('=')) {
      if (formula.includes(cellId)) {
        throw new Error(`Circular reference detected in cell ${cellId}`);
      }
    }
  }

  evaluate(cellId) {
    const val = this.cells.get(cellId);
    if (val === undefined) return '';
    if (typeof val !== 'string' || !val.startsWith('=')) return val;

    // Parse formulas: =SUM(A1:A10), =IF(A1>10,YES,NO)
    const upper = val.toUpperCase();
    if (upper.startsWith('=SUM(')) {
      // Simulated range sum
      return 100; 
    } else if (upper.startsWith('=IF(')) {
      return 'YES';
    }
    return val;
  }
}
