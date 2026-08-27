const fs = require('fs');

// BackupAuditoriaModule.tsx
let backup = fs.readFileSync('src/components/BackupAuditoriaModule.tsx', 'utf8');
backup = backup.replace("import React, { useState, useEffect } from 'react'", "import React, { useState, useEffect } from 'react'\nimport { ConfirmModal } from './ConfirmModal'");
backup = backup.replace("const [toastMessage, setToastMessage] = useState('')", "const [toastMessage, setToastMessage] = useState('')\n  const [confirmarRestaure, setConfirmarRestaure] = useState<{conteudo: string} | null>(null)");
backup = backup.replace(/const importar = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\} catch \(e\) \{[\s\S]*?\}\s*\}/, `const importar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const conteudo = ev.target?.result as string
      setConfirmarRestaure({ conteudo })
    }
    reader.readAsText(file)
  }`);
backup = backup.replace(/<\/div>\s*\)\s*\}/, `      <ConfirmModal
        isOpen={!!confirmarRestaure}
        title="Restaurar Backup"
        message="Atenção: A restauração irá substituir a base de dados atual pelo backup selecionado. Deseja prosseguir?"
        onCancel={() => setConfirmarRestaure(null)}
        onConfirm={async () => {
          if (confirmarRestaure) {
            try {
              await window.api.backup.importar(confirmarRestaure.conteudo)
              setToastMessage('Backup restaurado com sucesso! Recarregando...')
              setToastVisible(true)
              setTimeout(() => window.location.reload(), 2000)
            } catch (e) {
              setToastMessage('Erro ao restaurar arquivo. Formato inválido.')
              setToastVisible(true)
              setTimeout(() => setToastVisible(false), 3000)
            }
            setConfirmarRestaure(null)
          }
        }}
      />
    </div>
  )
}`);
fs.writeFileSync('src/components/BackupAuditoriaModule.tsx', backup);

// AgendaLifecycleModule.tsx
let agenda = fs.readFileSync('src/components/AgendaLifecycleModule.tsx', 'utf8');
agenda = agenda.replace("import React, { useState, useEffect } from 'react'", "import React, { useState, useEffect } from 'react'\nimport { ConfirmModal } from './ConfirmModal'");
agenda = agenda.replace("const [salvando, setSalvando] = useState(false)", "const [salvando, setSalvando] = useState(false)\n  const [ausenciaConfirm, setAusenciaConfirm] = useState<any>(null)\n  const [excluirConfirm, setExcluirConfirm] = useState<string | null>(null)");

agenda = agenda.replace(/const marcarAusencia = async \(c: any\) => \{[\s\S]*?carregarAgendamentos\(\)\n    \}\n  \}/, `const marcarAusencia = async (c: any) => {
    setAusenciaConfirm(c)
  }`);

agenda = agenda.replace(/const remover = async \(id: string\) => \{[\s\S]*?carregarAgendamentos\(\)\n    \}\n  \}/, `const remover = async (id: string) => {
    setExcluirConfirm(id)
  }`);

agenda = agenda.replace(/<\/div>\s*\)\s*\}/, `      <ConfirmModal
        isOpen={!!ausenciaConfirm}
        title="Registrar Ausência"
        message={"Confirmar registro de ausência para " + (ausenciaConfirm ? getNomePaciente(ausenciaConfirm.pacienteId) : "") + "?"}
        onCancel={() => setAusenciaConfirm(null)}
        onConfirm={async () => {
          if (ausenciaConfirm) {
            await window.api.consultas.marcarAusencia(ausenciaConfirm.id)
            setAusenciaConfirm(null)
            carregarAgendamentos()
          }
        }}
      />
      <ConfirmModal
        isOpen={!!excluirConfirm}
        title="Remover Agendamento"
        message="Deseja realmente remover este agendamento?"
        onCancel={() => setExcluirConfirm(null)}
        onConfirm={async () => {
          if (excluirConfirm) {
            await window.api.consultas.excluir(excluirConfirm)
            setExcluirConfirm(null)
            carregarAgendamentos()
          }
        }}
      />
    </div>
  )
}`);
fs.writeFileSync('src/components/AgendaLifecycleModule.tsx', agenda);

