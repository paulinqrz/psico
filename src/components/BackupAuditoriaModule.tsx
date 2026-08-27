import React, { useState, useEffect } from 'react'
import { ConfirmModal } from './ConfirmModal'
import {
  Database,
  Download,
  Upload,
  ShieldCheck,
  History,
  Check
} from 'lucide-react'
import { LogAuditoria, ConfiguracoesApp } from '../types'

export const BackupAuditoriaModule: React.FC = () => {
  const [logs, setLogs] = useState<LogAuditoria[]>([])
  const [config, setConfig] = useState<ConfiguracoesApp | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS')
  const [confirmarRestaure, setConfirmarRestaure] = useState<{conteudo: string} | null>(null)
  const [toastMsg, setToastMsg] = useState('')

  const carregarDados = async () => {
    const l = await (window as any).api.auditoria.listar()
    setLogs(l)
    const c = await (window as any).api.config.obter()
    setConfig(c)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  const handleExportarBackup = async () => {
    const jsonString = await (window as any).api.backup.exportarDados()
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-clinica-psico-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    await carregarDados()
    mostrarToast('Backup seguro gerado e baixado com sucesso!')
  }

  const handleRestaurarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const conteudo = event.target?.result as string
      setConfirmarRestaure({ conteudo })
    }
    reader.readAsText(file)
  }

  const logsFiltrados = logs.filter((l) => {
    if (filtroCategoria === 'TODAS') return true
    return l.categoria === filtroCategoria
  })

  return (
    <div className="page-enter" style={{ padding: '36px 40px' }}>
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 9999
          }}
        >
          <Check size={18} color="#10b981" />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '26px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 className="title">Segurança, Backup & Trilha de Auditoria</h1>
          <p className="subtitle">
            Gestão da integridade do banco de dados local e rastreamento de ações em conformidade com a LGPD
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px' }}>
        
        {/* Painel de Backup & Restauração */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Database size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Banco de Dados Local (SQLite)
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Último backup:{' '}
                  <strong>
                    {config?.ultimaDataBackup
                      ? new Date(config.ultimaDataBackup).toLocaleString('pt-BR')
                      : 'Nunca'}
                  </strong>
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Os dados clínicos e prontuários ficam armazenados exclusivamente no disco do computador local.
              Faça cópias de segurança periódicas para manter a redundância dos registros.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleExportarBackup}
                className="btn btn-primary"
                style={{ justifyContent: 'center', padding: '12px' }}
              >
                <Download size={18} /> Exportar Backup Completo (.JSON)
              </button>

              <label
                className="btn btn-secondary"
                style={{
                  justifyContent: 'center',
                  padding: '12px',
                  cursor: 'pointer'
                }}
              >
                <Upload size={18} /> Restaurar Backup a partir de Arquivo
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleRestaurarArquivo}
                />
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} color="#059669" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Garantias de Privacidade e Sigilo
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
              <li>Nenhum dado é compartilhado automaticamente com a nuvem sem consentimento.</li>
              <li>A API de IA recebe exclusivamente textos anonimizados sob demanda.</li>
              <li>Todas as alterações no prontuário geram registro na trilha de auditoria.</li>
            </ul>
          </div>
        </div>

        {/* Trilha de Auditoria */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Trilha de Auditoria de Eventos
              </h2>
            </div>

            <select
              className="input"
              style={{ width: 'auto', fontSize: '12px', padding: '6px 12px' }}
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="TODAS">Todas as Categorias</option>
              <option value="PACIENTE">Pacientes</option>
              <option value="CONSULTA">Consultas / Agenda</option>
              <option value="SESSAO">Sessões Clínicas</option>
              <option value="DIAGNOSTICO">Diagnósticos</option>
              <option value="IA">Uso de IA</option>
              <option value="BACKUP">Backups</option>
              <option value="CONFIG">Configurações</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logsFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                Nenhum evento registrado nesta categoria.
              </div>
            ) : (
              logsFiltrados.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="badge badge-gray" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        {log.categoria}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>{log.acao}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{log.detalhe}</div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                    <br />
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={!!confirmarRestaure}
        title="Restaurar Backup"
        message="Atenção: A restauração irá substituir a base de dados atual pelo backup selecionado. Deseja prosseguir?"
        onCancel={() => setConfirmarRestaure(null)}
        onConfirm={async () => {
          if (confirmarRestaure) {
            const ok = await (window as any).api.backup.restaurarDados(confirmarRestaure.conteudo)
            if (ok) {
              await carregarDados()
              mostrarToast('Base de dados e prontuários restaurados com sucesso!')
            } else {
              mostrarToast('Arquivo de backup corrompido ou incompatível.')
            }
            setConfirmarRestaure(null)
          }
        }}
      />
    </div>
  )
}
