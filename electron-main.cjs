const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Márcia Helena - Psicologia",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  mainWindow.loadURL('http://localhost:3000');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Inicializa o servidor backend Node
  const serverPath = path.join(__dirname, 'dist', 'server.cjs');
  serverProcess = spawn('node', [serverPath]);
  
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
    // Espera o servidor subir na porta 3000 para abrir a tela
    if (data.toString().includes('3000') || data.toString().includes('running')) {
      if (!mainWindow) createWindow();
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  // Fallback: se não capturar a mensagem, abre a tela em 3 segundos
  setTimeout(() => {
    if (!mainWindow) createWindow();
  }, 3000);
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
