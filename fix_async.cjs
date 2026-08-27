const fs = require('fs');
let api = fs.readFileSync('src/services/api.ts', 'utf8');

// Undo the raw replacements, I'll just write a script that processes lines
api = api.replace(/async function await getItem/g, 'async function getItem');
api = api.replace(/await await/g, 'await');
api = api.replace(/async function await setItem/g, 'async function setItem');

fs.writeFileSync('src/services/api.ts', api);
