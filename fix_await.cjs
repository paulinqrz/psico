const fs = require('fs');
let api = fs.readFileSync('src/services/api.ts', 'utf8');

// Fix registrarLog signature to async
api = api.replace(/export function registrarLog/g, 'export async function registrarLog');

// Prepend await to getItem calls
api = api.replace(/(?<!function |async function |await )getItem\(/g, 'await getItem(');
api = api.replace(/(?<!function |async function |await )getItem</g, 'await getItem<');

// Prepend await to setItem calls
api = api.replace(/(?<!function |async function |await )setItem\(/g, 'await setItem(');

fs.writeFileSync('src/services/api.ts', api);
