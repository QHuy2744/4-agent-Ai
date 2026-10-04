const DB_NAME = 'OmegaDesktopDB';
const DB_VERSION = 1;
const STORES = ['tasks', 'projects', 'documents', 'spreadsheets', 'files', 'notifications', 'settings', 'activity', 'snapshots'];

let idb = null;
let useLocalStorage = false;

export async function initDatabase() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      useLocalStorage = true;
      resolve(true);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      useLocalStorage = true;
      resolve(true);
    };
    request.onsuccess = event => {
      idb = event.target.result;
      resolve(true);
    };
    request.onupgradeneeded = event => {
      const dbInstance = event.target.result;
      STORES.forEach(storeName => {
        if (!dbInstance.objectStoreNames.contains(storeName)) {
          dbInstance.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };
  });
}

export const db = {
  async get(storeName, id) {
    if (useLocalStorage) {
      const data = JSON.parse(localStorage.getItem(`${DB_NAME}_${storeName}`) || '{}');
      return data[id] || null;
    }
    return new Promise(resolve => {
      const tx = idb.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },
  async getAll(storeName) {
    if (useLocalStorage) {
      const data = JSON.parse(localStorage.getItem(`${DB_NAME}_${storeName}`) || '{}');
      return Object.values(data);
    }
    return new Promise(resolve => {
      const tx = idb.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },
  async put(storeName, value) {
    if (!value.id) value.id = 'id_' + Math.random().toString(36).substr(2, 9);
    if (useLocalStorage) {
      const data = JSON.parse(localStorage.getItem(`${DB_NAME}_${storeName}`) || '{}');
      data[value.id] = value;
      localStorage.setItem(`${DB_NAME}_${storeName}`, JSON.stringify(data));
      return value;
    }
    return new Promise(resolve => {
      const tx = idb.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).put(value);
      req.onsuccess = () => resolve(value);
      req.onerror = () => resolve(null);
    });
  },
  async delete(storeName, id) {
    if (useLocalStorage) {
      const data = JSON.parse(localStorage.getItem(`${DB_NAME}_${storeName}`) || '{}');
      delete data[id];
      localStorage.setItem(`${DB_NAME}_${storeName}`, JSON.stringify(data));
      return true;
    }
    return new Promise(resolve => {
      const tx = idb.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }
};