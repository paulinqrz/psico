const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const dbCode = `
  const DB_FILE = path.join(process.cwd(), 'db.json');
  
  app.get('/api/db', (req, res) => {
    try {
      if (!fs.existsSync(DB_FILE)) {
        return res.json({});
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch(e) {
      res.json({});
    }
  });

  app.post('/api/db', (req, res) => {
    try {
      const { key, value } = req.body;
      let db = {};
      if (fs.existsSync(DB_FILE)) {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      }
      db[key] = value;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ success: false });
    }
  });
`;

server = server.replace("app.use(express.json({ limit: '10mb' }));", "app.use(express.json({ limit: '10mb' }));\n" + dbCode);
server = `import fs from 'fs';\n` + server;

fs.writeFileSync('server.ts', server);
