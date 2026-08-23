"use strict";
const electron = require("electron");
const api = {
  dashboard: { resumo: () => electron.ipcRenderer.invoke("dashboard:resumo") },
  pacientes: {
    listar: () => electron.ipcRenderer.invoke("pacientes:listar"),
    obter: (id) => electron.ipcRenderer.invoke("pacientes:obter", id),
    criar: (dados) => electron.ipcRenderer.invoke("pacientes:criar", dados),
    atualizar: (id, dados) => electron.ipcRenderer.invoke("pacientes:atualizar", { id, dados }),
    excluir: (id) => electron.ipcRenderer.invoke("pacientes:excluir", id)
  },
  sessoes: {
    listar: (pacienteId) => electron.ipcRenderer.invoke("sessoes:listar", pacienteId),
    criar: (dados) => electron.ipcRenderer.invoke("sessoes:criar", dados),
    excluir: (id) => electron.ipcRenderer.invoke("sessoes:excluir", id)
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
