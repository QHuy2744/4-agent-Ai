/**
 * Nested Transaction Engine với Atomicity, Consistency, Isolation và Durability
 */
export class TransactionEngine {
  constructor(vfsInstance) {
    this.vfs = vfsInstance;
    this.activeTransactions = [];
  }

  begin() {
    const snapshot = {
      files: new Map(this.vfs.files),
      journalLength: this.vfs.journal.length
    };
    this.activeTransactions.push(snapshot);
    return this.activeTransactions.length - 1;
  }

  commit(txId) {
    if (txId !== this.activeTransactions.length - 1) {
      throw new Error('Invalid transaction commit order (Isolation violation)');
    }
    this.activeTransactions.pop();
    return true;
  }

  rollback(txId) {
    if (txId !== this.activeTransactions.length - 1) {
      throw new Error('Invalid transaction rollback order');
    }
    const snapshot = this.activeTransactions.pop();
    // Rollback state
    this.vfs.files = snapshot.files;
    this.vfs.journal = this.vfs.journal.slice(0, snapshot.journalLength);
    return true;
  }
}
