const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// The TelaPacientes has a lot of state that might be causing re-render issues.
// Let's create a separate NovoPacienteForm component.

const formCode = `
function NovoPacienteForm({ fechar, carregarPacientes }: { fechar: () => void, carregarPacientes: () => void }) {
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [salvando, setSalvando] = useState(false)

  const criarPacienteRapido = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    await window.api.pacientes.criar({
      nome,
      dataNascimento: new Date(dataNascimento).toISOString(),
      telefone
    })
    setSalvando(false)
    fechar()
    carregarPacientes()
  }

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
              onClick={fechar}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" onClick={fechar} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                Salvar Paciente
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
`;

// Insert the new component before TelaPacientes
app = app.replace('function TelaPacientes() {', formCode + '\n\nfunction TelaPacientes() {');

// Remove the inline form from TelaPacientes
// First, find the if (modoForm) { return (...) } block
const startIf = app.indexOf('if (modoForm) {');
const endIf = app.indexOf('return (', startIf + 10);
// We'll replace it with a call to the new component
const blockToReplace = app.substring(startIf, app.indexOf('return (', app.indexOf('  return (', startIf + 100)));
// Actually, it's safer to use regex or string replace exactly.

