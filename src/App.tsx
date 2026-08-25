import React, { useState, useEffect, useRef } from 'react'
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Plus,
  ChevronRight,
  ChevronLeft,
  Menu,
  Save,
  X,
  ArrowLeft,
  Trash2,
  UserCircle2,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  CalendarDays,
  FileText,
  Search,
  Lock,
  Edit3,
  Sparkles,
  AlertCircle,
  ClipboardList,
  FileBadge2,
  Database,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  Activity,
  FileCheck
} from 'lucide-react'

// Import de módulos especializados da arquitetura clínica profissional
import { AuthLockScreen } from './components/AuthLockScreen'
import { AgendaLifecycleModule } from './components/AgendaLifecycleModule'
import { DiagnosticosModule } from './components/DiagnosticosModule'
import { AvaliacoesModule } from './components/AvaliacoesModule'
import { AssistenteIAModule } from './components/AssistenteIAModule'
import { RelatoriosModule } from './components/RelatoriosModule'
import { BackupAuditoriaModule } from './components/BackupAuditoriaModule'
import { ConfiguracoesModule } from './components/ConfiguracoesModule'
import { ConfiguracoesApp } from './types'

// --- TOAST NOTIFICATION COMPONENT ---
function Toast({
  message,
  visible,
  onClose
}: {
  message: string
  visible: boolean
  onClose: () => void
}) {
  if (!visible) return null
  return (
    <div className="toast-notification success">
      <CheckCircle size={18} style={{ color: '#10b981' }} />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Fechar notificação">
        <X size={16} />
      </button>
    </div>
  )
}

// --- DASHBOARD PROFISSIONAL INTEGRADO ---
function Dashboard() {
  const [totalPacientes, setTotalPacientes] = useState(0)
  const [totalSessoes, setTotalSessoes] = useState(0)
  const [totalConsultas, setTotalConsultas] = useState(0)
  const [totalDiagnosticos, setTotalDiagnosticos] = useState(0)
  const [recentPacientes, setRecentPacientes] = useState<any[]>([])
  const [recentSessoes, setRecentSessoes] = useState<any[]>([])
  const [proximasConsultas, setProximasConsultas] = useState<any[]>([])
  const [config, setConfig] = useState<ConfiguracoesApp | null>(null)

  useEffect(() => {
    window.api.dashboard.resumo().then((dados: any) => {
      setTotalPacientes(dados.totalPacientes || 0)
      setTotalSessoes(dados.totalSessoes || 0)
      setTotalConsultas(dados.totalConsultas || 0)
      setTotalDiagnosticos(dados.totalDiagnosticos || 0)
    })
    window.api.pacientes.listar().then((p: any) => setRecentPacientes(p.slice(0, 4)))
    window.api.sessoes.todas().then((s: any) => setRecentSessoes(s.slice(0, 4)))
    window.api.consultas.listar().then((c: any) => {
      const dataDeHoje = new Date().toISOString().slice(0, 10)
      const futuras = c.filter((item: any) => {
        // Must be pending and happen strictly today
        const isPending = item.status !== 'concluido' && item.status !== 'cancelado'
        const isToday = item.horarioAgendado.startsWith(dataDeHoje)
        return isPending && isToday
      })
      // sort by time
      futuras.sort((a: any, b: any) => new Date(a.horarioAgendado).getTime() - new Date(b.horarioAgendado).getTime())
      setProximasConsultas(futuras.slice(0, 4))
    })
    window.api.config.obter().then((c: any) => setConfig(c))
  }, [])

  return (
    <div key="dashboard-page" className="page-enter" style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="title">Painel de Controle Clínico</h1>
          <p className="subtitle">
            Bem-vindo(a), {config?.nomeProfissional || 'Dr(a). Terapeuta'} • {config?.especialidade || 'Psicologia Clínica'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/agenda" className="btn btn-primary">
            <Calendar size={16} /> Ver Agenda da Semana
          </Link>
          <Link to="/ia-assistente" className="btn btn-secondary">
            <Sparkles size={16} color="#2563eb" /> Assistente IA
          </Link>
        </div>
      </div>

      {/* 4 Cards de Métricas Principais */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >
        <div className="card stat-card">
          <div className="stat-icon primary">
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Pacientes Cadastrados
            </span>
            <p className="stat-number">{totalPacientes}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon emerald">
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Sessões Realizadas
            </span>
            <p className="stat-number">{totalSessoes}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div
            className="stat-icon"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Consultas Agendadas
            </span>
            <p className="stat-number">{totalConsultas}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div
            className="stat-icon"
            style={{ background: '#f3e8ff', color: '#9333ea' }}
          >
            <FileBadge2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Diagnósticos Clínicos
            </span>
            <p className="stat-number">{totalDiagnosticos}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Próximos Atendimentos na Agenda */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Próximos Atendimentos
            </h2>
            <Link to="/agenda" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
              Abrir Agenda
            </Link>
          </div>

          {proximasConsultas.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Nenhum atendimento pendente para hoje.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {proximasConsultas.map((c) => {
                const pac = recentPacientes.find((p) => p.id === c.pacienteId)
                return (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>
                        {pac?.nome || 'Paciente'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {c.resumo || 'Sessão clínica'} • {new Date(c.horarioAgendado).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        c.status === 'em_atendimento'
                          ? 'badge-purple'
                          : c.status === 'aguardando'
                          ? 'badge-yellow'
                          : 'badge-blue'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      {c.status === 'em_atendimento'
                        ? 'Em Atendimento'
                        : c.status === 'aguardando'
                        ? 'Na Sala'
                        : 'Agendado'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pacientes Recentes */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Pacientes Ativos Recentes
            </h2>
            <Link to="/pacientes" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
              Ver Todos
            </Link>
          </div>
          {recentPacientes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Nenhum paciente cadastrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentPacientes.map((p) => (
                <Link
                  key={p.id}
                  to="/pacientes"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar-mini">{p.nome.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{p.nome}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                        {p.telefone || p.email || 'Sem contato'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Últimas Evoluções no Prontuário */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Últimas Sessões Registradas
            </h2>
            <Link to="/sessoes" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
              Prontuários
            </Link>
          </div>
          {recentSessoes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Nenhuma sessão registrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentSessoes.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                      {new Date(s.dataSessao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                      Gravada
                    </span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '12px', color: '#334155' }}>
                    {s.resumo || 'Sessão sem resumo'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// --- PERFIL COMPLETO DO PACIENTE ---
function PerfilPaciente({ id, voltar }: { id: string; voltar: () => void }) {
  const [paciente, setPaciente] = useState<any>(null)
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [profissao, setProfissao] = useState('')
  const [queixa, setQueixa] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    window.api.pacientes.obter(id).then((dados: any) => {
      setPaciente(dados)
      if (dados) {
        setTelefone(dados.telefone || '')
        setEmail(dados.email || '')
        setCpf(dados.cpf || '')
        setEndereco(dados.endereco || '')
        setProfissao(dados.profissao || '')
        setQueixa(dados.queixa || '')
      }
    })
  }, [id])

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    setCpf(v)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3')
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2')
    setTelefone(v)
  }

  const salvarDetalhes = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    await window.api.pacientes.atualizar(id, { telefone, email, cpf, endereco, profissao, queixa })
    setSalvando(false)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  if (!paciente) return <div style={{ padding: '40px', color: '#64748b' }}>Carregando dados do paciente...</div>

  const idade = Math.floor(
    (new Date().getTime() - new Date(paciente.dataNascimento).getTime()) / 3.15576e10
  )

  return (
    <div key={`perfil-${id}`} className="page-enter" style={{ padding: '36px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Toast message="Dados do paciente atualizados com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />

      <div className="breadcrumbs">
        <button onClick={voltar} className="breadcrumb-item">
          Pacientes
        </button>
        <span>/</span>
        <span className="breadcrumb-current">{paciente.nome}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
        <button onClick={voltar} className="btn btn-secondary" title="Voltar à lista">
          <ArrowLeft size={18} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="avatar-placeholder">{paciente.nome.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="title" style={{ fontSize: '22px', marginBottom: '2px' }}>
              {paciente.nome}
            </h1>
            <p className="subtitle">
              Nascimento: {new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')} ({idade} anos)
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#0f172a' }}>
            Ficha Cadastral e Dados de Contato
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Informações cadastrais e anamnese inicial
          </p>
        </div>

        <form onSubmit={salvarDetalhes}>
          <div className="form-grid">
            <div className="input-group">
              <label>Telefone / WhatsApp</label>
              <div className="input-with-icon">
                <Phone size={16} />
                <input
                  type="tel"
                  className="input"
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div className="input-group">
              <label>CPF</label>
              <input
                type="text"
                className="input"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="input-group">
              <label>Profissão / Ocupação</label>
              <input
                type="text"
                className="input"
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                placeholder="Ex: Engenheiro de Software"
              />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Endereço Completo</label>
              <div className="input-with-icon">
                <MapPin size={16} />
                <input
                  type="text"
                  className="input"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Queixa Principal / Motivo da Consulta</label>
              <textarea
                className="input"
                rows={4}
                value={queixa}
                onChange={(e) => setQueixa(e.target.value)}
                placeholder="Descreva a queixa inicial relatada pelo paciente na primeira sessão..."
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '24px',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '18px'
            }}
          >
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              <Save size={16} /> {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- TELA PACIENTES (LISTAGEM & NOVO) ---
function TelaPacientes() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [modoForm, setModoForm] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const carregarPacientes = async () => {
    const dados = await window.api.pacientes.listar()
    setPacientes(dados)
  }

  useEffect(() => {
    carregarPacientes()
  }, [])

  const criarPacienteRapido = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.api.pacientes.criar({
      nome,
      dataNascimento: new Date(dataNascimento).toISOString(),
      telefone,
      email
    })
    setModoForm(false)
    carregarPacientes()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 4000)
  }

  const excluir = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Tem certeza que deseja excluir este paciente permanentemente com todo o seu histórico?')) {
      await window.api.pacientes.excluir(id)
      carregarPacientes()
    }
  }

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.telefone && p.telefone.includes(busca)) ||
      (p.email && p.email.toLowerCase().includes(busca.toLowerCase()))
  )

  if (pacienteSelecionado) {
    return (
      <PerfilPaciente
        key={`perfil-${pacienteSelecionado}`}
        id={pacienteSelecionado}
        voltar={() => {
          setPacienteSelecionado(null)
          carregarPacientes()
        }}
      />
    )
  }

  if (modoForm) {
    return (
      <div key="form-novo" className="page-enter" style={{ padding: '36px 40px' }}>
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '14px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700, color: '#0f172a' }}>
                Novo Paciente
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Preencha os dados básicos para abrir o prontuário
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModoForm(false)}
              className="btn btn-icon-only"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={criarPacienteRapido} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                className="input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoFocus
                placeholder="Ex: Carlos Eduardo Silva"
              />
            </div>
            <div className="input-group">
              <label>Data de Nascimento *</label>
              <input
                type="date"
                className="input"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Telefone / WhatsApp</label>
              <input
                type="tel"
                className="input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" onClick={() => setModoForm(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Paciente
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div key="lista-pacientes" className="page-enter" style={{ padding: '36px 40px' }}>
      <Toast message="Paciente cadastrado com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />

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
          <h1 className="title">Meus Pacientes</h1>
          <p className="subtitle">Gestão de prontuários cadastrais e acompanhamento</p>
        </div>
        <button
          onClick={() => {
            setNome('')
            setDataNascimento('')
            setTelefone('')
            setEmail('')
            setModoForm(true)
          }}
          className="btn btn-accent"
        >
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      <div style={{ marginBottom: '20px', maxWidth: '380px' }}>
        <div className="input-with-icon">
          <Search size={16} />
          <input
            type="text"
            className="input"
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {pacientesFiltrados.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <UserCircle2 size={46} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>
              {busca ? 'Nenhum paciente encontrado para esta busca.' : 'Nenhum paciente cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Idade</th>
                  <th>Contato</th>
                  <th>Data de Cadastro</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p) => {
                  const idade = Math.floor(
                    (new Date().getTime() - new Date(p.dataNascimento).getTime()) / 3.15576e10
                  )
                  return (
                    <tr key={p.id} onClick={() => setPacienteSelecionado(p.id)}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="avatar-mini">{p.nome.charAt(0).toUpperCase()}</div>
                          <div>
                            <span style={{ color: '#0f172a' }}>{p.nome}</span>
                            {p.profissao && (
                              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 400 }}>
                                {p.profissao}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '14px' }}>{idade} anos</td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {p.telefone || p.email || '—'}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            className="btn btn-icon-only text-danger"
                            onClick={(e) => excluir(e, p.id)}
                            title="Excluir Paciente"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                            Ver Ficha <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// --- DETALHE E EDIÇÃO DE UMA SESSÃO ESPECÍFICA (PÁGINA DEDICADA) ---
function DetalheEditarSessao({
  sessaoId,
  paciente,
  voltar
}: {
  sessaoId: string
  paciente: any
  voltar: () => void
}) {
  const [sessao, setSessao] = useState<any>(null)
  const [dataSessao, setDataSessao] = useState('')
  const [resumo, setResumo] = useState('')
  const [anotacoes, setAnotacoes] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    window.api.sessoes.obter(sessaoId).then((dados: any) => {
      if (dados) {
        setSessao(dados)
        setDataSessao(dados.dataSessao ? dados.dataSessao.slice(0, 16) : '')
        setResumo(dados.resumo || '')
        setAnotacoes(dados.anotacoes || '')
      }
    })
  }, [sessaoId])

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    await window.api.sessoes.atualizar(sessaoId, {
      dataSessao: new Date(dataSessao).toISOString(),
      resumo,
      anotacoes
    })
    setSalvando(false)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const handleExcluir = async () => {
    if (confirm('Tem certeza que deseja excluir o registro desta sessão?')) {
      await window.api.sessoes.excluir(sessaoId)
      voltar()
    }
  }

  const inserirTemplateSOAP = () => {
    const template = `[ S ] SUBJETIVO (Relato do paciente):
- 

[ O ] OBJETIVO (Observações do terapeuta):
- 

[ A ] AVALIAÇÃO (Hipóteses e análise):
- 

[ P ] PLANO (Condutas e tarefas):
- `
    setAnotacoes(prev => (prev ? prev + '\n\n' + template : template))
  }

  const inserirTemplateBasico = () => {
    const template = `Queixa Principal:
- 

Desenvolvimento da Sessão / Intervenções:
- 

Próximos Passos (Para casa):
- `
    setAnotacoes(prev => (prev ? prev + '\n\n' + template : template))
  }

  if (!sessao) {
    return <div style={{ padding: '40px', color: '#64748b' }}>Carregando dados da sessão...</div>
  }

  return (
    <div key={`detalhe-sessao-${sessaoId}`} className="page-enter" style={{ padding: '36px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Toast message="Sessão e anotações salvas com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Breadcrumb navigation */}
      <div className="breadcrumbs">
        <button onClick={voltar} className="breadcrumb-item">
          Sessões
        </button>
        <span>/</span>
        <button onClick={voltar} className="breadcrumb-item">
          {paciente.nome}
        </button>
        <span>/</span>
        <span className="breadcrumb-current">Prontuário da Sessão</span>
      </div>

      {/* Top Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={voltar} className="btn btn-secondary" title="Voltar para a lista de sessões">
            <ArrowLeft size={18} /> Voltar
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="title" style={{ fontSize: '22px', margin: 0 }}>
                Evolução Clínica & Prontuário
              </h1>
              <span className="badge badge-emerald">
                <Lock size={12} /> Sigilo
              </span>
            </div>
            <p className="subtitle" style={{ marginTop: '2px' }}>
              Paciente: <strong>{paciente.nome}</strong>
            </p>
          </div>
        </div>

        <button onClick={handleExcluir} className="btn btn-danger-outline" title="Excluir esta sessão">
          <Trash2 size={16} /> Excluir Registro
        </button>
      </div>

      {/* Form Card for editing */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {/* Date and Time */}
              <div className="input-group" style={{ flex: '0 0 240px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={15} color="#2563eb" /> Data e Horário
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={dataSessao}
                  onChange={(e) => setDataSessao(e.target.value)}
                  required
                  style={{ background: '#fff' }}
                />
              </div>

              {/* Session Title / Theme */}
              <div className="input-group" style={{ flex: 1, minWidth: '300px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="#2563eb" /> Resumo do Atendimento
                </label>
                <input
                  type="text"
                  className="input"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Qual o tema principal desta sessão?"
                  required
                  style={{ fontSize: '15px', fontWeight: 500, background: '#fff' }}
                />
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Clinical Notes (Editable) */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <FileText size={15} color="#2563eb" /> Anotações do Prontuário
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button type="button" onClick={inserirTemplateSOAP} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                    <Plus size={14} /> Estrutura SOAP
                  </button>
                  <button type="button" onClick={inserirTemplateBasico} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                    <Plus size={14} /> Tópicos Básicos
                  </button>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <textarea
                  className="input"
                  rows={14}
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                  placeholder="Escreva livremente o relato da sessão, técnicas aplicadas, reflexões do paciente..."
                  style={{
                    resize: 'vertical',
                    lineHeight: '1.7',
                    fontFamily: 'inherit',
                    padding: '20px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                  }}
                />
                <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '11px', color: '#94a3b8', background: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                  {anotacoes.length} caracteres
                </div>
              </div>
            </div>

            {/* Info footer box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                fontSize: '12px',
                color: '#64748b',
                marginTop: '16px'
              }}
            >
              <AlertCircle size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
              <span>
                As anotações são salvas localmente no seu dispositivo. Garanta a privacidade da sua tela durante os atendimentos (resolução CFP 01/2009).
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderTop: '1px solid #f1f5f9',
              background: '#fafbfc'
            }}
          >
            <button type="button" onClick={voltar} className="btn btn-secondary" style={{ color: '#64748b' }}>
              Descartar alterações
            </button>
            <button
              id="btn-salvar-sessao"
              type="submit"
              className="btn btn-primary"
              disabled={salvando}
              style={{ padding: '10px 28px', fontSize: '15px', fontWeight: 600, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >
              <Save size={18} /> {salvando ? 'Salvando...' : 'Salvar Prontuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- LISTA DE SESSÕES DO PACIENTE (COM CARDS/BOXES CLICÁVEIS) ---
function ListaSessoesPaciente({
  pacienteId,
  voltar
}: {
  pacienteId: string
  voltar: () => void
}) {
  const [paciente, setPaciente] = useState<any>(null)
  const [sessoes, setSessoes] = useState<any[]>([])
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null)
  const [modoNovaSessao, setModoNovaSessao] = useState(false)

  // Form states for new session
  const [dataSessao, setDataSessao] = useState(new Date().toISOString().slice(0, 16))
  const [resumo, setResumo] = useState('')
  const [anotacoes, setAnotacoes] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const carregarDados = async () => {
    const p = await window.api.pacientes.obter(pacienteId)
    setPaciente(p)
    const s = await window.api.sessoes.listar(pacienteId)
    setSessoes(s)
  }

  useEffect(() => {
    carregarDados()
  }, [pacienteId])

  const salvarNovaSessao = async (e: React.FormEvent) => {
    e.preventDefault()
    const nova = await window.api.sessoes.criar({
      pacienteId,
      dataSessao: new Date(dataSessao).toISOString(),
      resumo,
      anotacoes
    })
    setModoNovaSessao(false)
    setResumo('')
    setAnotacoes('')
    await carregarDados()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
    // Opcional: abre a sessão criada para edição se desejar
    setSessaoSelecionada(nova.id)
  }

  const inserirTemplateSOAPNovo = () => {
    const template = `[ S ] SUBJETIVO (Relato do paciente):
- 

[ O ] OBJETIVO (Observações do terapeuta):
- 

[ A ] AVALIAÇÃO (Hipóteses e análise):
- 

[ P ] PLANO (Condutas e tarefas):
- `
    setAnotacoes(prev => (prev ? prev + '\n\n' + template : template))
  }

  const inserirTemplateBasicoNovo = () => {
    const template = `Queixa Principal:
- 

Desenvolvimento da Sessão / Intervenções:
- 

Próximos Passos (Para casa):
- `
    setAnotacoes(prev => (prev ? prev + '\n\n' + template : template))
  }

  if (sessaoSelecionada && paciente) {
    return (
      <DetalheEditarSessao
        key={`edit-sessao-${sessaoSelecionada}`}
        sessaoId={sessaoSelecionada}
        paciente={paciente}
        voltar={() => {
          setSessaoSelecionada(null)
          carregarDados()
        }}
      />
    )
  }

  if (!paciente) {
    return <div style={{ padding: '40px', color: '#64748b' }}>Carregando dados do paciente...</div>
  }

  const idade = Math.floor(
    (new Date().getTime() - new Date(paciente.dataNascimento).getTime()) / 3.15576e10
  )

  return (
    <div key={`sessoes-paciente-${pacienteId}`} className="page-enter" style={{ padding: '36px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Toast message="Nova sessão registrada com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Breadcrumb */}
      <div className="breadcrumbs">
        <button onClick={voltar} className="breadcrumb-item">
          Sessões Clínicas
        </button>
        <span>/</span>
        <span className="breadcrumb-current">{paciente.nome}</span>
      </div>

      {/* Header Info Card */}
      <div
        className="card"
        style={{
          marginBottom: '28px',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={voltar} className="btn btn-secondary" title="Voltar à lista de pacientes">
            <ArrowLeft size={18} /> Voltar
          </button>
          <div className="avatar-placeholder">{paciente.nome.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="title" style={{ fontSize: '22px', margin: 0 }}>
                {paciente.nome}
              </h1>
              <span className="badge badge-blue">
                {sessoes.length} {sessoes.length === 1 ? 'sessão' : 'sessões'}
              </span>
            </div>
            <p className="subtitle" style={{ marginTop: '3px' }}>
              {idade} anos • {paciente.telefone || paciente.email || 'Sem contato'}
              {paciente.profissao ? ` • ${paciente.profissao}` : ''}
            </p>
          </div>
        </div>

        {!modoNovaSessao && (
          <button
            onClick={() => {
              setDataSessao(new Date().toISOString().slice(0, 16))
              setResumo('')
              setAnotacoes('')
              setModoNovaSessao(true)
            }}
            className="btn btn-accent"
          >
            <Plus size={18} /> Registrar Nova Sessão
          </button>
        )}
      </div>

      {/* Mode New Session Form */}
      {modoNovaSessao && (
        <div
          className="card page-enter"
          style={{
            marginBottom: '28px',
            border: '2px solid #3b82f6',
            boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.12)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '14px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#2563eb" />
              <h2 style={{ fontSize: '17px', margin: 0, fontWeight: 700, color: '#0f172a' }}>
                Nova Sessão Clínica
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setModoNovaSessao(false)}
              className="btn btn-icon-only"
              title="Cancelar"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={salvarNovaSessao}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="input-group" style={{ maxWidth: '280px' }}>
                <label>Data e Horário</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={dataSessao}
                  onChange={(e) => setDataSessao(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Tema / Resumo Breve (Ex: Alinhamento de expectativas...)</label>
                <input
                  type="text"
                  className="input"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Ex: Alinhamento de expectativas e objetivos terapêuticos"
                  required
                  autoFocus
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Anotações Iniciais do Prontuário</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button type="button" onClick={inserirTemplateSOAPNovo} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                      <Plus size={12} /> Estrutura SOAP
                    </button>
                    <button type="button" onClick={inserirTemplateBasicoNovo} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                      <Plus size={12} /> Tópicos
                    </button>
                  </div>
                </div>
                <textarea
                  className="input"
                  rows={8}
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                  placeholder="Descreva o que foi trabalhado, técnicas aplicadas e observações..."
                  style={{ resize: 'vertical', lineHeight: '1.6', fontSize: '14px', background: '#fafbfc' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" onClick={() => setModoNovaSessao(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Salvar Sessão
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patient's Sessions List (Interactive Clickable Boxes) */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0' }}>
          Histórico de Evolução
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Clique em qualquer sessão abaixo para abrir a página completa e editar anotações.
        </p>
      </div>

      {sessoes.length === 0 && !modoNovaSessao ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            color: '#64748b',
            background: '#ffffff'
          }}
        >
          <MessageSquare size={44} style={{ opacity: 0.35, margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: '0 0 6px 0' }}>
            Nenhuma sessão registrada
          </h3>
          <p style={{ fontSize: '14px', margin: '0 0 18px 0', color: '#94a3b8' }}>
            Comece registrando a primeira sessão e evolução terapêutica de {paciente.nome}.
          </p>
          <button
            onClick={() => {
              setDataSessao(new Date().toISOString().slice(0, 16))
              setResumo('')
              setAnotacoes('')
              setModoNovaSessao(true)
            }}
            className="btn btn-accent"
          >
            <Plus size={16} /> Criar Primeira Sessão
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sessoes.map((s, index) => {
            const dataFormatada = new Date(s.dataSessao).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
            const horaFormatada = new Date(s.dataSessao).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={s.id}
                className="session-box"
                onClick={() => setSessaoSelecionada(s.id)}
                role="button"
                tabIndex={0}
                title="Clique para ver anotações e editar"
              >
                {/* Header row with date & badge */}
                <div className="session-box-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={16} color="#2563eb" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                      {dataFormatada} às {horaFormatada}
                    </span>
                  </div>
                  <span className="badge badge-slate">
                    Sessão #{sessoes.length - index}
                  </span>
                </div>

                {/* Main clickable title / theme requested by the user */}
                <div>
                  <h3 className="session-box-title">
                    {s.resumo || 'Sessão clínica sem tema especificado'}
                  </h3>
                </div>

                {/* Footer with action hint */}
                <div className="session-box-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: 500, fontSize: '13px' }}>
                    <Edit3 size={14} /> Ver descrição, anotações e editar
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                    <span>Abrir</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- TELA SESSÕES PRINCIPAL (ESCOLHER PACIENTE) ---
function TelaSessoesMain() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [sessoesCounts, setSessoesCounts] = useState<Record<string, number>>({})
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const carregar = async () => {
    const lista = await window.api.pacientes.listar()
    setPacientes(lista)

    // Load session counts for each patient
    const counts: Record<string, number> = {}
    for (const p of lista) {
      const s = await window.api.sessoes.listar(p.id)
      counts[p.id] = s.length
    }
    setSessoesCounts(counts)
  }

  useEffect(() => {
    carregar()
  }, [])

  if (pacienteSelecionado) {
    return (
      <ListaSessoesPaciente
        key={`sessoes-list-${pacienteSelecionado}`}
        pacienteId={pacienteSelecionado}
        voltar={() => {
          setPacienteSelecionado(null)
          carregar()
        }}
      />
    )
  }

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div key="lista-sessoes" className="page-enter" style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: '26px' }}>
        <h1 className="title">Prontuários & Sessões Clínicas</h1>
        <p className="subtitle">
          Selecione o paciente para acompanhar e editar suas sessões e histórico de evolução
        </p>
      </div>

      <div style={{ marginBottom: '24px', maxWidth: '380px' }}>
        <div className="input-with-icon">
          <Search size={16} />
          <input
            type="text"
            className="input"
            placeholder="Buscar paciente por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}
      >
        {pacientesFiltrados.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <Users size={40} style={{ opacity: 0.4, margin: '0 auto 10px' }} />
            <p style={{ margin: 0, fontWeight: 500 }}>
              {busca ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado.'}
            </p>
          </div>
        ) : (
          pacientesFiltrados.map((p) => {
            const count = sessoesCounts[p.id] || 0
            const idade = Math.floor(
              (new Date().getTime() - new Date(p.dataNascimento).getTime()) / 3.15576e10
            )

            return (
              <div
                key={p.id}
                className="card card-hoverable"
                onClick={() => setPacienteSelecionado(p.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="avatar-placeholder">{p.nome.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.nome}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      {idade} anos {p.profissao ? `• ${p.profissao}` : ''}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px'
                  }}
                >
                  <span className={`badge ${count > 0 ? 'badge-blue' : 'badge-slate'}`}>
                    {count} {count === 1 ? 'sessão registrada' : 'sessões registradas'}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Acompanhar <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// --- TELA AGENDA (SEMANAL SEGUNDA A SEXTA) ---
function TelaAgenda() {
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [sessoes, setSessoes] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [novoModalAberto, setNovoModalAberto] = useState(false)
  const [slotDataHora, setSlotDataHora] = useState('')
  const [selectedPacienteId, setSelectedPacienteId] = useState('')
  const [sessaoResumo, setSessaoResumo] = useState('')
  const [sessaoAnotacoes, setSessaoAnotacoes] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [sessaoModalDetalhe, setSessaoModalDetalhe] = useState<any>(null)
  const [editandoDataHora, setEditandoDataHora] = useState('')
  const [editandoResumo, setEditandoResumo] = useState('')
  const [editandoAnotacoes, setEditandoAnotacoes] = useState('')
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)

  const carregarDados = async () => {
    const s = await window.api.sessoes.todas()
    setSessoes(s)
    const p = await window.api.pacientes.listar()
    setPacientes(p)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // Calcular a segunda-feira da semana atual com base no offset
  const hoje = new Date()
  const diaSemanaHoje = hoje.getDay() // 0 = Domingo, 1 = Segunda, ...
  const diffSegunda = diaSemanaHoje === 0 ? -6 : 1 - diaSemanaHoje
  
  const segundaFeira = new Date(hoje)
  segundaFeira.setDate(hoje.getDate() + diffSegunda + semanaOffset * 7)
  segundaFeira.setHours(0, 0, 0, 0)

  // Dias de segunda a sexta (5 dias)
  const diasDaSemana = [0, 1, 2, 3, 4].map((offset) => {
    const data = new Date(segundaFeira)
    data.setDate(segundaFeira.getDate() + offset)
    return data
  })

  const nomesDias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']

  // Identificar se um dia é "hoje"
  const isMesmoDia = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  // Agrupar sessões por dia da semana
  const sessoesPorDia = diasDaSemana.map((dia) => {
    return sessoes.filter((s) => {
      const dataSessao = new Date(s.dataSessao)
      return isMesmoDia(dataSessao, dia)
    }).sort((a, b) => new Date(a.dataSessao).getTime() - new Date(b.dataSessao).getTime())
  })

  // Total de sessões na semana selecionada
  const totalSessoesSemana = sessoesPorDia.reduce((acc, curr) => acc + curr.length, 0)

  const formatarIntervaloSemana = () => {
    const seg = diasDaSemana[0]
    const sex = diasDaSemana[4]
    const diaInicio = seg.getDate()
    const mesInicio = seg.toLocaleDateString('pt-BR', { month: 'short' })
    const diaFim = sex.getDate()
    const mesFim = sex.toLocaleDateString('pt-BR', { month: 'short' })
    const ano = sex.getFullYear()
    return `${diaInicio} de ${mesInicio} a ${diaFim} de ${mesFim}, ${ano}`
  }

  const abrirModalNovoAgendamento = (dataDefault?: Date, horaDefault = '09:00') => {
    const base = dataDefault ? new Date(dataDefault) : new Date()
    const [h, m] = horaDefault.split(':').map(Number)
    base.setHours(h, m, 0, 0)
    
    // Ajustar para formato datetime-local ISO local
    const tzOffset = base.getTimezoneOffset() * 60000
    const localISOTime = new Date(base.getTime() - tzOffset).toISOString().slice(0, 16)
    
    setSlotDataHora(localISOTime)
    setSelectedPacienteId(pacientes[0]?.id || '')
    setSessaoResumo('')
    setSessaoAnotacoes('')
    setNovoModalAberto(true)
  }

  const salvarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPacienteId) return
    await window.api.sessoes.criar({
      pacienteId: selectedPacienteId,
      dataSessao: new Date(slotDataHora).toISOString(),
      resumo: sessaoResumo || 'Sessão de Psicoterapia',
      anotacoes: sessaoAnotacoes
    })
    setNovoModalAberto(false)
    await carregarDados()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const abrirDetalheSessao = (sessao: any) => {
    setSessaoModalDetalhe(sessao)
    setEditandoDataHora(sessao.dataSessao ? sessao.dataSessao.slice(0, 16) : '')
    setEditandoResumo(sessao.resumo || '')
    setEditandoAnotacoes(sessao.anotacoes || '')
  }

  const salvarEdicaoSessao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessaoModalDetalhe) return
    setSalvandoEdicao(true)
    await window.api.sessoes.atualizar(sessaoModalDetalhe.id, {
      dataSessao: new Date(editandoDataHora).toISOString(),
      resumo: editandoResumo,
      anotacoes: editandoAnotacoes
    })
    setSalvandoEdicao(false)
    setSessaoModalDetalhe(null)
    await carregarDados()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const excluirSessaoAgenda = async () => {
    if (!sessaoModalDetalhe) return
    if (confirm('Deseja excluir este agendamento da agenda?')) {
      await window.api.sessoes.excluir(sessaoModalDetalhe.id)
      setSessaoModalDetalhe(null)
      await carregarDados()
    }
  }

  const obterNomePaciente = (pacienteId: string) => {
    const p = pacientes.find((item) => item.id === pacienteId)
    return p ? p.nome : 'Paciente'
  }

  return (
    <div key="agenda-page" className="page-enter" style={{ padding: '36px 40px' }}>
      <Toast message="Agenda atualizada com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />

      {/* Header com Navegação de Semana */}
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
          <h1 className="title">Agenda Semanal</h1>
          <p className="subtitle">Visualização de consultas e atendimentos de Segunda a Sexta-feira</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <AnimatePresence>
            {semanaOffset !== 0 && (
              <motion.button 
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                onClick={() => setSemanaOffset(0)} 
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '13px', overflow: 'hidden' }}
              >
                Voltar para Hoje
              </motion.button>
            )}
          </AnimatePresence>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '3px'
            }}
          >
            <button
              onClick={() => setSemanaOffset((prev) => prev - 1)}
              className="btn btn-icon-only"
              title="Semana anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span 
              style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#334155', 
                padding: '0 12px', 
                minWidth: '150px', 
                textAlign: 'center' 
              }}
            >
              {formatarIntervaloSemana()}
            </span>
            <button
              onClick={() => setSemanaOffset((prev) => prev + 1)}
              className="btn btn-icon-only"
              title="Próxima semana"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button onClick={() => abrirModalNovoAgendamento()} className="btn btn-accent">
            <Plus size={18} /> Agendar Atendimento
          </button>
        </div>
      </div>

      {/* Subheader com dados da semana */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          background: '#ffffff',
          padding: '14px 20px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarDays size={18} color="#2563eb" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
            Resumo Semanal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-blue">
            {totalSessoesSemana} {totalSessoesSemana === 1 ? 'atendimento na semana' : 'atendimentos na semana'}
          </span>
        </div>
      </div>

      {/* Colunas dos 5 Dias: Segunda a Sexta */}
      <div className="agenda-grid">
        {diasDaSemana.map((dia, idx) => {
          const eHoje = isMesmoDia(dia, hoje)
          const sessoesDia = sessoesPorDia[idx]

          return (
            <div key={idx} className={`agenda-day-col ${eHoje ? 'is-today' : ''}`}>
              <div className="agenda-day-header">
                <div>
                  <div className="agenda-day-title">{nomesDias[idx]}</div>
                  <div className="agenda-day-date">
                    {dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={() => abrirModalNovoAgendamento(dia, '10:00')}
                  className="btn btn-icon-only"
                  style={{ padding: '4px 6px', color: '#2563eb' }}
                  title={`Agendar na ${nomesDias[idx]}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="agenda-slots-list">
                {sessoesDia.length === 0 ? (
                  <div className="agenda-empty-day">
                    <Clock size={20} style={{ opacity: 0.3 }} />
                    <span>Nenhum atendimento agendado</span>
                    <button
                      onClick={() => abrirModalNovoAgendamento(dia, '09:00')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      + Horário
                    </button>
                  </div>
                ) : (
                  sessoesDia.map((sessao) => {
                    const horaFormatada = new Date(sessao.dataSessao).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    const nomePac = obterNomePaciente(sessao.pacienteId)

                    return (
                      <div
                        key={sessao.id}
                        className="agenda-event-card"
                        onClick={() => abrirDetalheSessao(sessao)}
                        title="Clique para ver ou editar detalhes"
                      >
                        <div className="agenda-event-time">
                          <Clock size={12} />
                          <span>{horaFormatada}</span>
                        </div>
                        <div className="agenda-event-patient">{nomePac}</div>
                        <div className="agenda-event-desc">
                          {sessao.resumo || 'Sessão clínica'}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL: NOVO AGENDAMENTO */}
      {novoModalAberto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div className="card page-enter" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '14px',
                marginBottom: '18px'
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Agendar Consulta
              </h2>
              <button onClick={() => setNovoModalAberto(false)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarAgendamento}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <label>Paciente *</label>
                  <select
                    className="input"
                    value={selectedPacienteId}
                    onChange={(e) => setSelectedPacienteId(e.target.value)}
                    required
                  >
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Data e Horário do Atendimento *</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={slotDataHora}
                    onChange={(e) => setSlotDataHora(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Tema / Resumo da Consulta</label>
                  <input
                    type="text"
                    className="input"
                    value={sessaoResumo}
                    onChange={(e) => setSessaoResumo(e.target.value)}
                    placeholder="Ex: Acompanhamento quinzenal"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Observações Prévias (Opcional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={sessaoAnotacoes}
                    onChange={(e) => setSessaoAnotacoes(e.target.value)}
                    placeholder="Informações adicionais para este atendimento..."
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '22px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '16px'
                }}
              >
                <button type="button" onClick={() => setNovoModalAberto(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER / EDITAR AGENDAMENTO SELECIONADO */}
      {sessaoModalDetalhe && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
        >
          <div className="card page-enter" style={{ width: '100%', maxWidth: '540px', padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '14px',
                marginBottom: '18px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Detalhes do Atendimento
                </h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Paciente: <strong>{obterNomePaciente(sessaoModalDetalhe.pacienteId)}</strong>
                </p>
              </div>
              <button onClick={() => setSessaoModalDetalhe(null)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarEdicaoSessao}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <label>Data e Horário</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={editandoDataHora}
                    onChange={(e) => setEditandoDataHora(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Tema / Resumo da Sessão</label>
                  <input
                    type="text"
                    className="input"
                    value={editandoResumo}
                    onChange={(e) => setEditandoResumo(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Anotações Clínicas</label>
                  <textarea
                    className="input"
                    rows={5}
                    value={editandoAnotacoes}
                    onChange={(e) => setEditandoAnotacoes(e.target.value)}
                    placeholder="Anotações e evolução clínica..."
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '22px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '16px'
                }}
              >
                <button type="button" onClick={excluirSessaoAgenda} className="btn btn-danger-outline">
                  <Trash2 size={16} /> Excluir
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setSessaoModalDetalhe(null)} className="btn btn-secondary">
                    Fechar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={salvandoEdicao}>
                    <Save size={16} /> {salvandoEdicao ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// --- LAYOUT PRINCIPAL PROFISSIONAL ---
function Layout({
  children,
  onLock
}: {
  children: React.ReactNode
  onLock: () => void
}) {
  const location = useLocation()
  const [config, setConfig] = useState<ConfiguracoesApp | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    window.api.config.obter().then((c: any) => setConfig(c))
  }, [location.pathname])

  const menuItems = [
    { nome: 'Dashboard', icone: <LayoutDashboard size={22} />, rota: '/' },
    { nome: 'Pacientes', icone: <Users size={22} />, rota: '/pacientes' },
    { nome: 'Sessões', icone: <MessageSquare size={22} />, rota: '/sessoes' },
    { nome: 'Agenda', icone: <Calendar size={22} />, rota: '/agenda' },
    { nome: 'Avaliações', icone: <ClipboardList size={22} />, rota: '/avaliacoes' },
    { nome: 'Diagnósticos', icone: <FileBadge2 size={22} />, rota: '/diagnosticos' },
    { nome: 'Assistente IA', icone: <Sparkles size={22} color="#60a5fa" />, rota: '/ia-assistente' },
    { nome: 'Relatórios', icone: <FileText size={22} />, rota: '/relatorios' },
    { nome: 'Auditoria', icone: <Database size={22} />, rota: '/backup' },
    { nome: 'Ajustes', icone: <Settings size={22} />, rota: '/configuracoes' }
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-main)', overflow: 'hidden' }}>
      <motion.aside 
        className="sidebar" 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80, minWidth: isSidebarOpen ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 50, borderRight: '1px solid var(--sidebar-hover)', background: 'var(--sidebar-bg)' }}
      >
        <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isSidebarOpen ? '24px 20px' : '24px 0', minHeight: '84px', borderBottom: '1px solid var(--sidebar-hover)', marginBottom: '12px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', overflow: 'hidden', width: '100%', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
            <div className="logo-icon" style={{ flexShrink: 0 }}>Ψ</div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--bg-card)' }}>Márcia Helena</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Psicologia Clínica</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: isSidebarOpen ? '10px' : 'auto',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isSidebarOpen ? '0 12px' : '0 4px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.rota
            return (
              <Link
                key={item.nome}
                to={item.rota}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ 
                  padding: isSidebarOpen ? '10px 14px' : '14px', 
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSidebarOpen ? '14px' : '0',
                  marginBottom: '6px'
                }}
                title={!isSidebarOpen ? item.nome : undefined}
              >
                <motion.div 
                  whileHover={!isSidebarOpen ? { scale: 1.25, rotate: 2 } : {}} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  style={{ flexShrink: 0, display: 'flex' }}
                >
                  {item.icone}
                </motion.div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ whiteSpace: 'nowrap', fontSize: '14px' }}
                    >
                      {item.nome}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* Rodapé do Sidebar com identificação profissional e botão de bloqueio */}
        <div style={{ padding: isSidebarOpen ? '14px 16px' : '14px 0', borderTop: '1px solid var(--sidebar-hover)', background: 'var(--sidebar-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', flexDirection: isSidebarOpen ? 'row' : 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                title={!isSidebarOpen ? config?.nomeProfissional || 'Dr(a). Terapeuta' : undefined}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--sidebar-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                  flexShrink: 0
                }}
              >
                <UserCircle2 size={20} />
              </div>
              
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--bg-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {config?.nomeProfissional || 'Dr(a). Terapeuta'}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CRP {config?.crp || '06/123456'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLock}
              className="btn btn-icon-only"
              style={{ color: 'var(--text-muted)', padding: '6px' }}
              title="Bloquear tela (Proteção de Sigilo)"
            >
              <Lock size={18} />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', background: 'var(--bg-main)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function App() {
  const [isLocked, setIsLocked] = useState(false)
  const timerRef = useRef<any>(null)

  // Inactivity Security Timer
  useEffect(() => {
    let timeoutMs = 15 * 60 * 1000 // 15 min default

    window.api.config.obter().then((c: any) => {
      if (c && c.tempoInatividadeMin) {
        timeoutMs = c.tempoInatividadeMin * 60 * 1000
      }
    })

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsLocked(true)
      }, timeoutMs)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((ev) => window.addEventListener(ev, resetTimer))
    resetTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((ev) => window.removeEventListener(ev, resetTimer))
    }
  }, [isLocked])

  if (isLocked) {
    return <AuthLockScreen onUnlockSuccess={() => setIsLocked(false)} />
  }

  return (
    <HashRouter>
      <Layout onLock={() => setIsLocked(true)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<TelaPacientes />} />
          <Route path="/sessoes" element={<TelaSessoesMain />} />
          <Route path="/agenda" element={<AgendaLifecycleModule />} />
          <Route path="/avaliacoes" element={<AvaliacoesModule />} />
          <Route path="/diagnosticos" element={<DiagnosticosModule />} />
          <Route path="/ia-assistente" element={<AssistenteIAModule />} />
          <Route path="/relatorios" element={<RelatoriosModule />} />
          <Route path="/backup" element={<BackupAuditoriaModule />} />
          <Route
            path="/configuracoes"
            element={<ConfiguracoesModule onLockNow={() => setIsLocked(true)} />}
          />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
