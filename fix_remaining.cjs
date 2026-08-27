const fs = require('fs');

let a = fs.readFileSync('src/components/AvaliacoesModule.tsx', 'utf8');
a = a.replace(/if \(confirm\('Deseja excluir esta avaliação psicológica do prontuário\?'\)\) \{\s*await window\.api\.avaliacoes\.excluir\(id\)\s*carregarAvaliacoes\(\)\s*\}/, `setAvaliacaoExcluir(id)`);
fs.writeFileSync('src/components/AvaliacoesModule.tsx', a);

let d = fs.readFileSync('src/components/DiagnosticosModule.tsx', 'utf8');
d = d.replace(/if \(confirm\('Tem certeza que deseja remover este registro diagnóstico do prontuário\?'\)\) \{\s*await window\.api\.diagnosticos\.excluir\(id\)\s*carregarDiagnosticos\(\)\s*\}/, `setDiagExcluir(id)`);
fs.writeFileSync('src/components/DiagnosticosModule.tsx', d);

let b = fs.readFileSync('src/components/BackupAuditoriaModule.tsx', 'utf8');
b = b.replace(/if \(confirm\('Atenção: A restauração irá substituir a base de dados atual pelo backup selecionado\. Deseja prosseguir\?'\)\) \{[\s\S]*?\}\s*\} catch \(e\) \{/, `// logic replaced`);
fs.writeFileSync('src/components/BackupAuditoriaModule.tsx', b);

let ag = fs.readFileSync('src/components/AgendaLifecycleModule.tsx', 'utf8');
ag = ag.replace(/if \(confirm\(\`Confirmar registro de ausência para \$\{getNomePaciente\(c.pacienteId\)\}\?\`\)\) \{\s*await window\.api\.consultas\.marcarAusencia\(c.id\)\s*carregarAgendamentos\(\)\s*\}/, 'setAusenciaConfirm(c)');
ag = ag.replace(/if \(confirm\('Deseja realmente remover este agendamento\?'\)\) \{\s*await window\.api\.consultas\.excluir\(id\)\s*carregarAgendamentos\(\)\s*\}/, 'setExcluirConfirm(id)');
fs.writeFileSync('src/components/AgendaLifecycleModule.tsx', ag);
