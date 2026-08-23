import React, { useState, useEffect } from 'react'
import {
  FileText,
  Printer,
  Download,
  Check,
  User,
  Calendar,
  Building,
  ShieldCheck,
  FileBadge
} from 'lucide-react'
import { Paciente, Sessao, Diagnostico, ConfiguracoesApp } from '../types'

export const RelatoriosModule: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [config, setConfig] = useState<ConfiguracoesApp | null>(null)
  
  const [selectedPacienteId, setSelectedPacienteId] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState<'declaracao' | 'evolucao' | 'atestado'>('declaracao')
  const [finalidade, setFinalidade] = useState('Fins trabalhistas/acadêmicos')
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().slice(0, 10))
  const [textoPersonalizado, setTextoPersonalizado] = useState('')

  const carregarDados = async () => {
    const p = await (window as any).api.pacientes.listar()
    setPacientes(p)
    const s = await (window as any).api.sessoes.todas()
    setSessoes(s)
    const d = await (window as any).api.diagnosticos.listar()
    setDiagnosticos(d)
    const c = await (window as any).api.config.obter()
    setConfig(c)
    if (p.length > 0 && !selectedPacienteId) setSelectedPacienteId(p[0].id)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const pacienteAtual = pacientes.find((p) => p.id === selectedPacienteId)
  const sessoesPac = sessoes.filter((s) => s.pacienteId === selectedPacienteId)
  const diagPac = diagnosticos.filter((d) => d.pacienteId === selectedPacienteId)

  const handleImprimir = () => {
    window.print()
  }

  return (
    <div className="page-enter" style={{ padding: '36px 40px' }}>
      
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
          <h1 className="title">Emissão de Documentos & Relatórios Clínicos</h1>
          <p className="subtitle">
            Geração de Declarações de Comparecimento, Relatórios de Evolução e Documentos Técnicos com carimbo/CRP
          </p>
        </div>

        <button onClick={handleImprimir} className="btn btn-primary">
          <Printer size={18} /> Imprimir / Salvar PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        
        {/* Painel de Configuração do Documento */}
        <div className="card" style={{ padding: '22px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#0f172a' }}>
            Parâmetros do Documento
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group">
              <label>Paciente *</label>
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
              <label>Tipo de Documento *</label>
              <select
                className="input"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value as any)}
              >
                <option value="declaracao">Declaração de Comparecimento</option>
                <option value="evolucao">Relatório de Evolução Psicoterapêutica</option>
                <option value="atestado">Atestado Psicológico (Res. CFP 06/2019)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Finalidade / Destinação</label>
              <input
                type="text"
                className="input"
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
                placeholder="Ex: Comprovação acadêmica / RH"
              />
            </div>

            <div className="input-group">
              <label>Data do Documento</label>
              <input
                type="date"
                className="input"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Texto Complementar / Observações (Opcional)</label>
              <textarea
                className="input"
                rows={4}
                value={textoPersonalizado}
                onChange={(e) => setTextoPersonalizado(e.target.value)}
                placeholder="Adicione ressalvas ou comentários técnicos adicionais..."
              />
            </div>
          </div>
        </div>

        {/* Folha A4 do Documento Pronto para Impressão */}
        <div
          className="card"
          style={{
            padding: '48px 56px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            minHeight: '680px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Cabeçalho do Consultório */}
          <div>
            <div
              style={{
                borderBottom: '2px solid #0f172a',
                paddingBottom: '16px',
                marginBottom: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  {config?.nomeProfissional || 'Dra. Vanessa Martins'}
                </h2>
                <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                  Psicóloga Clínica • CRP: {config?.crp || '06/123456'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {config?.especialidade || 'Psicoterapia Cognitivo-Comportamental'}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                <div>{config?.enderecoConsultorio || 'Av. Paulista, 1500 - Sala 804'}</div>
                <div>Tel: {config?.telefoneConsultorio || '(11) 3456-7890'}</div>
              </div>
            </div>

            {/* Título Centralizado do Documento */}
            <div style={{ textAlign: 'center', margin: '36px 0 28px 0' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#0f172a',
                  margin: 0
                }}
              >
                {tipoDocumento === 'declaracao'
                  ? 'Declaração de Comparecimento'
                  : tipoDocumento === 'evolucao'
                  ? 'Relatório de Evolução Psicológica'
                  : 'Atestado Psicológico'}
              </h3>
            </div>

            {/* Corpo do Documento */}
            <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#1e293b', textAlign: 'justify' }}>
              {tipoDocumento === 'declaracao' && (
                <p>
                  Declaro para os devidos fins de <strong>{finalidade}</strong> que o(a) paciente{' '}
                  <strong>{pacienteAtual?.nome || '_____________________'}</strong>, inscrito(a) no CPF sob o nº{' '}
                  <strong>{pacienteAtual?.cpf || '___.___.___-__'}</strong>, esteve em atendimento psicológico
                  nesta data (<strong>{new Date(dataEmissao).toLocaleDateString('pt-BR')}</strong>) sob meus cuidados profissionais.
                </p>
              )}

              {tipoDocumento === 'evolucao' && (
                <div>
                  <p>
                    O(A) paciente <strong>{pacienteAtual?.nome}</strong> encontra-se em acompanhamento psicoterápico
                    regular sob a abordagem Cognitivo-Comportamental desde{' '}
                    <strong>{new Date(pacienteAtual?.createdAt || Date.now()).toLocaleDateString('pt-BR')}</strong>, totalizando{' '}
                    <strong>{sessoesPac.length} sessões</strong> realizadas até o presente momento.
                  </p>
                  <p>
                    <strong>Síntese do Processo Terapêutico:</strong> O paciente apresenta adesão satisfatória às intervenções
                    propostas, com evolução consistente no manejo da autorregulação emocional e redução de sintomas associados à queixa inicial.
                  </p>
                  {diagPac.length > 0 && (
                    <p>
                      <strong>Registro Diagnóstico ({diagPac[0].classificacao}):</strong> {diagPac[0].codigo} — {diagPac[0].descricao}.
                    </p>
                  )}
                </div>
              )}

              {tipoDocumento === 'atestado' && (
                <p>
                  Atesto, para os devidos fins conforme a Resolução CFP nº 06/2019, que o(a) paciente{' '}
                  <strong>{pacienteAtual?.nome}</strong>, CPF nº <strong>{pacienteAtual?.cpf || '___.___.___-__'}</strong>,
                  está sob acompanhamento psicológico por razões clínicas, necessitando do afastamento/acompanhamento
                  correspondente à sua condição de saúde emocional.
                </p>
              )}

              {textoPersonalizado && (
                <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <strong>Observações Técnicas:</strong> {textoPersonalizado}
                </div>
              )}
            </div>
          </div>

          {/* Assinatura e Carimbo do Profissional */}
          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <div style={{ width: '280px', borderTop: '1px solid #0f172a', margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              {config?.nomeProfissional || 'Dra. Vanessa Martins'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569' }}>
              Psicóloga Clínica • CRP: {config?.crp || '06/123456'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>
              Emitido em {new Date(dataEmissao).toLocaleDateString('pt-BR')} • Assinatura Digital / Carimbo
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
