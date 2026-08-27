# App.tsx
sed -i 's/import { AvaliacoesModule }/import { ConfirmModal } from ".\/components\/ConfirmModal";\nimport { AvaliacoesModule }/g' src/App.tsx
sed -i 's/const \[resumo, setResumo\] = useState('"''"')/const [resumo, setResumo] = useState('"''"');\n  const [confirmarExclusao, setConfirmarExclusao] = useState(false);/g' src/App.tsx

# AgendaLifecycleModule.tsx
sed -i 's/const \[salvando, setSalvando\] = useState(false)/const [salvando, setSalvando] = useState(false);\n  const [ausenciaConfirm, setAusenciaConfirm] = useState<any>(null);\n  const [excluirConfirm, setExcluirConfirm] = useState<string | null>(null);/g' src/components/AgendaLifecycleModule.tsx
sed -i 's/carregarAgendamentos()/carregarDados()/g' src/components/AgendaLifecycleModule.tsx

# AvaliacoesModule.tsx
sed -i 's/const \[resultados, setResultados\] = useState('"''"')/const [resultados, setResultados] = useState('"''"');\n  const [avaliacaoExcluir, setAvaliacaoExcluir] = useState<string | null>(null);/g' src/components/AvaliacoesModule.tsx
sed -i 's/carregarAvaliacoes()/carregarDados()/g' src/components/AvaliacoesModule.tsx

# BackupAuditoriaModule.tsx
sed -i 's/const \[filtroCategoria, setFiltroCategoria\] = useState('"'"'TODAS'"'"')/const [filtroCategoria, setFiltroCategoria] = useState('"'"'TODAS'"'"');\n  const [toastMessage, setToastMessage] = useState("");\n  const [toastVisible, setToastVisible] = useState(false);/g' src/components/BackupAuditoriaModule.tsx

# DiagnosticosModule.tsx
sed -i 's/const \[salvando, setSalvando\] = useState(false)/const [salvando, setSalvando] = useState(false);\n  const [diagExcluir, setDiagExcluir] = useState<string | null>(null);/g' src/components/DiagnosticosModule.tsx
sed -i 's/carregarDiagnosticos()/carregarDados()/g' src/components/DiagnosticosModule.tsx
