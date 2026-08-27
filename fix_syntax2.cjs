const fs = require('fs');

let a = fs.readFileSync('src/components/AvaliacoesModule.tsx', 'utf8');
a = a.replace(/setAvaliacaoExcluir\(id\)[\s\S]*?mostrarToast\('Avaliação removida\.'\)\n    \}\n  \}/, 'setAvaliacaoExcluir(id)\n  }');
fs.writeFileSync('src/components/AvaliacoesModule.tsx', a);

let d = fs.readFileSync('src/components/DiagnosticosModule.tsx', 'utf8');
d = d.replace(/setDiagExcluir\(id\)[\s\S]*?mostrarToast\('Diagnóstico removido\.'\)\n    \}\n  \}/, 'setDiagExcluir(id)\n  }');
fs.writeFileSync('src/components/DiagnosticosModule.tsx', d);

let ag = fs.readFileSync('src/components/AgendaLifecycleModule.tsx', 'utf8');
ag = ag.replace(/setAusenciaConfirm\(c\)[\s\S]*?mostrarToast\('Ausência registrada com sucesso\.'\)\n    \}\n  \}/, 'setAusenciaConfirm(c)\n  }');
ag = ag.replace(/setExcluirConfirm\(id\)[\s\S]*?mostrarToast\('Agendamento removido\.'\)\n    \}\n  \}/, 'setExcluirConfirm(id)\n  }');
fs.writeFileSync('src/components/AgendaLifecycleModule.tsx', ag);

