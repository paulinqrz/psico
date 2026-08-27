const fs = require('fs');

let b = fs.readFileSync('src/components/BackupAuditoriaModule.tsx', 'utf8');

// replace state
b = b.replace("const [filtroCategoria, setFiltroCategoria] = useState('TODAS')", "const [filtroCategoria, setFiltroCategoria] = useState('TODAS')\n  const [confirmarRestaure, setConfirmarRestaure] = useState<{conteudo: string} | null>(null)");

// replace handleRestaurarArquivo
b = b.replace(/const handleRestaurarArquivo = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsText\(file\)\n  \}/, `const handleRestaurarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const conteudo = event.target?.result as string
      setConfirmarRestaure({ conteudo })
    }
    reader.readAsText(file)
  }`);

// append ConfirmModal
b = b.replace(/<\/div>\s*\)\s*\}/, `      <ConfirmModal
        isOpen={!!confirmarRestaure}
        title="Restaurar Backup"
        message="Atenção: A restauração irá substituir a base de dados atual pelo backup selecionado. Deseja prosseguir?"
        onCancel={() => setConfirmarRestaure(null)}
        onConfirm={async () => {
          if (confirmarRestaure) {
            const ok = await (window as any).api.backup.restaurarDados(confirmarRestaure.conteudo)
            if (ok) {
              await carregarDados()
              mostrarToast('Base de dados e prontuários restaurados com sucesso!')
            } else {
              mostrarToast('Arquivo de backup corrompido ou incompatível.')
            }
            setConfirmarRestaure(null)
          }
        }}
      />
    </div>
  )
}`);

fs.writeFileSync('src/components/BackupAuditoriaModule.tsx', b);
