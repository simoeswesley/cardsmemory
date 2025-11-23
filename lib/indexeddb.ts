type Run = { id?: number; player: string; time: number; matches: number; date: string };

const DB_NAME = 'memory-db';
const STORE_NAME = 'runs';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB is not available'));
  }

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addRun(run: Omit<Run, 'id'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(run as any);
    req.onsuccess = () => {
      const id = req.result as number;
      resolve(id);
      db.close();
    };
    req.onerror = () => {
      reject(req.error);
      db.close();
    };
  });
}

export async function getAllRuns(): Promise<Run[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      resolve((req.result as Run[]) || []);
      db.close();
    };
    req.onerror = () => {
      reject(req.error);
      db.close();
    };
  });
}

export default {};
