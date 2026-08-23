import React, { useState, useEffect } from 'react'
import {
  Settings,
  Shield,
  KeyRound,
  User,
  Building,
  Save,
  Check,
  Lock,
  Sparkles
} from 'lucide-react'
import { ConfiguracoesApp } from '../types'

interface ConfiguracoesModuleProps {
  onLockNow: () => void
}

export const ConfiguracoesModule: React.FC<ConfiguracoesModuleProps> = ({ onLockNow }) => {
  const [config, setConfig] = useState<ConfiguracoesApp | null>(null)
  const [nomeProfissional, setNomeProfissional] = useState('')
  const [crp, setCrp] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [enderecoConsultorio, setEnderecoConsultorio] = useState('')
  const [telefoneConsultorio, setTelefoneConsultorio] = useState('')
  const [tempoInatividadeMin, setTempoInatividadeMin] = useState(15)
  const [novaSenha, setNovaSenha] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const carregarDados = async () => {
    const c = await (window as any).api.config.obter()
    setConfig(c)
    setNomeProfissional(c.nomeProfissional || '')
    setCrp(c.crp || '')
    setEspecialidade(c.especialidade || '')
    setEnderecoConsultorio(c.enderecoConsultorio || '')
    setTelefoneConsultorio(c.telefoneConsultorio || '')
    setTempoInatividadeMin(c.tempoInatividadeMin || 15)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Partial<ConfiguracoesApp> = {
      nomeProfissional,
      crp,
      especialidade,
      enderecoConsultorio,
      telefoneConsultorio,
      tempoInatividadeMin
    }
    if (novaSenha.trim()) {
      payload.senhaHash = novaSenha.trim()
    }

    await (window as any).api.config.salvar(payload)
    setNovaSenha('')
    await carregarDados()
    mostrarToast('Configurações e parâmetros de segurança atualizados com sucesso!')
  }

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
          <h1 className="title">Configurações do Consultório & Segurança</h1>
          <p className="subtitle">
            Personalize dados do profissional, parâmetros de documentos clínicos e políticas de bloqueio
          </p>
        </div>

        <button onClick={onLockNow} className="btn btn-secondary">
          <Lock size={16} /> Bloquear Tela Agora
        </button>
      </div>

      <form onSubmit={handleSalvar}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Dados Profissionais */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <User size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Identificação do Profissional Responsável
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Nome Completo do Psicólogo(a) *</label>
                <input
                  type="text"
                  className="input"
                  value={nomeProfissional}
                  onChange={(e) => setNomeProfissional(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label>Registro CRP *</label>
                  <input
                    type="text"
                    className="input"
                    value={crp}
                    onChange={(e) => setCrp(e.target.value)}
                    placeholder="Ex: 06/123456"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Especialidade / Abordagem</label>
                  <input
                    type="text"
                    className="input"
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    placeholder="Ex: TCC / Psicanálise"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Endereço do Consultório (Cabeçalho)</label>
                <input
                  type="text"
                  className="input"
                  value={enderecoConsultorio}
                  onChange={(e) => setEnderecoConsultorio(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Telefone Comercial</label>
                <input
                  type="text"
                  className="input"
                  value={telefoneConsultorio}
                  onChange={(e) => setTelefoneConsultorio(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Segurança & Bloqueio Local */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Shield size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Segurança, Senha e Bloqueio Automático
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Alterar Senha de Acesso Local (Deixe em branco para manter)</label>
                <input
                  type="password"
                  className="input"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha (ex: 1234)"
                />
              </div>

              <div className="input-group">
                <label>Tempo de Inatividade para Bloqueio Automático</label>
                <select
                  className="input"
                  value={tempoInatividadeMin}
                  onChange={(e) => setTempoInatividadeMin(Number(e.target.value))}
                >
                  <option value={5}>5 minutos (Recomendado para consultório compartilhado)</option>
                  <option value={10}>10 minutos</option>
                  <option value={15}>15 minutos (Padrão)</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                </select>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  marginTop: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                    <Sparkles size={16} color="#2563eb" /> Assistente OpenAI (GPT-4o / GPT-4o-mini)
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '10px' }}>Servidor Seguro</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                  • <strong>Variável de Ambiente:</strong> <code style={{ background: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>OPENAI_API_KEY</code> no servidor.<br />
                  • <strong>Proteção LGPD:</strong> Todas as solicitações passam pelo modal de anonimização obrigatória antes de qualquer envio.<br />
                  • <strong>Modo Offline/Fallback:</strong> Caso a chave não esteja definida, o sistema utiliza o motor clínico heurístico local sem interrupção de serviço.
                </div>
              </div>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Save size={18} /> Salvar Parâmetros
          </button>
        </div>
      </form>
    </div>
  )
}
