import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  BookOpen,
  Send,
  Lock,
  Check,
  HelpCircle,
  XCircle,
  FileCheck,
  MessageSquare
} from 'lucide-react'
import { AnaliseIA, Paciente, Sessao, StatusRevisaoIA } from '../types'
import { anonimizarTextoClinico } from '../services/api'

export const AssistenteIAModule: React.FC = () => {
  const [analises, setAnalises] = useState<AnaliseIA[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [selectedPacienteId, setSelectedPacienteId] = useState('')
  const [tipoAnalise, setTipoAnalise] = useState<AnaliseIA['tipoAnalise']>('criterios_diagnosticos')
  const [textoEntrada, setTextoEntrada] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [consentModalAberto, setConsentModalAberto] = useState(false)
  const [analiseSelecionada, setAnaliseSelecionada] = useState<AnaliseIA | null>(null)
  const [obsRevisao, setObsRevisao] = useState('')
  const [activeTab, setActiveTab] = useState<'analise' | 'chat'>('chat') // Defaulting to chat tab
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [statusIA, setStatusIA] = useState<{ provedor: string; configurada: boolean; modo: string }>({
    provedor: 'OpenAI (GPT-4o / GPT-4o-mini)',
    configurada: false,
    modo: 'Modo Local'
  })

  const carregarDados = async () => {
    const a = await (window as any).api.ia.listarAnalises()
    setAnalises(a)
    const p = await (window as any).api.pacientes.listar()
    setPacientes(p)
    const s = await (window as any).api.sessoes.todas()
    setSessoes(s)
    if (p.length > 0 && !selectedPacienteId) setSelectedPacienteId(p[0].id)
    
    if ((window as any).api.ia.verificarStatus) {
      const st = await (window as any).api.ia.verificarStatus()
      if (st) setStatusIA(st)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const mostrarToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  const pacienteAtual = pacientes.find((p) => p.id === selectedPacienteId)

  const preencherComHistoricoSessoes = () => {
    if (!pacienteAtual) return
    const sessoesPac = sessoes.filter((s) => s.pacienteId === pacienteAtual.id)
    const resumoText = sessoesPac.map((s) => `• [${new Date(s.dataSessao).toLocaleDateString('pt-BR')}]: ${s.resumo}\nAnotações: ${s.anotacoes}`).join('\n\n')
    const queixaBase = `Queixa Inicial: ${pacienteAtual.queixa || 'Não informada'}\nHistórico: ${pacienteAtual.historico || 'Sem histórico'}\n\nEvolução das Sessões:\n${resumoText}`
    setTextoEntrada(queixaBase)
  }

  const handleIniciarProcessoIA = async () => {
    if (!textoEntrada.trim()) {
      mostrarToast('Insira as observações ou contexto clínico para análise.')
      return
    }

    setCarregando(true)
    try {
      const textoAnonimizado = anonimizarTextoClinico(textoEntrada, pacienteAtual);
      const novaAnalise = await (window as any).api.ia.solicitarAnalise(
        selectedPacienteId,
        tipoAnalise,
        textoAnonimizado
      )
      
      await carregarDados()
      setAnaliseSelecionada(novaAnalise)
      mostrarToast('Análise clínica gerada pela IA e pronta para sua revisão profissional.')
    } catch (e) {
      mostrarToast('Falha na comunicação com o assistente.')
    } finally {
      setCarregando(false)
    }
  }

  const handleConfirmarEnvioAnonimizado = async (textoAnonimizado: string) => {
    setConsentModalAberto(false)
    setCarregando(true)
    try {
      const novaAnalise = await (window as any).api.ia.solicitarAnalise(
        selectedPacienteId,
        tipoAnalise,
        textoAnonimizado
      )
      await carregarDados()
      setAnaliseSelecionada(novaAnalise)
      mostrarToast('Análise clínica gerada pela IA e pronta para sua revisão profissional.')
    } catch (e) {
      mostrarToast('Falha na comunicação com o assistente.')
    } finally {
      setCarregando(false)
    }
  }

  const handleAtualizarRevisao = async (status: StatusRevisaoIA) => {
    if (!analiseSelecionada) return
    const atualizada = await (window as any).api.ia.atualizarStatusRevisao(
      analiseSelecionada.id,
      status,
      obsRevisao || undefined
    )
    if (atualizada) {
      setAnaliseSelecionada(atualizada)
      await carregarDados()
      mostrarToast(`Status de revisão alterado para: "${status.toUpperCase()}".`)
    }
  }

  const getNomePaciente = (id: string) => {
    const p = pacientes.find((item) => item.id === id)
    return p ? p.nome : 'Paciente'
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const newMsg = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const resp = await (window as any).api.ia.conversar(updatedMessages);
      if (resp && resp.success && resp.message) {
        setChatMessages([...updatedMessages, resp.message]);
      } else {
        mostrarToast('Erro ao receber resposta do assistente.');
      }
    } catch (e) {
      mostrarToast('Falha na comunicação com o assistente.');
    } finally {
      setChatLoading(false);
    }
  }

  const handleKeyDownChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendChat();
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
          <h1 className="title">Assistente de Raciocínio Clínico (IA Ética)</h1>
          <p className="subtitle">
            Ferramenta auxiliar com anonimização prévia, análise de critérios diagnósticos e aprovação soberana do psicólogo
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${statusIA.configurada ? 'badge-blue' : 'badge-purple'}`} title={statusIA.modo}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {statusIA.configurada ? 'OpenAI GPT-4o Conectada' : 'OpenAI Integrada (Fallback Local Ativo)'}
          </span>
          <span className="badge badge-green">
            <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
            LGPD & Sigilo Ativos
          </span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'chat' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'chat' ? '2px solid #2563eb' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Chat Clínico (Discussão)
        </button>
        <button
          onClick={() => setActiveTab('analise')}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'analise' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'analise' ? '2px solid #2563eb' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Análise Estruturada & Critérios
        </button>
      </div>

      {activeTab === 'chat' ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Chat History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
            {chatMessages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
                <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#334155' }}>Como posso ajudar?</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>Tire dúvidas sobre abordagens, peça ideias de intervenção ou discuta casos clínicos de forma segura.</p>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: msg.role === 'user' ? '#2563eb' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: msg.role === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b' }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', animation: 'pulse 2s infinite' }} />
                  Pensando...
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="input"
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px' }}
                placeholder="Digite sua dúvida clínica ou peça orientações..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleKeyDownChat}
                disabled={chatLoading}
              />
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0 20px', borderRadius: '24px' }}
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', gap: '24px' }}>
        {/* Layout Duas Colunas: Solicitação / Histórico e Detalhes */}
        
        {/* Coluna 1: Solicitar Nova Análise & Histórico */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={20} color="#2563eb" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Nova Solicitação de Análise
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Paciente em Atendimento *</label>
                <select
                  className="input"
                  value={selectedPacienteId}
                  onChange={(e) => setSelectedPacienteId(e.target.value)}
                >
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Tipo de Auxílio Clínico *</label>
                <select
                  className="input"
                  value={tipoAnalise}
                  onChange={(e) => setTipoAnalise(e.target.value as any)}
                >
                  <option value="criterios_diagnosticos">Critérios & Hipóteses Diferenciais (DSM-5 / CID-11)</option>
                  <option value="resumo_clinico">Síntese e Resumo da Evolução Terapêutica</option>
                  <option value="organizacao_anotacoes">Organização e Estruturação de Anotações Brutas</option>
                  <option value="rascunho_relatorio">Rascunho Preliminar de Relatório Psicológico</option>
                </select>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ margin: 0 }}>Contexto ou Anotações:</label>
                  <button
                    type="button"
                    onClick={preencherComHistoricoSessoes}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    + Puxar histórico do prontuário
                  </button>
                </div>
                <textarea
                  className="input"
                  rows={6}
                  value={textoEntrada}
                  onChange={(e) => setTextoEntrada(e.target.value)}
                  placeholder="Insira as queixas, sintomas, relatos da sessão ou anotações a serem analisadas..."
                />
              </div>

              <button
                type="button"
                onClick={handleIniciarProcessoIA}
                className="btn btn-primary"
                disabled={carregando}
                style={{ justifyContent: 'center', padding: '12px' }}
              >
                <Sparkles size={16} /> {carregando ? 'Processando...' : 'Revisar Anonimização & Analisar'}
              </button>
            </div>
          </div>

          {/* Histórico de Análises Realizadas */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 12px 0', color: '#334155' }}>
              Histórico de Análises & Status de Revisão:
            </h3>

            {analises.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                Nenhuma análise gerada até o momento.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                {analises.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setAnaliseSelecionada(a)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: analiseSelecionada?.id === a.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      background: analiseSelecionada?.id === a.id ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                        {getNomePaciente(a.pacienteId)}
                      </span>
                      <span
                        className={`badge ${
                          a.statusRevisao === 'aprovado'
                            ? 'badge-green'
                            : a.statusRevisao === 'revisado'
                            ? 'badge-blue'
                            : 'badge-yellow'
                        }`}
                        style={{ fontSize: '10px', padding: '2px 6px' }}
                      >
                        {a.statusRevisao === 'aprovado'
                          ? 'Aprovado'
                          : a.statusRevisao === 'revisado'
                          ? 'Revisado'
                          : 'Aguardando Revisão'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {a.resultado.condicao || a.tipoAnalise} • {new Date(a.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna 2: Visualizador Estruturado da Análise Clínica */}
        <div className="card" style={{ padding: '28px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!analiseSelecionada ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                color: '#94a3b8',
                textAlign: 'center',
                padding: '40px'
              }}
            >
              <FileSearch size={48} style={{ opacity: 0.3, marginBottom: '14px' }} />
              <h3 style={{ fontSize: '16px', color: '#334155', margin: '0 0 6px' }}>
                Nenhuma Análise Selecionada
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '380px', margin: 0 }}>
                Solicite uma nova análise à esquerda ou selecione um item do histórico para revisar critérios e hipóteses diferenciais.
              </p>
            </div>
          ) : (
            <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Header da Análise */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '16px',
                  marginBottom: '20px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-blue">{analiseSelecionada.referenciaUtilizada || 'DSM-5-TR / CID-11'}</span>
                    <span className="badge badge-purple">{analiseSelecionada.tipoAnalise}</span>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0', color: '#0f172a' }}>
                    {analiseSelecionada.resultado.condicao || 'Análise de Critérios Clínicos'}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Paciente: <strong>{getNomePaciente(analiseSelecionada.pacienteId)}</strong> • Gerado em:{' '}
                    {new Date(analiseSelecionada.data).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`badge ${
                      analiseSelecionada.statusRevisao === 'aprovado'
                        ? 'badge-green'
                        : analiseSelecionada.statusRevisao === 'revisado'
                        ? 'badge-blue'
                        : 'badge-yellow'
                    }`}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    Status: {analiseSelecionada.statusRevisao.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Raciocínio por Critérios Clínicos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
                
                {/* 1. Critérios Potencialmente Presentes */}
                {analiseSelecionada.resultado.criteriosPresentes && analiseSelecionada.resultado.criteriosPresentes.length > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                      <CheckCircle2 size={16} /> Critérios Potencialmente Presentes (Identificados nas Informações):
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analiseSelecionada.resultado.criteriosPresentes.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Critérios Não Identificados */}
                {analiseSelecionada.resultado.criteriosNaoIdentificados && analiseSelecionada.resultado.criteriosNaoIdentificados.length > 0 && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                      <XCircle size={16} color="#64748b" /> Critérios Não Identificados nos Relatos Atuais:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analiseSelecionada.resultado.criteriosNaoIdentificados.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Informações Insuficientes */}
                {analiseSelecionada.resultado.informacoesInsuficientes && analiseSelecionada.resultado.informacoesInsuficientes.length > 0 && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#92400e', marginBottom: '8px' }}>
                      <HelpCircle size={16} /> Informações Insuficientes / Necessidade de Aprofundamento Clínico:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analiseSelecionada.resultado.informacoesInsuficientes.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 4. Hipóteses Diferenciais */}
                {analiseSelecionada.resultado.hipotesesDiferenciais && analiseSelecionada.resultado.hipotesesDiferenciais.length > 0 && (
                  <div style={{ background: '#faf5ff', border: '1px solid #f3e8ff', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#6b21a8', marginBottom: '8px' }}>
                      <BookOpen size={16} /> Hipóteses Diagnósticas Diferenciais a Considerar:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#581c87', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analiseSelecionada.resultado.hipotesesDiferenciais.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 5. Considerações Gerais */}
                {analiseSelecionada.resultado.consideracoes && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Parecer Clínico Preliminar da IA:
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', lineHeight: '1.5', fontStyle: 'italic' }}>
                      "{analiseSelecionada.resultado.consideracoes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Barra de Governança e Aprovação Soberana pelo Profissional */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={14} color="#64748b" />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Decisão Soberana do Psicólogo (CFP):
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {analiseSelecionada.statusRevisao !== 'revisado' && (
                    <button
                      type="button"
                      onClick={() => handleAtualizarRevisao('revisado')}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Check size={14} /> Marcar como Revisado
                    </button>
                  )}

                  {analiseSelecionada.statusRevisao !== 'aprovado' && (
                    <button
                      type="button"
                      onClick={() => handleAtualizarRevisao('aprovado')}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      <FileCheck size={14} /> Aprovar Raciocínio Clínico
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
      )}
    </div>
  )
}
