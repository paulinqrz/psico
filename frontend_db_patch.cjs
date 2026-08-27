const fs = require('fs');
let api = fs.readFileSync('src/services/api.ts', 'utf8');

const storageCode = `
// STORAGE HELPERS (Remotely persisted)
let cachedDb: any = null;

async function fetchDb() {
  if (cachedDb) return cachedDb;
  try {
    const res = await fetch('/api/db');
    cachedDb = await res.json();
    return cachedDb;
  } catch(e) {
    return {};
  }
}

async function getItem<T>(key: string, seed: T): Promise<T> {
  try {
    const db = await fetchDb();
    if (db[key] === undefined) {
      await setItem(key, seed);
      return seed;
    }
    return db[key] as T;
  } catch (e) {
    console.error('Erro ao carregar chave', key, e);
    return seed;
  }
}

async function setItem<T>(key: string, data: T): Promise<void> {
  try {
    if (!cachedDb) cachedDb = {};
    cachedDb[key] = data;
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: data })
    });
  } catch (e) {
    console.error('Erro ao salvar chave', key, e);
  }
}
`;

api = api.replace(/\/\/ STORAGE HELPERS[\s\S]*?function setItem<T>\(key: string, data: T\): void \{[\s\S]*?\n\}/, storageCode);
fs.writeFileSync('src/services/api.ts', api);
