const fs = require('fs');

let ag = fs.readFileSync('src/components/AgendaLifecycleModule.tsx', 'utf8');

// handleMarcarAusencia
ag = ag.replace(/setAusenciaConfirm\(c\)[\s\S]*?if \(modalDetalheConsulta\?\.id === c\.id\) setModalDetalheConsulta\(null\)\n    \}\n  \}/, 'setAusenciaConfirm(c)\n  }');

// handleExcluirConsulta
ag = ag.replace(/setExcluirConfirm\(id\)[\s\S]*?mostrarToast\('Consulta removida da agenda\.'\)\n    \}\n  \}/, 'setExcluirConfirm(id)\n  }');

fs.writeFileSync('src/components/AgendaLifecycleModule.tsx', ag);
