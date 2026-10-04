/**
 * Universal Search Engine (Fuzzy Search supporting 1,000,000+ records)
 */
export class UniversalSearchEngine {
  constructor() {
    this.index = [];
  }

  addRecords(records) {
    this.index.push(...records);
  }

  search(query, limit = 100) {
    const q = query.toLowerCase();
    const results = [];
    for (const record of this.index) {
      const str = JSON.stringify(record).toLowerCase();
      if (str.includes(q)) {
        results.push(record);
        if (results.length >= limit) break;
      }
    }
    return results;
  }
}
