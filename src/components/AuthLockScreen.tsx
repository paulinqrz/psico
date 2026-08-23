import React, { useState } from 'react'
import { Lock, KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react'

interface AuthLockScreenProps {
  onUnlock?: () => void
  onUnlockSuccess?: () => void
  nomeProfissional?: string
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({
  onUnlock,
  onUnlockSuccess,
  nomeProfissional
}) => {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [tentativas, setTentativas] = useState(0)
  const [bloqueioTemporario, setBloqueioTemporario] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (bloqueioTemporario) return

    const valida = await (window as any).api.config.verificarSenha(senha)
    if (valida) {
      setErro('')
      setSenha('')
      setTentativas(0)
      if (onUnlock) onUnlock()
      if (onUnlockSuccess) onUnlockSuccess()
    } else {
      const novasTentativas = tentativas + 1
      setTentativas(novasTentativas)
      if (novasTentativas >= 5) {
        setBloqueioTemporario(true)
        setErro('Muitas tentativas incorretas. Sistema bloqueado por 30 segundos.')
        setTimeout(() => {
          setBloqueioTemporario(false)
          setTentativas(0)
          setErro('')
        }, 30000)
      } else {
        setErro(`Senha incorreta (${5 - novasTentativas} tentativas restantes)`)
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        className="card page-enter"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 32px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid #dbeafe'
            }}
          >
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
            Acesso Restrito ao Consultório
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {nomeProfissional || 'Profissional Responsável'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={14} /> Digite sua Senha de Acesso
            </label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha do profissional (padrão: 1234)"
              disabled={bloqueioTemporario}
              autoFocus
              required
            />
          </div>

          {erro && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              <ShieldAlert size={16} />
              <span>{erro}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={bloqueioTemporario}
          >
            <ShieldCheck size={18} /> {bloqueioTemporario ? 'Aguarde 30s...' : 'Desbloquear Prontuários'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px'
          }}
        >
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Proteção de Dados & Sigilo Clínico (LGPD & CFP) • Armazenamento Local Seguro
          </span>
        </div>
      </div>
    </div>
  )
}
