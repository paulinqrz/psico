sed -i 's/if (confirm('"'"'Deseja excluir esta avaliação psicológica do prontuário?'"'"')) {/setAvaliacaoExcluir(id)/g' src/components/AvaliacoesModule.tsx
sed -i 's/if (confirm('"'"'Tem certeza que deseja remover este registro diagnóstico do prontuário?'"'"')) {/setDiagExcluir(id)/g' src/components/DiagnosticosModule.tsx
sed -i 's/if (confirm('"'"'Atenção: A restauração irá substituir a base de dados atual pelo backup selecionado. Deseja prosseguir?'"'"')) {//g' src/components/BackupAuditoriaModule.tsx
sed -i 's/if (confirm(`Confirmar registro de ausência para ${getNomePaciente(c.pacienteId)}?`)) {/setAusenciaConfirm(c)/g' src/components/AgendaLifecycleModule.tsx
sed -i 's/if (confirm('"'"'Deseja realmente remover este agendamento?'"'"')) {/setExcluirConfirm(id)/g' src/components/AgendaLifecycleModule.tsx
