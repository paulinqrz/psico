import React, { useState, useEffect } from 'react'
import {
  FileBadge2,
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Save,
  Check
} from 'lucide-react'
import { Diagnostico, Paciente } from '../types'

// BASE ESTRUTURADA DE REFERÊNCIAS DIAGNÓSTICAS OFICIAIS
const BASE_REFERENCIAS = [
  // CID-11
  { class: 'CID-11', cod: '6B00', desc: 'Transtorno de Ansiedade Generalizada (TAG)' },
  { class: 'CID-11', cod: '6B01', desc: 'Transtorno de Pânico' },
  { class: 'CID-11', cod: '6B03', desc: 'Fobia Social / Transtorno de Ansiedade Social' },
  { class: 'CID-11', cod: '6A70', desc: 'Episódio Depressivo Único' },
  { class: 'CID-11', cod: '6A71', desc: 'Transtorno Depressivo Recorrente' },
  { class: 'CID-11', cod: '6A72', desc: 'Transtorno Distímico' },
  { class: 'CID-11', cod: '6B40', desc: 'Transtorno de Estresse Pós-Traumático (TEPT)' },
  { class: 'CID-11', cod: '6B43', desc: 'Transtorno de Adaptação' },
  { class: 'CID-11', cod: '6B20', desc: 'Transtorno Obsessivo-Compulsivo (TOC)' },
  { class: 'CID-11', cod: '6A05', desc: 'Transtorno de Déficit de Atenção e Hiperatividade (TDAH)' },
  { class: 'CID-11', cod: '6A02', desc: 'Transtorno do Espectro do Autismo (TEA)' },
  { class: 'CID-11', cod: '6B60', desc: 'Dissociação / Transtornos Dissociativos' },
  // DSM-5-TR
  { class: 'DSM-5-TR', cod: '300.02', desc: 'Transtorno de Ansiedade Generalizada' },
  { class: 'DSM-5-TR', cod: '300.01', desc: 'Transtorno de Pânico' },
  { class: 'DSM-5-TR', cod: '300.23', desc: 'Transtorno de Ansiedade Social (Fobia Social)' },
  { class: 'DSM-5-TR', cod: '296.22', desc: 'Transtorno Depressivo Maior, Episódio Único, Moderado' },
  { class: 'DSM-5-TR', cod: '300.4', desc: 'Transtorno Depressivo Persistente (Distimia)' },
  { class: 'DSM-5-TR', cod: '309.81', desc: 'Transtorno de Estresse Pós-Traumático' },
  { class: 'DSM-5-TR', cod: '300.3', desc: 'Transtorno Obsessivo-Compulsivo' },
  { class: 'DSM-5-TR', cod: '314.01', desc: 'TDAH - Apresentação Combinada' }
]

export const DiagnosticosModule: React.FC = () => {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [modalNovo, setModalNovo] = useState(false)
  const [busca, setBusca] = useState('')
  const [filtroClass, setFiltroClass] = useState<string>('todos')
  
  // Form state
  const [pacienteId, setPacienteId] = useState('')
  const [classificacao, setClassificacao] = useState<'CID-11' | 'CID-10' | 'DSM-5-TR'>('CID-11')
  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState<Diagnostico['status']>('hipotese')
  const [observacoes, setObservacoes] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const carregarDados = async () => {
    const d = await (window as any).api.diagnosticos.listar()
    setDiagnosticos(d)
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

  const handleSelecionarReferenciaPronta = (ref: typeof BASE_REFERENCIAS[0]) => {
    setClassificacao(ref.class as any)
    setCodigo(ref.cod)
    setDescricao(ref.desc)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pacienteId || !codigo || !descricao) return

    await (window as any).api.diagnosticos.criar({
      pacienteId,
      classificacao,
      codigo,
      descricao,
      status,
      observacoes,
      data: new Date().toISOString()
    })

    setModalNovo(false)
    setCodigo('')
    setDescricao('')
    setObservacoes('')
    await carregarDados()
    mostrarToast('Diagnóstico clínico registrado no prontuário oficial!')
  }

  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este registro diagnóstico do prontuário?')) {
      await (window as any).api.diagnosticos.excluir(id)
      await carregarDados()
      mostrarToast('Registro diagnóstico removido.')
    }
  }

  const getNomePaciente = (id: string) => {
    const p = pacientes.find((item) => item.id === id)
    return p ? p.nome : 'Paciente'
  }

  const diagnosticosFiltrados = diagnosticos.filter((d) => {
    const nome = getNomePaciente(d.pacienteId).toLowerCase()
    const desc = (d.descricao || '').toLowerCase()
    const cod = (d.codigo || '').toLowerCase()
    const termo = busca.toLowerCase()
    const matchBusca = nome.includes(termo) || desc.includes(termo) || cod.includes(termo)
    const matchClass = filtroClass === 'todos' || d.classificacao === filtroClass
    return matchBusca && matchClass
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
          <h1 className="title">Diagnósticos & Referências Clínicas</h1>
          <p className="subtitle">
            Registro clínico oficial soberano do profissional baseado nas classificações CID-11, CID-10 e DSM-5-TR
          </p>
        </div>

        <button onClick={() => setModalNovo(true)} className="btn btn-accent">
          <Plus size={18} /> Registrar Diagnóstico
        </button>
      </div>

      {/* Alerta de Conformidade Ética CFP */}
      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <BookOpen size={22} color="#2563eb" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#1e40af', lineHeight: '1.4' }}>
          <strong>Normativa Profissional:</strong> Todo registro diagnóstico é ato privativo e de responsabilidade exclusiva do psicólogo.
          Hipóteses preliminares geradas por IA não são registradas como diagnóstico oficial até a avaliação e confirmação manual do profissional.
        </div>
      </div>

      {/* Filtros e Busca */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '38px' }}
            placeholder="Pesquisar por paciente, código ou diagnóstico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select
          className="input"
          style={{ width: 'auto' }}
          value={filtroClass}
          onChange={(e) => setFiltroClass(e.target.value)}
        >
          <option value="todos">Todas as Referências</option>
          <option value="CID-11">CID-11 (OMS)</option>
          <option value="CID-10">CID-10</option>
          <option value="DSM-5-TR">DSM-5-TR (APA)</option>
        </select>
      </div>

      {/* Lista de Diagnósticos Registrados */}
      {diagnosticosFiltrados.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#64748b'
          }}
        >
          <FileBadge2 size={36} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', color: '#0f172a', margin: '0 0 6px' }}>Nenhum diagnóstico registrado</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>
            Utilize o botão "Registrar Diagnóstico" para formalizar uma hipótese ou confirmação clínica.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {diagnosticosFiltrados.map((d) => (
            <div
              key={d.id}
              className="card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-blue">{d.classificacao}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    {d.codigo} — {d.descricao}
                  </span>
                  <span
                    className={`badge ${
                      d.status === 'confirmado'
                        ? 'badge-green'
                        : d.status === 'remissao'
                        ? 'badge-purple'
                        : 'badge-yellow'
                    }`}
                  >
                    {d.status === 'confirmado'
                      ? 'Confirmado'
                      : d.status === 'remissao'
                      ? 'Em Remissão'
                      : d.status === 'em_investigacao'
                      ? 'Em Investigação'
                      : 'Hipótese Diagnóstica'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  Paciente: <strong>{getNomePaciente(d.pacienteId)}</strong> • Data:{' '}
                  {new Date(d.data).toLocaleDateString('pt-BR')}
                </div>

                {d.observacoes && (
                  <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                    "{d.observacoes}"
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                  Responsável: {d.profissionalResponsavel} • CRP: {d.crp}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleExcluir(d.id)}
                  className="btn btn-icon-only"
                  style={{ color: '#b91c1c' }}
                  title="Excluir registro"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL REGISTRAR DIAGNÓSTICO */}
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
          <div className="card page-enter" style={{ width: '100%', maxWidth: '640px', padding: '24px' }}>
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
                Registrar Diagnóstico Clínico Oficial
              </h2>
              <button onClick={() => setModalNovo(false)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            {/* Sugestões Rápidas de Códigos */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Referências Rápidas Frequentes:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {BASE_REFERENCIAS.slice(0, 5).map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelecionarReferenciaPronta(r)}
                    style={{
                      fontSize: '11px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      color: '#334155'
                    }}
                  >
                    {r.class} {r.cod} ({r.desc.split(' ')[0]})
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label>Sistema de Classificação *</label>
                    <select
                      className="input"
                      value={classificacao}
                      onChange={(e) => setClassificacao(e.target.value as any)}
                    >
                      <option value="CID-11">CID-11 (OMS 2022)</option>
                      <option value="CID-10">CID-10</option>
                      <option value="DSM-5-TR">DSM-5-TR (APA 2022)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Código da Condição *</label>
                    <input
                      type="text"
                      className="input"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      placeholder="Ex: 6B00 ou 300.02"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Descrição do Transtorno / Condição *</label>
                  <input
                    type="text"
                    className="input"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Transtorno de Ansiedade Generalizada"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Status Clínico da Avaliação</label>
                  <select
                    className="input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="hipotese">Hipótese Diagnóstica Preliminar</option>
                    <option value="em_investigacao">Em Investigação / Aplicação de Instrumentos</option>
                    <option value="confirmado">Confirmado pelo Profissional</option>
                    <option value="remissao">Em Remissão Sintomática</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Observações Clínicas / Justificativa</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Critérios observados nas sessões e inventários clínicos aplicados..."
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
                  <Save size={16} /> Gravar no Prontuário Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
