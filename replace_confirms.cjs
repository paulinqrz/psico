const fs = require('fs');

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');

// TelaPacientes
app = app.replace("const [busca, setBusca] = useState('')", "const [busca, setBusca] = useState('')\n  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<string | null>(null)");
app = app.replace(/const excluir = async \(e: React\.MouseEvent, id: string\) => \{[\s\S]*?carregarPacientes\(\)\n    \}\n  \}/, `const excluir = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setPacienteParaExcluir(id)
  }`);
app = app.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*\/\/\s*---\s*DETALHE EDIÇÃO DE UMA SESSÃO/, `      <ConfirmModal
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
}
// --- DETALHE EDIÇÃO DE UMA SESSÃO`);

// DetalheEditarSessao
app = app.replace("const [toastVisible, setToastVisible] = useState(false)", "const [toastVisible, setToastVisible] = useState(false)\n  const [confirmarExclusao, setConfirmarExclusao] = useState(false)");
app = app.replace(/const handleExcluir = async \(\) => \{[\s\S]*?voltar\(\)\n    \}\n  \}/, `const handleExcluir = async () => {
    setConfirmarExclusao(true)
  }`);
app = app.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*\/\/\s*---\s*LISTA DE SESSÕES/, `      <ConfirmModal
        isOpen={confirmarExclusao}
        title="Excluir Sessão"
        message="Tem certeza que deseja excluir o registro desta sessão?"
        onCancel={() => setConfirmarExclusao(false)}
        onConfirm={async () => {
          await window.api.sessoes.excluir(sessaoId)
          voltar()
        }}
      />
    </div>
  )
}
// --- LISTA DE SESSÕES`);

// TelaAgenda
app = app.replace("const [sessaoModalDetalhe, setSessaoModalDetalhe] = useState<any>(null)", "const [sessaoModalDetalhe, setSessaoModalDetalhe] = useState<any>(null)\n  const [sessaoParaExcluir, setSessaoParaExcluir] = useState<any>(null)");
app = app.replace(/const excluirSessaoAgenda = async \(\) => \{[\s\S]*?await carregarDados\(\)\n    \}\n  \}/, `const excluirSessaoAgenda = async () => {
    if (!sessaoModalDetalhe) return
    setSessaoParaExcluir(sessaoModalDetalhe)
  }`);
app = app.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*\/\/\s*---\s*LAYOUT PRINCIPAL/, `      <ConfirmModal
        isOpen={!!sessaoParaExcluir}
        title="Excluir Agendamento"
        message="Deseja excluir este agendamento da agenda?"
        onCancel={() => setSessaoParaExcluir(null)}
        onConfirm={async () => {
          if (sessaoParaExcluir) {
            await window.api.sessoes.excluir(sessaoParaExcluir.id)
            setSessaoParaExcluir(null)
            setSessaoModalDetalhe(null)
            await carregarDados()
          }
        }}
      />
    </div>
  )
}
// --- LAYOUT PRINCIPAL`);

fs.writeFileSync('src/App.tsx', app);
