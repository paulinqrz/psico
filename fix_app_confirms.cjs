const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add import for ConfirmModal
app = app.replace("import { AssistenteIAModule } from './components/AssistenteIAModule'", "import { AssistenteIAModule } from './components/AssistenteIAModule'\nimport { ConfirmModal } from './components/ConfirmModal'");

// --- TelaPacientes ---
app = app.replace("const [busca, setBusca] = useState('')", "const [busca, setBusca] = useState('')\n  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<string | null>(null)");
app = app.replace(/const excluir = async \(e: React\.MouseEvent, id: string\) => \{\s*e\.stopPropagation\(\)\s*if \(confirm\('Tem certeza que deseja excluir este paciente permanentemente com todo o seu histórico\?'\)\) \{\s*await window\.api\.pacientes\.excluir\(id\)\s*carregarPacientes\(\)\s*\}\s*\}/, `const excluir = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setPacienteParaExcluir(id)
  }`);

const modalPacientes = `
      <ConfirmModal
        isOpen={!!pacienteParaExcluir}
        title="Excluir Paciente"
        message="Tem certeza que deseja excluir este paciente permanentemente com todo o seu histórico?"
        onCancel={() => setPacienteParaExcluir(null)}
        onConfirm={async () => {
          if (pacienteParaExcluir) {
            await window.api.pacientes.excluir(pacienteParaExcluir)
            carregarPacientes()
            setPacienteParaExcluir(null)
          }
        }}
      />
    </div>
  )
}`;
app = app.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*\/\/\s*---\s*DETALHE/, modalPacientes + "\n// --- DETALHE");

// --- DetalheEditarSessao ---
app = app.replace("const [dataSessao, setDataNascimento] = useState('')", "const [dataSessao, setDataNascimento] = useState('')\n  const [confirmarExclusao, setConfirmarExclusao] = useState(false)");
// wait, the state name is dataSessao, not dataNascimento in DetalheEditarSessao? Let's check first.
