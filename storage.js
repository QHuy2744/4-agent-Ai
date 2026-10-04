/**
 * storage.js - IndexedDB storage engine with localStorage fallback and version migration.
 */
const DB_NAME = 'NexusTitanDB';
const DB_VERSION = 1;
const STORE_NAME = 'titan_store';

class StorageEngine {
  constructor() {
    this.db = null;
    this.isIndexedDBSupported = typeof indexedDB !== 'undefined';
  }

  async init() {
    if (!this.isIndexedDBSupported) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onerror = (event) => {
        console.warn('IndexedDB failed, falling back to localStorage', event.target.error);
        this.isIndexedDBSupported = false;
        resolve(null);
      };
    });
  }

  async get(key) {
    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction(STORE_NAME, 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
          request.onerror = () => reject(request.error);
        } catch (e) {
          resolve(this._getFromLocalStorage(key));
        }
      });
    }
    return this._getFromLocalStorage(key);
  }

  async set(key, value) {
    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put(value, key);
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        } catch (e) {
          resolve(this._setToLocalStorage(key, value));
        }
      });
    }
    return this._setToLocalStorage(key, value);
  }

  async remove(key) {
    if (this.isIndexedDBSupported && this.db) {
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.delete(key);
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        } catch (e) {
          resolve(this._removeFromLocalStorage(key));
        }
      });
    }
    return this._removeFromLocalStorage(key);
  }

  _getFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('LocalStorage read error', e);
      return null;
    }
  }

  _setToLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorage write error', e);
      return false;
    }
  }

  _removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorage remove error', e);
      return false;
    }
  }
}

window.storageEngine = new StorageEngine();
