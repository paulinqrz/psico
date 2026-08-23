import React, { useState } from 'react'
import { ShieldCheck, AlertTriangle, X, Lock, Sparkles, Eye } from 'lucide-react'
import { Paciente } from '../types'
import { anonimizarTextoClinico } from '../services/api'

interface ConsentPrivacyModalProps {
  isOpen: boolean
  tituloAcao: string
  paciente?: Paciente
  textoOriginal: string
  onConfirm: (textoAnonimizadoFinal: string) => void
  onCancel: () => void
}

export const ConsentPrivacyModal: React.FC<ConsentPrivacyModalProps> = ({
  isOpen,
  tituloAcao,
  paciente,
  textoOriginal,
  onConfirm,
  onCancel
}) => {
  const [textoAnonimizado, setTextoAnonimizado] = useState(() =>
    anonimizarTextoClinico(textoOriginal, paciente)
  )
  const [consentimentoAceito, setConsentimentoAceito] = useState(false)

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        className="card page-enter"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Revisão de Privacidade & Anonimização (LGPD)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Ação: {tituloAcao}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="btn btn-icon-only">
            <X size={18} />
          </button>
        </div>

        {/* Alerta de transparência de processamento externo */}
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '18px'
          }}
        >
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: '#92400e', lineHeight: '1.45' }}>
            <strong>Aviso de Sigilo:</strong> Os dados clínicos selecionados serão submetidos ao motor de inteligência artificial.
            Para proteger a identidade do paciente conforme as diretrizes do CFP e LGPD, nomes, telefones e CPFs foram substituídos automaticamente por pseudônimos.
          </div>
        </div>

        {/* Pré-visualização do texto anonimizado com permissão para edição manual */}
        <div className="input-group" style={{ marginBottom: '18px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> Dados Anonimizados a Serem Enviados (Você pode editar):
            </span>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
              <Lock size={11} style={{ display: 'inline', marginRight: '2px' }} /> Sem dados cadastrais diretos
            </span>
          </label>
          <textarea
            className="input"
            rows={6}
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '1.5',
              background: '#f8fafc'
            }}
            value={textoAnonimizado}
            onChange={(e) => setTextoAnonimizado(e.target.value)}
          />
        </div>

        {/* Checkbox de consentimento explícito */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '13px',
            color: '#334155',
            cursor: 'pointer',
            marginBottom: '22px',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={consentimentoAceito}
            onChange={(e) => setConsentimentoAceito(e.target.checked)}
            style={{ marginTop: '3px' }}
          />
          <span>
            Confirmo que revisei o conteúdo anonimizado e autorizo a análise assistida pela IA como ferramenta auxiliar de raciocínio clínico.
          </span>
        </label>

        {/* Ações */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px'
          }}
        >
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!consentimentoAceito}
            onClick={() => onConfirm(textoAnonimizado)}
          >
            <Sparkles size={16} /> Processar com IA
          </button>
        </div>
      </div>
    </div>
  )
}
