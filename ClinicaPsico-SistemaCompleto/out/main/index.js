"use strict";
const electron = require("electron");
const path = require("path");
const client = require("@prisma/client");
const prisma = new client.PrismaClient();
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 850,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => mainWindow.show());
  if (process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.ipcMain.handle("dashboard:resumo", async () => {
    const totalPacientes = await prisma.paciente.count();
    return { totalPacientes };
  });
  electron.ipcMain.handle("pacientes:listar", async () => {
    return await prisma.paciente.findMany({ orderBy: { createdAt: "desc" } });
  });
  electron.ipcMain.handle("pacientes:obter", async (_, id) => {
    return await prisma.paciente.findUnique({ where: { id } });
  });
  electron.ipcMain.handle("pacientes:criar", async (_, dados) => {
    return await prisma.paciente.create({ data: dados });
  });
  electron.ipcMain.handle("pacientes:atualizar", async (_, { id, dados }) => {
    return await prisma.paciente.update({ where: { id }, data: dados });
  });
  electron.ipcMain.handle("pacientes:excluir", async (_, id) => {
    return await prisma.paciente.delete({ where: { id } });
  });
  electron.ipcMain.handle("sessoes:listar", async (_, pacienteId) => {
    return await prisma.sessao.findMany({ where: { pacienteId }, orderBy: { dataSessao: "desc" } });
  });
  electron.ipcMain.handle("sessoes:criar", async (_, dados) => {
    return await prisma.sessao.create({ data: dados });
  });
  electron.ipcMain.handle("sessoes:excluir", async (_, id) => {
    return await prisma.sessao.delete({ where: { id } });
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
