/**
 * Migration Chain Manager (v1 -> v2 -> v3 -> v4 -> v5)
 */
export class MigrationManager {
  constructor() {
    this.migrations = {
      'v1_to_v2': (data) => ({ ...data, version: 'v2', migratedAt: Date.now() }),
      'v2_to_v3': (data) => ({ ...data, version: 'v3' }),
      'v3_to_v4': (data) => ({ ...data, version: 'v4' }),
      'v4_to_v5': (data) => ({ ...data, version: 'v5' })
    };
  }

  migrate(data, targetVersion) {
    let current = data;
    const chain = ['v1_to_v2', 'v2_to_v3', 'v3_to_v4', 'v4_to_v5'];
    for (const step of chain) {
      if (current.version === targetVersion) break;
      current = this.migrations[step](current);
    }
    return current;
  }
}
