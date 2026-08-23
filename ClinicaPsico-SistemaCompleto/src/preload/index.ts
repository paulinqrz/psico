import { contextBridge, ipcRenderer } from 'electron'
const api = {
  dashboard: { resumo: () => ipcRenderer.invoke('dashboard:resumo') },
  pacientes: {
    listar: () => ipcRenderer.invoke('pacientes:listar'),
    obter: (id) => ipcRenderer.invoke('pacientes:obter', id),
    criar: (dados) => ipcRenderer.invoke('pacientes:criar', dados),
    atualizar: (id, dados) => ipcRenderer.invoke('pacientes:atualizar', { id, dados }),
    excluir: (id) => ipcRenderer.invoke('pacientes:excluir', id)
  },
  sessoes: {
    listar: (pacienteId) => ipcRenderer.invoke('sessoes:listar', pacienteId),
    criar: (dados) => ipcRenderer.invoke('sessoes:criar', dados),
    excluir: (id) => ipcRenderer.invoke('sessoes:excluir', id)
  }
}
if (process.contextIsolated) {
  try { contextBridge.exposeInMainWorld('api', api) } catch (error) { console.error(error) }
} else {
  // @ts-ignore
  window.api = api
}
