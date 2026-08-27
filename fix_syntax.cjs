const fs = require('fs');

function fix(file, triggerVar, fnCall) {
  let content = fs.readFileSync(file, 'utf8');
  // We want to replace the `await ... carregar... }` with nothing, because it's handled in the ConfirmModal.
  // I will just use regex to clean it up.
  // I will just read the file, parse the AST or use simple replace.
  
  // E.g.
  // setDiagExcluir(id)
  // await window.api.diagnosticos.excluir(id)
  // carregarDiagnosticos()
  // }
  
  content = content.replace(new RegExp(`set${triggerVar}\\(id\\)\\s*await.*\\s*.*\\s*\\}`, 'g'), `set${triggerVar}(id)`);
  content = content.replace(new RegExp(`set${triggerVar}\\(c\\)\\s*await.*\\s*.*\\s*\\}`, 'g'), `set${triggerVar}(c)`);
  
  fs.writeFileSync(file, content);
}

fix('src/components/AvaliacoesModule.tsx', 'AvaliacaoExcluir');
fix('src/components/DiagnosticosModule.tsx', 'DiagExcluir');
fix('src/components/AgendaLifecycleModule.tsx', 'AusenciaConfirm');
fix('src/components/AgendaLifecycleModule.tsx', 'ExcluirConfirm');

