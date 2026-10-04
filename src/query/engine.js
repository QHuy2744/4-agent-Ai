/**
 * Universal Query Engine (Parser & Executor without eval)
 */
export class QueryEngine {
  constructor(dataSource) {
    this.dataSource = dataSource; // Array or Map of objects
  }

  parseQuery(queryString) {
    // Format: entity field=value field>value
    const parts = queryString.trim().split(/\s+/);
    const entity = parts[0];
    const conditions = [];

    for (let i = 1; i < parts.length; i++) {
      const token = parts[i];
      if (token.includes('=')) {
        const [field, val] = token.split('=');
        conditions.push({ field, op: '===', val: this._castValue(val) });
      } else if (token.includes('>')) {
        const [field, val] = token.split('>');
        conditions.push({ field, op: '>', val: this._castValue(val) });
      } else if (token.includes('<')) {
        const [field, val] = token.split('<');
        conditions.push({ field, op: '<', val: this._castValue(val) });
      }
    }

    return { entity, conditions };
  }

  _castValue(val) {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (!isNaN(Number(val))) return Number(val);
    return val;
  }

  execute(queryString) {
    const { conditions } = this.parseQuery(queryString);
    const data = Array.isArray(this.dataSource) ? this.dataSource : Array.from(this.dataSource.values());

    return data.filter(item => {
      return conditions.every(cond => {
        const itemVal = item[cond.field];
        if (cond.op === '===') return itemVal === cond.val;
        if (cond.op === '>') return itemVal > cond.val;
        if (cond.op === '<') return itemVal < cond.val;
        return false;
      });
    });
  }
}
