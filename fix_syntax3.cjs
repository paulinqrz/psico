const fs = require('fs');

let d = fs.readFileSync('src/components/DiagnosticosModule.tsx', 'utf8');
d = d.replace(/setDiagExcluir\(id\)[\s\S]*?mostrarToast\('Registro diagnóstico removido\.'\)\n    \}\n  \}/, 'setDiagExcluir(id)\n  }');
fs.writeFileSync('src/components/DiagnosticosModule.tsx', d);

let ag = fs.readFileSync('src/components/AgendaLifecycleModule.tsx', 'utf8');
ag = ag.replace(/setAusenciaConfirm\(c\)[\s\S]*?mostrarToast\('Registro de ausência efetuado\.'\)\n    \}\n  \}/, 'setAusenciaConfirm(c)\n  }');
ag = ag.replace(/setExcluirConfirm\(id\)[\s\S]*?mostrarToast\('Agendamento cancelado\/removido\.'\)\n    \}\n  \}/, 'setExcluirConfirm(id)\n  }');
fs.writeFileSync('src/components/AgendaLifecycleModule.tsx', ag);
