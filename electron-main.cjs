const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Clínica Psico App",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Ocultar a barra de menu padrão para ficar parecido com um app nativo
  mainWindow.setMenuBarVisibility(false);
  
  mainWindow.loadURL('http://127.0.0.1:3000');
}

function checkServerAndLoad() {
  // Faz ping no servidor local até ele responder, para evitar a tela branca de erro
  const req = http.get('http://127.0.0.1:3000', (res) => {
    if (res.statusCode) {
      createWindow();
    }
  });
  req.on('error', () => {
    setTimeout(checkServerAndLoad, 500);
  });
}

app.whenReady().then(() => {
  // Iniciar o backend seguro do Express (que carrega a chave da OpenAI e o frontend)
  const serverPath = path.join(__dirname, '../dist/server.cjs');
  
  serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
  });

  serverProcess.stdout.on('data', (data) => console.log(`Servidor: ${data}`));
  serverProcess.stderr.on('data', (data) => console.error(`Erro Servidor: ${data}`));

  // Aguardar o servidor responder antes de abrir a janela principal
  checkServerAndLoad();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Matar o servidor Express quando fechar o aplicativo
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});
