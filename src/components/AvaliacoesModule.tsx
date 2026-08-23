import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  FileText,
  Search,
  Trash2,
  X,
  Save,
  Check
} from 'lucide-react'
import { Avaliacao, Paciente } from '../types'

const MODELOS_AVALIACOES = [
  {
    tipo: 'Inventário de Ansiedade (GAD-7)',
    instrumento: 'Escala de Ansiedade Generalizada de 7 Itens (Spitzer et al., 2006)',
    referencia: 'GAD-7 (Critérios DSM/CID)'
  },
  {
    tipo: 'Inventário de Depressão (BDI-II / PHQ-9)',
    instrumento: 'Patient Health Questionnaire - 9 (Kroenke et al., 2001)',
    referencia: 'PHQ-9 Inventário Psicométrico'
  },
  {
    tipo: 'Anamnese Psicológica Estruturada',
    instrumento: 'Roteiro de Entrevista Clínica Inicial e História de Vida',
    referencia: 'Protocolo Clínico Padrão de Anamnese'
  },
  {
    tipo: 'Avaliação de Hábitos e Sono',
    instrumento: 'Índice de Qualidade do Sono de Pittsburgh (PSQI)',
    referencia: 'PSQI Sleep Quality Index'
  }
]

export const AvaliacoesModule: React.FC = () => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [modalNovo, setModalNovo] = useState(false)
  const [busca, setBusca] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  // Form
  const [pacienteId, setPacienteId] = useState('')
  const [tipo, setTipo] = useState(MODELOS_AVALIACOES[0].tipo)
  const [instrumento, setInstrumento] = useState(MODELOS_AVALIACOES[0].instrumento)
  const [referenciasUtilizadas, setReferenciasUtilizadas] = useState(MODELOS_AVALIACOES[0].referencia)
  const [observacoes, setObservacoes] = useState('')
  const [resultados, setResultados] = useState('')

  const carregarDados = async () => {
    const a = await (window as any).api.avaliacoes.listar()
    setAvaliacoes(a)
    const p = await (window as any).api.pacientes.listar()
    setPacientes(p)
    if (p.length > 0 && !pacienteId) setPacienteId(p[0].id)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const handleSelecionarModelo = (m: typeof MODELOS_AVALIACOES[0]) => {
    setTipo(m.tipo)
    setInstrumento(m.instrumento)
    setReferenciasUtilizadas(m.referencia)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteId || !tipo) return

    await (window as any).api.avaliacoes.criar({
      pacienteId,
      data: new Date().toISOString(),
      tipo,
      instrumento,
      observacoes,
      resultados,
      referenciasUtilizadas
    })

    setModalNovo(false)
    setObservacoes('')
    setResultados('')
    await carregarDados()
    mostrarToast('Avaliação psicológica registrada com sucesso!')
  }

  const handleExcluir = async (id: string) => {
    if (confirm('Deseja excluir esta avaliação psicológica do prontuário?')) {
      await (window as any).api.avaliacoes.excluir(id)
      await carregarDados()
      mostrarToast('Avaliação removida.')
    }
  }

  const getNomePaciente = (id: string) => {
    const p = pacientes.find((item) => item.id === id)
    return p ? p.nome : 'Paciente'
  }

  const filtradas = avaliacoes.filter((a) => {
    const nome = getNomePaciente(a.pacienteId).toLowerCase()
    const t = a.tipo.toLowerCase()
    const termo = busca.toLowerCase()
    return nome.includes(termo) || t.includes(termo)
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
          <h1 className="title">Avaliações & Instrumentos Psicológicos</h1>
          <p className="subtitle">
            Aplicação e registro de inventários, escalas clínicas psicométricas e anamneses
          </p>
        </div>

        <button onClick={() => setModalNovo(true)} className="btn btn-accent">
          <Plus size={18} /> Nova Avaliação
        </button>
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={18}
          color="#94a3b8"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          className="input"
          style={{ paddingLeft: '38px' }}
          placeholder="Pesquisar avaliação ou nome do paciente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
          <ClipboardList size={36} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 6px' }}>Nenhuma avaliação cadastrada</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>
            Clique em "Nova Avaliação" para registrar testes psicométricos ou anamnese.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
          {filtradas.map((a) => (
            <div key={a.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '6px' }}>
                    {a.tipo}
                  </span>
                  <h3 style={{ margin: '4px 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {getNomePaciente(a.pacienteId)}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Data de Aplicação: {new Date(a.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <button
                  onClick={() => handleExcluir(a.id)}
                  className="btn btn-icon-only"
                  style={{ color: '#b91c1c' }}
                  title="Excluir avaliação"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {a.instrumento && (
                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                  <strong>Instrumento:</strong> {a.instrumento}
                </div>
              )}

              {a.resultados && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}
                >
                  <strong>Resultados / Escore:</strong> {a.resultados}
                </div>
              )}

              {a.observacoes && (
                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '8px' }}>
                  "{a.observacoes}"
                </div>
              )}

              {a.referenciasUtilizadas && (
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Ref: {a.referenciasUtilizadas}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL NOVA AVALIAÇÃO */}
      {modalNovo && (
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
          <div className="card page-enter" style={{ width: '100%', maxWidth: '600px', padding: '24px' }}>
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
                Registrar Avaliação Psicológica
              </h2>
              <button onClick={() => setModalNovo(false)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            {/* Modelos rápidos */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Instrumentos Clínicos Sugeridos:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {MODELOS_AVALIACOES.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelecionarModelo(m)}
                    style={{
                      fontSize: '11px',
                      background: tipo === m.tipo ? '#eff6ff' : '#f1f5f9',
                      border: tipo === m.tipo ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      color: tipo === m.tipo ? '#1d4ed8' : '#334155',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    {m.tipo.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSalvar}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label>Paciente *</label>
                  <select
                    className="input"
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
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
                  <label>Tipo / Nome da Avaliação *</label>
                  <input
                    type="text"
                    className="input"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Instrumento / Escala Utilizada</label>
                  <input
                    type="text"
                    className="input"
                    value={instrumento}
                    onChange={(e) => setInstrumento(e.target.value)}
                    placeholder="Ex: Escala GAD-7 ou Inventário de Depressão Beck"
                  />
                </div>

                <div className="input-group">
                  <label>Resultados / Escore Obtido *</label>
                  <input
                    type="text"
                    className="input"
                    value={resultados}
                    onChange={(e) => setResultados(e.target.value)}
                    placeholder="Ex: Escore 14 (Ansiedade Moderada)"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Observações Clínicas e Comportamentais</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Comportamento durante a aplicação, histórico relevante..."
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '16px'
                }}
              >
                <button type="button" onClick={() => setModalNovo(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
