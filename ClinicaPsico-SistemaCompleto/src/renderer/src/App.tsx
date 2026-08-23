import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, MessageSquare, Plus, ChevronRight, Save, X, ArrowLeft, Trash2, UserCircle2, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'

// --- TOAST NOTIFICATION COMPONENT ---
function Toast({ message, visible, onClose }: { message: string, visible: boolean, onClose: () => void }) {
  if (!visible) return null;
  return (
    <div className="toast-notification">
      <CheckCircle size={20} />
      <span>{message}</span>
      <button onClick={onClose}><X size={16} /></button>
    </div>
  )
}

function Dashboard() {
  const [total, setTotal] = useState(0)
  useEffect(() => {
    window.api.dashboard.resumo().then((dados: any) => setTotal(dados.totalPacientes))
  }, [])
  return (
    <div key="dashboard-page" className="page-enter" style={{ padding: '40px' }}>
      <h1 className="title">Dashboard Geral</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '30px' }}>
        <div className="card stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div><h3>Pacientes Ativos</h3><p className="stat-number">{total}</p></div>
        </div>
      </div>
    </div>
  )
}

function PerfilPaciente({ id, voltar }: { id: string, voltar: () => void }) {
  const [paciente, setPaciente] = useState<any>(null)
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [profissao, setProfissao] = useState('')
  const [queixa, setQueixa] = useState('')

  useEffect(() => {
    window.api.pacientes.obter(id).then(dados => {
      setPaciente(dados)
      setTelefone(dados.telefone || '')
      setEmail(dados.email || '')
      setCpf(dados.cpf || '')
      setEndereco(dados.endereco || '')
      setProfissao(dados.profissao || '')
      setQueixa(dados.queixa || '')
    })
  }, [id])

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2")
    setCpf(v)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3")
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,5})/, "($1) $2")
    setTelefone(v)
  }

  const salvarDetalhes = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.api.pacientes.atualizar(id, { telefone, email, cpf, endereco, profissao, queixa })
    const btn = document.getElementById('btn-salvar')
    if(btn) {
      btn.innerText = 'Salvo com sucesso!'
      btn.style.background = '#10b981'
      setTimeout(() => {
        btn.innerHTML = 'Salvar Alterações'
        btn.style.background = '#0f172a'
      }, 2000)
    }
  }

  if (!paciente) return <div style={{ padding: '40px' }}>Carregando...</div>
  const idade = Math.floor((new Date().getTime() - new Date(paciente.dataNascimento).getTime()) / 3.15576e+10)

  return (
    <div key={`perfil-${id}`} className="page-enter" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={voltar} className="btn btn-icon-only" title="Voltar"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="avatar-placeholder"><UserCircle2 size={36} /></div>
          <div>
            <h1 className="title" style={{ marginBottom: '4px', fontSize: '24px' }}>{paciente.nome}</h1>
            <p className="subtitle" style={{ margin: 0 }}>{new Date(paciente.dataNascimento).toLocaleDateString()} ({idade} anos)</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Ficha do Paciente</h2>
        <form onSubmit={salvarDetalhes}>
          <div className="form-grid">
            <div className="input-group">
              <label>Telefone</label>
              <div className="input-with-icon"><Phone size={16} /><input type="tel" className="input" value={telefone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" /></div>
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <div className="input-with-icon"><Mail size={16} /><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" /></div>
            </div>
            <div className="input-group">
              <label>CPF</label>
              <input type="text" className="input" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" />
            </div>
            <div className="input-group">
              <label>Profissão</label>
              <input type="text" className="input" value={profissao} onChange={e => setProfissao(e.target.value)} placeholder="Ex: Engenheiro" />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Endereço Completo</label>
              <div className="input-with-icon"><MapPin size={16} /><input type="text" className="input" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua, Número, Bairro, Cidade" /></div>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Queixa Principal / Motivo da Consulta</label>
              <textarea className="input" rows={4} value={queixa} onChange={e => setQueixa(e.target.value)} placeholder="Descreva brevemente a queixa inicial..." style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button id="btn-salvar" type="submit" className="btn btn-primary"><Save size={16} /> Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TelaPacientes() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [modoForm, setModoForm] = useState(false)
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const carregarPacientes = async () => {
    const dados = await window.api.pacientes.listar()
    setPacientes(dados)
  }

  useEffect(() => { carregarPacientes() }, [])

  const criarPacienteRapido = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.api.pacientes.criar({ nome, dataNascimento: new Date(dataNascimento).toISOString() })
    setModoForm(false)
    carregarPacientes()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 4000)
    // A tela volta para a lista (não abre o perfil imediatamente, conforme solicitado)
  }

  const excluir = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() 
    if (confirm('Tem certeza que deseja excluir este paciente permanentemente?')) {
      await window.api.pacientes.excluir(id)
      carregarPacientes()
    }
  }

  if (pacienteSelecionado) {
    return <PerfilPaciente key={`perfil-${pacienteSelecionado}`} id={pacienteSelecionado} voltar={() => { setPacienteSelecionado(null); carregarPacientes(); }} />
  }

  if (modoForm) {
    return (
      <div key="form-novo" className="page-enter" style={{ padding: '40px' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Adicionar Novo Paciente</h2>
            <button type="button" onClick={() => setModoForm(false)} className="btn btn-secondary"><X size={16} /> Cancelar</button>
          </div>
          <form onSubmit={criarPacienteRapido} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label>Nome Completo</label>
              <input type="text" className="input" value={nome} onChange={(e) => setNome(e.target.value)} required autoFocus pattern="^[A-Za-zÀ-ú\s]+$" title="Apenas letras e espaços" />
            </div>
            <div className="input-group">
              <label>Data de Nascimento</label>
              <input type="date" className="input" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>
              Salvar e Voltar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div key="lista-pacientes" className="page-enter" style={{ padding: '40px' }}>
      <Toast message="Usuário criado com sucesso!" visible={toastVisible} onClose={() => setToastVisible(false)} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="title">Meus Pacientes</h1>
          <p className="subtitle">Gerencie prontuários e dados cadastrais</p>
        </div>
        <button onClick={() => { setNome(''); setDataNascimento(''); setModoForm(true); }} className="btn btn-primary">
          <Plus size={18} /> Novo Paciente
        </button>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {pacientes.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <UserCircle2 size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <p>Nenhum paciente cadastrado ainda.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead><tr><th>Paciente</th><th>Idade</th><th>Data de Cadastro</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
              <tbody>
                {pacientes.map(p => {
                  const idade = Math.floor((new Date().getTime() - new Date(p.dataNascimento).getTime()) / 3.15576e+10)
                  return (
                    <tr key={p.id} onClick={() => setPacienteSelecionado(p.id)}>
                      <td style={{ fontWeight: 500 }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="avatar-mini">{p.nome.charAt(0).toUpperCase()}</div>{p.nome}</div></td>
                      <td style={{ color: '#64748b' }}>{idade} anos</td>
                      <td style={{ color: '#64748b' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-icon-only text-danger" onClick={(e) => excluir(e, p.id)} title="Excluir"><Trash2 size={18} /></button>
                        <button className="btn btn-icon-only" style={{ marginLeft: '5px' }} title="Abrir Ficha"><ChevronRight size={18} /></button>
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


// --- SESSÕES COMPONENTES ---

function DetalheSessoes({ pacienteId, voltar }: { pacienteId: string, voltar: () => void }) {
  const [paciente, setPaciente] = useState<any>(null)
  const [sessoes, setSessoes] = useState<any[]>([])
  const [modoNovo, setModoNovo] = useState(false)
  const [dataSessao, setDataSessao] = useState(new Date().toISOString().slice(0, 16))
  const [resumo, setResumo] = useState('')
  const [anotacoes, setAnotacoes] = useState('')

  const carregarDados = async () => {
    const p = await window.api.pacientes.obter(pacienteId)
    setPaciente(p)
    const s = await window.api.sessoes.listar(pacienteId)
    setSessoes(s)
  }

  useEffect(() => { carregarDados() }, [pacienteId])

  const salvarSessao = async (e: React.FormEvent) => {
    e.preventDefault()
    await window.api.sessoes.criar({ 
      pacienteId, 
      dataSessao: new Date(dataSessao).toISOString(),
      resumo, 
      anotacoes 
    })
    setModoNovo(false)
    carregarDados()
  }

  const excluirSessao = async (id: string) => {
    if (confirm('Excluir este registro de sessão?')) {
      await window.api.sessoes.excluir(id)
      carregarDados()
    }
  }

  if (!paciente) return <div style={{ padding: '40px' }}>Carregando...</div>

  return (
    <div key={`sessoes-${pacienteId}`} className="page-enter" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={voltar} className="btn btn-icon-only"><ArrowLeft size={20} /></button>
        <div style={{ flex: 1 }}>
          <h1 className="title" style={{ fontSize: '24px' }}>Sessões de {paciente.nome}</h1>
          <p className="subtitle">Acompanhamento e evolução clínica</p>
        </div>
        {!modoNovo && (
          <button onClick={() => { setResumo(''); setAnotacoes(''); setDataSessao(new Date().toISOString().slice(0, 16)); setModoNovo(true); }} className="btn btn-primary">
            <Plus size={18} /> Registrar Sessão
          </button>
        )}
      </div>

      {modoNovo && (
        <div className="card" style={{ marginBottom: '30px', borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Nova Sessão</h3>
          <form onSubmit={salvarSessao}>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: '1 / -1', maxWidth: '250px' }}>
                <label>Data e Hora</label>
                <input type="datetime-local" className="input" value={dataSessao} onChange={e => setDataSessao(e.target.value)} required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Resumo Breve (O que foi trabalhado?)</label>
                <input type="text" className="input" value={resumo} onChange={e => setResumo(e.target.value)} placeholder="Ex: Trabalhamos a ansiedade no ambiente de trabalho..." required />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Anotações Clínicas (Confidencial)</label>
                <textarea className="input" rows={6} value={anotacoes} onChange={e => setAnotacoes(e.target.value)} placeholder="Detalhes, observações, evolução..." style={{ resize: 'vertical' }}></textarea>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setModoNovo(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary"><Save size={16} /> Salvar Sessão</button>
            </div>
          </form>
        </div>
      )}

      {sessoes.length === 0 && !modoNovo ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <MessageSquare size={40} style={{ opacity: 0.5, marginBottom: '10px' }} />
          <p>Nenhuma sessão registrada para este paciente.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sessoes.map(s => (
            <div key={s.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' }}>
                <strong>{new Date(s.dataSessao).toLocaleString()}</strong>
                <button className="btn btn-icon-only text-danger" onClick={() => excluirSessao(s.id)} style={{ padding: 0 }}><Trash2 size={16} /></button>
              </div>
              {s.resumo && <p style={{ fontWeight: 600, marginTop: 0, marginBottom: '10px' }}>{s.resumo}</p>}
              {s.anotacoes && <p style={{ whiteSpace: 'pre-wrap', color: '#475569', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{s.anotacoes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TelaSessoesMain() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null)

  useEffect(() => {
    window.api.pacientes.listar().then(setPacientes)
  }, [])

  if (pacienteSelecionado) {
    return <DetalheSessoes pacienteId={pacienteSelecionado} voltar={() => setPacienteSelecionado(null)} />
  }

  return (
    <div key="lista-sessoes" className="page-enter" style={{ padding: '40px' }}>
      <h1 className="title">Prontuários e Sessões</h1>
      <p className="subtitle" style={{ marginBottom: '30px' }}>Selecione um paciente para adicionar ou ler suas sessões</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {pacientes.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nenhum paciente cadastrado para registrar sessões.</p>
        ) : (
          pacientes.map(p => (
            <div key={p.id} className="card session-card" onClick={() => setPacienteSelecionado(p.id)}>
              <div className="avatar-placeholder" style={{ marginBottom: '15px' }}><UserCircle2 size={32} /></div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#0f172a' }}>{p.nome}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Gerenciar evolução <ChevronRight size={14} />
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmConstrucao({ titulo }: { titulo: string }) {
  return (
    <div key={titulo} className="page-enter" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ background: '#f1f5f9', padding: '30px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>{titulo}</h2>
        <p style={{ color: '#64748b', lineHeight: '1.5' }}>Módulo em desenvolvimento.</p>
      </div>
    </div>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const menuItems = [
    { nome: 'Dashboard', icone: <LayoutDashboard size={20} />, rota: '/' },
    { nome: 'Pacientes', icone: <Users size={20} />, rota: '/pacientes' },
    { nome: 'Sessões', icone: <MessageSquare size={20} />, rota: '/sessoes' },
    { nome: 'Agenda', icone: <Calendar size={20} />, rota: '/agenda' },
  ]
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden' }}>
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="logo-icon">C</div><div><h2>Clínica Psico</h2><span>Software de Gestão</span></div></div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.nome} to={item.rota} className={`nav-link ${location.pathname === item.rota ? 'active' : ''}`}>{item.icone} <span>{item.nome}</span></Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<TelaPacientes />} />
          <Route path="/sessoes" element={<TelaSessoesMain />} />
          <Route path="/agenda" element={<EmConstrucao titulo="Agenda Clínica" />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
