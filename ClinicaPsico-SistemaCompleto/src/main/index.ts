import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280, height: 850, show: false, autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true, contextIsolation: true, nodeIntegration: false,
    }
  })
  mainWindow.on('ready-to-show', () => mainWindow.show())
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  
  // Dashboard
  ipcMain.handle('dashboard:resumo', async () => {
    const totalPacientes = await prisma.paciente.count()
    return { totalPacientes }
  })

  // Pacientes
  ipcMain.handle('pacientes:listar', async () => {
    return await prisma.paciente.findMany({ orderBy: { createdAt: 'desc' } })
  })
  ipcMain.handle('pacientes:obter', async (_, id) => {
    return await prisma.paciente.findUnique({ where: { id } })
  })
  ipcMain.handle('pacientes:criar', async (_, dados) => {
    return await prisma.paciente.create({ data: dados })
  })
  ipcMain.handle('pacientes:atualizar', async (_, { id, dados }) => {
    return await prisma.paciente.update({ where: { id }, data: dados })
  })
  ipcMain.handle('pacientes:excluir', async (_, id) => {
    return await prisma.paciente.delete({ where: { id } })
  })

  // Sessões
  ipcMain.handle('sessoes:listar', async (_, pacienteId) => {
    return await prisma.sessao.findMany({ where: { pacienteId }, orderBy: { dataSessao: 'desc' } })
  })
  ipcMain.handle('sessoes:criar', async (_, dados) => {
    return await prisma.sessao.create({ data: dados })
  })
  ipcMain.handle('sessoes:excluir', async (_, id) => {
    return await prisma.sessao.delete({ where: { id } })
  })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
