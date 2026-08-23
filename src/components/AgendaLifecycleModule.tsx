import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  Clock,
  UserCheck,
  Play,
  CheckCircle,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Check
} from 'lucide-react'
import { Consulta, Paciente } from '../types'

export const AgendaLifecycleModule: React.FC = () => {
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [novoModalAberto, setNovoModalAberto] = useState(false)
  const [modalDetalheConsulta, setModalDetalheConsulta] = useState<Consulta | null>(null)
  const [slotDataHora, setSlotDataHora] = useState('')
  const [selectedPacienteId, setSelectedPacienteId] = useState('')
  const [consultaResumo, setConsultaResumo] = useState('')
  const [consultaObs, setConsultaObs] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const carregarDados = async () => {
    const c = await (window as any).api.consultas.listar()
    setConsultas(c)
    const p = await (window as any).api.pacientes.listar()
    setPacientes(p)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Helper de cálculo de datas de Segunda a Sexta
  const hoje = new Date()
  const diaSemanaHoje = hoje.getDay()
  const diffSegunda = diaSemanaHoje === 0 ? -6 : 1 - diaSemanaHoje

  const segundaFeira = new Date(hoje)
  segundaFeira.setDate(hoje.getDate() + diffSegunda + semanaOffset * 7)
  segundaFeira.setHours(0, 0, 0, 0)

  const diasDaSemana = [0, 1, 2, 3, 4].map((offset) => {
    const data = new Date(segundaFeira)
    data.setDate(segundaFeira.getDate() + offset)
    return data
  })

  const nomesDias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira']

  const isMesmoDia = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const consultasPorDia = diasDaSemana.map((dia) => {
    return consultas
      .filter((c) => {
        const dataCon = new Date(c.horarioAgendado || c.data)
        return isMesmoDia(dataCon, dia)
      })
      .sort((a, b) => new Date(a.horarioAgendado).getTime() - new Date(b.horarioAgendado).getTime())
  })

  const totalSemana = consultasPorDia.reduce((acc, curr) => acc + curr.length, 0)

  const formatarIntervaloSemana = () => {
    const seg = diasDaSemana[0]
    const sex = diasDaSemana[4]
    return `${seg.getDate()} de ${seg.toLocaleDateString('pt-BR', { month: 'short' })} a ${sex.getDate()} de ${sex.toLocaleDateString('pt-BR', { month: 'short' })}, ${sex.getFullYear()}`
  }

  const getNomePaciente = (id: string) => {
    const p = pacientes.find((item) => item.id === id)
    return p ? p.nome : 'Paciente'
  }

  // AÇÕES DO CICLO DE VIDA
  const handleRegistrarChegada = async (c: Consulta, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    await (window as any).api.consultas.registrarChegada(c.id)
    await carregarDados()
    mostrarToast(`Chegada de ${getNomePaciente(c.pacienteId)} registrada na sala de espera.`)
    if (modalDetalheConsulta?.id === c.id) setModalDetalheConsulta(null)
  }

  const handleIniciarAtendimento = async (c: Consulta, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    await (window as any).api.consultas.iniciarAtendimento(c.id)
    await carregarDados()
    mostrarToast(`Atendimento com ${getNomePaciente(c.pacienteId)} iniciado.`)
    if (modalDetalheConsulta?.id === c.id) setModalDetalheConsulta(null)
  }

  const handleFinalizarAtendimento = async (c: Consulta, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const res = await (window as any).api.consultas.finalizarAtendimento(c.id)
    await carregarDados()
    mostrarToast(`Atendimento finalizado com sucesso! Duração: ${res.consulta.duracaoMinutos} min. Registrado no prontuário.`)
    if (modalDetalheConsulta?.id === c.id) setModalDetalheConsulta(null)
  }

  const handleMarcarAusencia = async (c: Consulta, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (confirm(`Confirmar registro de ausência para ${getNomePaciente(c.pacienteId)}?`)) {
      await (window as any).api.consultas.marcarAusencia(c.id)
      await carregarDados()
      mostrarToast(`Ausência registrada.`)
      if (modalDetalheConsulta?.id === c.id) setModalDetalheConsulta(null)
    }
  }

  const handleExcluirConsulta = async (id: string) => {
    if (confirm('Deseja realmente remover este agendamento?')) {
      await (window as any).api.consultas.excluir(id)
      await carregarDados()
      setModalDetalheConsulta(null)
      mostrarToast('Consulta removida da agenda.')
    }
  }

  const abrirModalNovoAgendamento = (dataDefault?: Date, horaDefault = '09:00') => {
    const base = dataDefault ? new Date(dataDefault) : new Date()
    const [h, m] = horaDefault.split(':').map(Number)
    base.setHours(h, m, 0, 0)
    const tzOffset = base.getTimezoneOffset() * 60000
    const localISOTime = new Date(base.getTime() - tzOffset).toISOString().slice(0, 16)
    
    setSlotDataHora(localISOTime)
    setSelectedPacienteId(pacientes[0]?.id || '')
    setConsultaResumo('Sessão de Psicoterapia')
    setConsultaObs('')
    setNovoModalAberto(true)
  }

  const salvarNovaConsulta = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPacienteId) return
    await (window as any).api.consultas.criar({
      pacienteId: selectedPacienteId,
      horarioAgendado: new Date(slotDataHora).toISOString(),
      data: slotDataHora.slice(0, 10),
      resumo: consultaResumo || 'Sessão de Psicoterapia',
      observacoes: consultaObs
    })
    setNovoModalAberto(false)
    await carregarDados()
    mostrarToast('Novo atendimento agendado com sucesso!')
  }

  const renderBadgeStatus = (status: Consulta['status']) => {
    switch (status) {
      case 'aguardando':
        return <span className="badge badge-yellow">Aguardando na Sala</span>
      case 'em_atendimento':
        return <span className="badge badge-purple">Em Atendimento</span>
      case 'concluido':
        return <span className="badge badge-green">Concluído</span>
      case 'ausencia':
        return <span className="badge badge-gray">Ausente</span>
      case 'cancelado':
        return <span className="badge badge-red">Cancelado</span>
      default:
        return <span className="badge badge-blue">Agendado</span>
    }
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
            zIndex: 9999,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
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
          <h1 className="title">Agenda & Ciclo de Consultas</h1>
          <p className="subtitle">
            Acompanhe o fluxo em tempo real: Agendamento ➜ Chegada na recepção ➜ Início ➜ Conclusão com duração exata
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
            <button
              onClick={() => setSemanaOffset(0)}
              style={{
                background: semanaOffset === 0 ? '#eff6ff' : 'transparent',
                color: semanaOffset === 0 ? '#2563eb' : '#334155',
                border: 'none',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Hoje
            </button>
            <button
              onClick={() => setSemanaOffset((prev) => prev + 1)}
              className="btn btn-icon-only"
              title="Próxima semana"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button onClick={() => abrirModalNovoAgendamento()} className="btn btn-accent">
            <Plus size={18} /> Agendar Consulta
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
            {formatarIntervaloSemana()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-blue">
            {totalSemana} {totalSemana === 1 ? 'consulta na semana' : 'consultas na semana'}
          </span>
        </div>
      </div>

      {/* Grid de 5 colunas */}
      <div className="agenda-grid">
        {diasDaSemana.map((dia, idx) => {
          const eHoje = isMesmoDia(dia, hoje)
          const consDia = consultasPorDia[idx]

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
                {consDia.length === 0 ? (
                  <div className="agenda-empty-day">
                    <Clock size={20} style={{ opacity: 0.3 }} />
                    <span>Nenhum atendimento</span>
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
                  consDia.map((c) => {
                    const horaFormatada = new Date(c.horarioAgendado).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    const nomePac = getNomePaciente(c.pacienteId)

                    return (
                      <div
                        key={c.id}
                        className="agenda-event-card"
                        onClick={() => setModalDetalheConsulta(c)}
                        style={{
                          borderLeftColor:
                            c.status === 'em_atendimento'
                              ? '#9333ea'
                              : c.status === 'aguardando'
                              ? '#f59e0b'
                              : c.status === 'concluido'
                              ? '#10b981'
                              : '#2563eb'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div className="agenda-event-time">
                            <Clock size={12} />
                            <span>{horaFormatada}</span>
                          </div>
                          {renderBadgeStatus(c.status)}
                        </div>

                        <div className="agenda-event-patient">{nomePac}</div>
                        <div className="agenda-event-desc">{c.resumo || 'Sessão clínica'}</div>

                        {/* Ciclo de vida: botões rápidos */}
                        <div
                          style={{
                            marginTop: '8px',
                            paddingTop: '6px',
                            borderTop: '1px dashed #e2e8f0',
                            display: 'flex',
                            gap: '4px',
                            flexWrap: 'wrap'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.status === 'agendado' && (
                            <button
                              onClick={(e) => handleRegistrarChegada(c, e)}
                              className="btn btn-secondary"
                              style={{ padding: '3px 8px', fontSize: '11px' }}
                              title="Registrar chegada do paciente"
                            >
                              <UserCheck size={12} color="#d97706" /> Chegou
                            </button>
                          )}

                          {(c.status === 'agendado' || c.status === 'aguardando') && (
                            <button
                              onClick={(e) => handleIniciarAtendimento(c, e)}
                              className="btn btn-primary"
                              style={{ padding: '3px 8px', fontSize: '11px', background: '#9333ea', borderColor: '#9333ea' }}
                              title="Iniciar sessão agora"
                            >
                              <Play size={12} /> Iniciar
                            </button>
                          )}

                          {c.status === 'em_atendimento' && (
                            <button
                              onClick={(e) => handleFinalizarAtendimento(c, e)}
                              className="btn btn-primary"
                              style={{ padding: '3px 8px', fontSize: '11px', background: '#059669', borderColor: '#059669' }}
                              title="Finalizar e calcular duração"
                            >
                              <CheckCircle size={12} /> Finalizar
                            </button>
                          )}

                          {c.status === 'concluido' && c.duracaoMinutos && (
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                              ✓ {c.duracaoMinutos} min
                            </span>
                          )}
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

      {/* MODAL DETALHE DA CONSULTA / CICLO DE VIDA COMPLETO */}
      {modalDetalheConsulta && (
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
          <div className="card page-enter" style={{ width: '100%', maxWidth: '560px', padding: '24px' }}>
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
                  Ficha do Atendimento
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Paciente: <strong>{getNomePaciente(modalDetalheConsulta.pacienteId)}</strong>
                </p>
              </div>
              <button onClick={() => setModalDetalheConsulta(null)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            {/* Ciclo de vida linha do tempo */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '18px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '10px', textTransform: 'uppercase' }}>
                Ciclo de Atendimento Clínico:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Agendado:</span>{' '}
                  <strong>{new Date(modalDetalheConsulta.horarioAgendado).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Chegada na Recepção:</span>{' '}
                  <strong>
                    {modalDetalheConsulta.horarioChegada
                      ? new Date(modalDetalheConsulta.horarioChegada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Início da Sessão:</span>{' '}
                  <strong>
                    {modalDetalheConsulta.horarioInicio
                      ? new Date(modalDetalheConsulta.horarioInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Término:</span>{' '}
                  <strong>
                    {modalDetalheConsulta.horarioTermino
                      ? new Date(modalDetalheConsulta.horarioTermino).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </strong>
                </div>
              </div>

              {modalDetalheConsulta.duracaoMinutos && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '13px',
                    color: '#059669',
                    fontWeight: 600
                  }}
                >
                  ✓ Duração calculada: {modalDetalheConsulta.duracaoMinutos} minutos
                </div>
              )}
            </div>

            {/* Ações de Estado */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {modalDetalheConsulta.status === 'agendado' && (
                <button
                  onClick={() => handleRegistrarChegada(modalDetalheConsulta)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <UserCheck size={16} color="#d97706" /> Confirmar Chegada
                </button>
              )}

              {(modalDetalheConsulta.status === 'agendado' || modalDetalheConsulta.status === 'aguardando') && (
                <button
                  onClick={() => handleIniciarAtendimento(modalDetalheConsulta)}
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#9333ea', borderColor: '#9333ea' }}
                >
                  <Play size={16} /> Iniciar Sessão
                </button>
              )}

              {modalDetalheConsulta.status === 'em_atendimento' && (
                <button
                  onClick={() => handleFinalizarAtendimento(modalDetalheConsulta)}
                  className="btn btn-primary"
                  style={{ flex: 1, background: '#059669', borderColor: '#059669' }}
                >
                  <CheckCircle size={16} /> Finalizar Sessão
                </button>
              )}

              {modalDetalheConsulta.status !== 'concluido' && (
                <button
                  onClick={() => handleMarcarAusencia(modalDetalheConsulta)}
                  className="btn btn-secondary"
                  style={{ color: '#b91c1c' }}
                >
                  <XCircle size={16} /> Ausência
                </button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => handleExcluirConsulta(modalDetalheConsulta.id)}
                className="btn btn-danger-outline"
              >
                Cancelar/Excluir Agendamento
              </button>
              <button type="button" onClick={() => setModalDetalheConsulta(null)} className="btn btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO AGENDAMENTO */}
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
                Agendar Nova Consulta
              </h2>
              <button onClick={() => setNovoModalAberto(false)} className="btn btn-icon-only">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={salvarNovaConsulta}>
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
                  <label>Data e Horário *</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={slotDataHora}
                    onChange={(e) => setSlotDataHora(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Finalidade / Resumo</label>
                  <input
                    type="text"
                    className="input"
                    value={consultaResumo}
                    onChange={(e) => setConsultaResumo(e.target.value)}
                    placeholder="Ex: Sessão quinzenal de TCC"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Observações Administrativas (Opcional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={consultaObs}
                    onChange={(e) => setConsultaObs(e.target.value)}
                    placeholder="Ex: Paciente virá direto do trabalho."
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
    </div>
  )
}
