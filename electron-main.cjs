const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow(serverUrl) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Márcia Helena - Psicologia",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  mainWindow.loadURL(serverUrl || 'http://127.0.0.1:3000');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Inicializa o servidor backend Node
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`Server: ${output}`);
    
    // Procura a url onde o servidor iniciou
    const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) {
      if (!mainWindow) createWindow(match[0]);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  // Encerra o backend ao fechar o app
  if (serverProcess) {
    serverProcess.kill();
  }
});
