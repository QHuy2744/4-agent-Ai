/**
 * Virtual File System với Journaling, Permissions, Metadata, Search, Versioning và Crash Recovery
 */
class VirtualFileSystem {
  constructor() {
    this.files = new Map();
    this.folders = new Set(['/']);
    this.journal = [];
    this.versionStore = new Map();
  }

  _validatePath(path) {
    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      throw new Error('Invalid path: must start with /');
    }
    if (path.includes('..')) {
      throw new Error('Path traversal detected: .. is not allowed');
    }
  }

  writeFile(path, content, permissions = 'rw', metadata = {}) {
    this._validatePath(path);
    const timestamp = Date.now();
    const version = (this.versionStore.get(path) || 0) + 1;
    this.versionStore.set(path, version);

    const fileObj = {
      path,
      content,
      permissions,
      metadata,
      createdAt: timestamp,
      updatedAt: timestamp,
      version
    };

    this.journal.push({ type: 'WRITE', path, fileObj, timestamp });
    this.files.set(path, fileObj);
    
    // Ensure parent folders exist
    const parts = path.split('/').filter(Boolean);
    let current = '';
    for (let i = 0; i < parts.length - 1; i++) {
      current += '/' + parts[i];
      this.folders.add(current);
    }

    return fileObj;
  }

  readFile(path) {
    this._validatePath(path);
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`);
    }
    return this.files.get(path);
  }

  deleteFile(path) {
    this._validatePath(path);
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`);
    }
    const file = this.files.get(path);
    this.journal.push({ type: 'DELETE', path, file, timestamp: Date.now() });
    this.files.delete(path);
    return true;
  }

  restoreFile(path, version) {
    this._validatePath(path);
    // Recovery from journal / version store simulation
    const history = this.journal.filter(j => j.path === path);
    const target = history.find(j => j.fileObj && j.fileObj.version === version);
    if (!target) {
      throw new Error(`Version ${version} for path ${path} not found in journal`);
    }
    this.files.set(path, target.fileObj);
    return target.fileObj;
  }

  recoverState() {
    // Replay journal for crash recovery
    this.files.clear();
    this.folders = new Set(['/']);
    for (const entry of this.journal) {
      if (entry.type === 'WRITE') {
        this.files.set(entry.path, entry.fileObj);
      } else if (entry.type === 'DELETE') {
        this.files.delete(entry.path);
      }
    }
    return true;
  }

  search(query) {
    const results = [];
    for (const [path, file] of this.files.entries()) {
      if (path.includes(query) || (typeof file.content === 'string' && file.content.includes(query))) {
        results.push(file);
      }
    }
    return results;
  }
}

export const vfs = new VirtualFileSystem();
