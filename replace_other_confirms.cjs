const fs = require('fs');

// AvaliacoesModule.tsx
let avaliacoes = fs.readFileSync('src/components/AvaliacoesModule.tsx', 'utf8');
avaliacoes = avaliacoes.replace("import React, { useState, useEffect } from 'react'", "import React, { useState, useEffect } from 'react'\nimport { ConfirmModal } from './ConfirmModal'");
avaliacoes = avaliacoes.replace("const [toastVisible, setToastVisible] = useState(false)", "const [toastVisible, setToastVisible] = useState(false)\n  const [avaliacaoExcluir, setAvaliacaoExcluir] = useState<string | null>(null)");
avaliacoes = avaliacoes.replace(/const excluir = async \(id: string\) => \{[\s\S]*?carregarAvaliacoes\(\)\n    \}\n  \}/, `const excluir = async (id: string) => {
    setAvaliacaoExcluir(id)
  }`);
avaliacoes = avaliacoes.replace(/<\/div>\s*\)\s*\}/, `      <ConfirmModal
        isOpen={!!avaliacaoExcluir}
        title="Excluir Avaliação"
        message="Deseja excluir esta avaliação psicológica do prontuário?"
        onCancel={() => setAvaliacaoExcluir(null)}
        onConfirm={async () => {
          if (avaliacaoExcluir) {
            await window.api.avaliacoes.excluir(avaliacaoExcluir)
            setAvaliacaoExcluir(null)
            carregarAvaliacoes()
          }
        }}
      />
    </div>
  )
}`);
fs.writeFileSync('src/components/AvaliacoesModule.tsx', avaliacoes);

// DiagnosticosModule.tsx
let diagnosticos = fs.readFileSync('src/components/DiagnosticosModule.tsx', 'utf8');
diagnosticos = diagnosticos.replace("import React, { useState, useEffect } from 'react'", "import React, { useState, useEffect } from 'react'\nimport { ConfirmModal } from './ConfirmModal'");
diagnosticos = diagnosticos.replace("const [toastVisible, setToastVisible] = useState(false)", "const [toastVisible, setToastVisible] = useState(false)\n  const [diagExcluir, setDiagExcluir] = useState<string | null>(null)");
diagnosticos = diagnosticos.replace(/const excluir = async \(id: string\) => \{[\s\S]*?carregarDiagnosticos\(\)\n    \}\n  \}/, `const excluir = async (id: string) => {
    setDiagExcluir(id)
  }`);
diagnosticos = diagnosticos.replace(/<\/div>\s*\)\s*\}/, `      <ConfirmModal
        isOpen={!!diagExcluir}
        title="Remover Diagnóstico"
        message="Tem certeza que deseja remover este registro diagnóstico do prontuário?"
        onCancel={() => setDiagExcluir(null)}
        onConfirm={async () => {
          if (diagExcluir) {
            await window.api.diagnosticos.excluir(diagExcluir)
            setDiagExcluir(null)
            carregarDiagnosticos()
          }
        }}
      />
    </div>
  )
}`);
fs.writeFileSync('src/components/DiagnosticosModule.tsx', diagnosticos);

