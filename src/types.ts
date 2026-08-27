export type ConsultaStatus = 'agendado' | 'aguardando' | 'em_atendimento' | 'concluido' | 'ausencia' | 'cancelado';

export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone?: string;
  cpf?: string;
  profissao?: string;
  queixa?: string;
  historico?: string;
  status: 'ativo' | 'inativo' | 'arquivado';
  createdAt: string;
  updatedAt: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  data: string; // YYYY-MM-DD
  horarioAgendado: string; // ISO ou HH:MM
  horarioChegada?: string; // ISO
  horarioInicio?: string; // ISO
  horarioTermino?: string; // ISO
  duracaoMinutos?: number;
  status: ConsultaStatus;
  observacoes?: string;
  resumo?: string;
  createdAt: string;
}

export interface Sessao {
  id: string;
  pacienteId: string;
  consultaId?: string;
  dataSessao: string;
  resumo: string;
  anotacoes: string;
  conteudoIA?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Avaliacao {
  id: string;
  pacienteId: string;
  data: string;
  tipo: string; // 'Anamnese Inicial' | 'Escala de Ansiedade (GAD-7)' | 'Inventário de Depressão (BDI)' | 'Avaliação Neuropsicológica' | 'Outro'
  instrumento?: string;
  observacoes: string;
  resultados: string;
  referenciasUtilizadas?: string;
  createdAt: string;
}

export interface Diagnostico {
  id: string;
  pacienteId: string;
  classificacao: 'CID-11' | 'CID-10' | 'DSM-5-TR';
  codigo: string;
  descricao: string;
  data: string;
  observacoes?: string;
  profissionalResponsavel: string;
  crp: string;
  status: 'hipotese' | 'confirmado' | 'em_investigacao' | 'remissao';
  createdAt: string;
}

export type StatusRevisaoIA = 'gerado_ia' | 'aguardando_revisao' | 'revisado' | 'aprovado';

export interface AnaliseIA {
  id: string;
  pacienteId: string;
  sessaoId?: string;
  tipoAnalise: 'resumo_clinico' | 'organizacao_anotacoes' | 'criterios_diagnosticos' | 'hipoteses_diferenciais' | 'rascunho_relatorio';
  dadosAnonimizadosUtilizados: string;
  resultado: {
    condicao?: string;
    criteriosPresentes?: string[];
    criteriosNaoIdentificados?: string[];
    informacoesInsuficientes?: string[];
    hipotesesDiferenciais?: string[];
    consideracoes: string;
    textoEstruturado?: string;
  };
  modelo: string;
  referenciaUtilizada?: string;
  versaoReferencia?: string;
  statusRevisao: StatusRevisaoIA;
  data: string;
  observacoesProfissional?: string;
}

export interface LogAuditoria {
  id: string;
  timestamp: string;
  acao: string;
  categoria: 'AUTH' | 'PACIENTE' | 'SESSAO' | 'CONSULTA' | 'DIAGNOSTICO' | 'IA' | 'BACKUP' | 'CONFIG';
  detalhe: string;
  pacienteAnonimizadoId?: string;
}

export interface ConfiguracoesApp {
  nomeProfissional: string;
  crp: string;
  especialidade: string;
  enderecoConsultorio: string;
  telefoneConsultorio: string;
  senhaHash?: string;
  tempoInatividadeMin: number;
  chaveOpenAIConfigurada: boolean;
  chaveOpenAIApelido?: string;
  bloqueioAtivado: boolean;
  ultimaDataBackup?: string;
}
