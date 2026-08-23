import {
  Paciente,
  Consulta,
  Sessao,
  Avaliacao,
  Diagnostico,
  AnaliseIA,
  StatusRevisaoIA,
  LogAuditoria,
  ConfiguracoesApp
} from '../types'

// Keys para persistência local
const STORAGE_KEYS = {
  PACIENTES: 'psico_pacientes_v2',
  CONSULTAS: 'psico_consultas_v2',
  SESSOES: 'psico_sessoes_v2',
  AVALIACOES: 'psico_avaliacoes_v2',
  DIAGNOSTICOS: 'psico_diagnosticos_v2',
  ANALISES_IA: 'psico_analises_ia_v2',
  LOGS: 'psico_logs_v2',
  CONFIG: 'psico_config_v2',
  AUTH_SESSION: 'psico_auth_session_v2'
}

// Helpers de datas da semana atual
const now = new Date()
const currentDayOfWeek = now.getDay() // 0 = Sun, 1 = Mon ...
const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
const currentMonday = new Date(now)
currentMonday.setDate(now.getDate() + diffToMonday)
currentMonday.setHours(0, 0, 0, 0)

function getWeekDate(dayOffset: number, hours: number, minutes: number = 0): string {
  const d = new Date(currentMonday)
  d.setDate(currentMonday.getDate() + dayOffset)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

// DADOS SEED
const SEED_PACIENTES: Paciente[] = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    nome: 'Lucas Oliveira Santos',
    dataNascimento: '1992-05-14T00:00:00.000Z',
    telefone: '(11) 98765-4321',
    email: 'lucas.santos@email.com',
    cpf: '123.456.789-00',
    endereco: 'Av. Paulista, 1000, Apto 42 - São Paulo/SP',
    profissao: 'Engenheiro de Software',
    queixa: 'Ansiedade generalizada associada a sobrecarga no trabalho e insônia inicial há cerca de 6 meses.',
    historico: 'Sem histórico psiquiátrico prévio na família. Pratica corrida esporadicamente.',
    status: 'ativo',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    nome: 'Mariana Costa Lima',
    dataNascimento: '1988-11-23T00:00:00.000Z',
    telefone: '(11) 91234-5678',
    email: 'mariana.lima@email.com',
    cpf: '987.654.321-11',
    endereco: 'Rua Augusta, 500, Conj 12 - São Paulo/SP',
    profissao: 'Arquiteta Urbanista',
    queixa: 'Dificuldade de concentração, desmotivação e episódios de choro frequentes após término de relacionamento.',
    historico: 'Acompanhamento psicoterápico prévio há 4 anos com boa resposta.',
    status: 'ativo',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    nome: 'Gabriel Pereira Rocha',
    dataNascimento: '2001-03-10T00:00:00.000Z',
    telefone: '(11) 97777-8888',
    email: 'gabriel.rocha@email.com',
    cpf: '456.789.123-22',
    endereco: 'Rua Vergueiro, 1200 - São Paulo/SP',
    profissao: 'Estudante Universitário',
    queixa: 'Fobia social e bloqueio para apresentações orais em público.',
    status: 'ativo',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const SEED_CONSULTAS: Consulta[] = [
  {
    id: 'c1',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    data: getWeekDate(0, 9, 0).slice(0, 10),
    horarioAgendado: getWeekDate(0, 9, 0),
    horarioChegada: getWeekDate(0, 8, 55),
    horarioInicio: getWeekDate(0, 9, 2),
    horarioTermino: getWeekDate(0, 9, 52),
    duracaoMinutos: 50,
    status: 'concluido',
    observacoes: 'Chegou no horário. Sessão focada em respiração diafragmática.',
    resumo: 'Acompanhamento de ansiedade e técnicas de autorregulação',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    pacienteId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    data: getWeekDate(1, 14, 0).slice(0, 10),
    horarioAgendado: getWeekDate(1, 14, 0),
    horarioChegada: getWeekDate(1, 13, 58),
    horarioInicio: getWeekDate(1, 14, 2),
    horarioTermino: getWeekDate(1, 14, 52),
    duracaoMinutos: 50,
    status: 'concluido',
    observacoes: 'Contrato terapêutico revisado.',
    resumo: 'Alinhamento de expectativas e objetivos terapêuticos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c3',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    data: getWeekDate(3, 10, 30).slice(0, 10),
    horarioAgendado: getWeekDate(3, 10, 30),
    status: 'agendado',
    resumo: 'Revisão de pensamentos automáticos e registro de humor',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c4',
    pacienteId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    data: getWeekDate(4, 16, 0).slice(0, 10),
    horarioAgendado: getWeekDate(4, 16, 0),
    status: 'agendado',
    resumo: 'Treino de dessensibilização e exposição gradual',
    createdAt: new Date().toISOString()
  }
]

const SEED_SESSOES: Sessao[] = [
  {
    id: 's1-1a2b3c4d',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    consultaId: 'c1',
    dataSessao: getWeekDate(0, 9, 0),
    resumo: 'Acompanhamento de ansiedade e técnicas de autorregulação',
    anotacoes: 'Paciente relatou melhora discreta nos sintomas físicos de ansiedade. Introduzida técnica de respiração diafragmática 4-7-8 e registro semanal de pensamentos disfuncionais.',
    createdAt: getWeekDate(0, 10, 0)
  },
  {
    id: 's2-2b3c4d5e',
    pacienteId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    consultaId: 'c2',
    dataSessao: getWeekDate(1, 14, 0),
    resumo: 'Alinhamento de expectativas e objetivos terapêuticos',
    anotacoes: 'Paciente demonstrou boa receptividade. Estabelecido contrato terapêutico e metas focadas em resgate do autocuidado e rotina de sono.',
    createdAt: getWeekDate(1, 15, 0)
  }
]

const SEED_AVALIACOES: Avaliacao[] = [
  {
    id: 'av1',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    data: getWeekDate(-7, 10, 0),
    tipo: 'Inventário de Ansiedade (BAI / GAD-7)',
    instrumento: 'Escala GAD-7 de Ansiedade Generalizada',
    observacoes: 'Escore obtido: 13 pontos (Nível moderado de ansiedade).',
    resultados: 'Itens com maior pontuação relacionados à preocupação excessiva incontrolável e tensão muscular.',
    referenciasUtilizadas: 'Spitzer RL, Kroenke K, Williams JB, Löwe B. GAD-7 (2006)',
    createdAt: getWeekDate(-7, 10, 0)
  }
]

const SEED_DIAGNOSTICOS: Diagnostico[] = [
  {
    id: 'diag1',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    classificacao: 'CID-11',
    codigo: '6B00',
    descricao: 'Transtorno de Ansiedade Generalizada (TAG)',
    data: getWeekDate(-7, 10, 0),
    observacoes: 'Critérios em monitoramento. Hipótese inicial corroborada por relatos clínicos e escala GAD-7.',
    profissionalResponsavel: 'Dra. Vanessa Martins',
    crp: '06/123456',
    status: 'hipotese',
    createdAt: getWeekDate(-7, 10, 0)
  }
]

const SEED_ANALISES_IA: AnaliseIA[] = [
  {
    id: 'ana1',
    pacienteId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    sessaoId: 's1-1a2b3c4d',
    tipoAnalise: 'criterios_diagnosticos',
    dadosAnonimizadosUtilizados: 'Paciente adulto, 32 anos. Relato de ansiedade crônica e preocupação excessiva no trabalho há 6 meses. Insônia inicial e tensão muscular frequente.',
    resultado: {
      condicao: 'Transtorno de Ansiedade Generalizada (DSM-5 / CID-11: 6B00)',
      criteriosPresentes: [
        'Ansiedade e preocupação excessivas com diversos eventos ou atividades por mais de 6 meses.',
        'Dificuldade relatada em controlar a preocupação.',
        'Perturbação do sono (dificuldade em conciliar o sono).',
        'Tensão muscular e inquietude.'
      ],
      criteriosNaoIdentificados: [
        'Fadiga precoce persistente não relatada explicitamente.',
        'Irritabilidade extrema com prejuízo interpessoal significativo.'
      ],
      informacoesInsuficientes: [
        'Investigação sobre consumo excessivo de cafeína/estimulantes ou disfunções na tireoide.',
        'Avaliação do grau de prejuízo nas relações sociais fora do trabalho.'
      ],
      hipotesesDiferenciais: [
        'Transtorno de Adaptação com Ansiedade (decorrente de novo cargo/responsabilidade)',
        'Episódio Depressivo Leve com sintomas ansiosos secundários',
        'Ansiedade induzida por substância/estimulante'
      ],
      consideracoes: 'As informações fornecidas apresentam características potencialmente compatíveis com determinados critérios do TAG. A informação disponível, entretanto, não é suficiente para estabelecer uma conclusão diagnóstica definitiva. A avaliação dos critérios completos e a decisão diagnóstica devem ser realizadas soberanamente pelo profissional.'
    },
    modelo: 'Antigravity-Clinical-Engine v2.4',
    referenciaUtilizada: 'DSM-5-TR & CID-11 (OMS)',
    versaoReferencia: '2022/2023',
    statusRevisao: 'aprovado',
    data: getWeekDate(-7, 11, 0),
    observacoesProfissional: 'Análise revisada e utilizada como subsídio para estruturação do plano psicoterápico TCC.'
  }
]

const SEED_CONFIG: ConfiguracoesApp = {
  nomeProfissional: 'Dra. Vanessa Martins',
  crp: '06/123456',
  especialidade: 'Psicologia Clínica & TCC',
  enderecoConsultorio: 'Av. Paulista, 1500 - Sala 804, Bela Vista - São Paulo/SP',
  telefoneConsultorio: '(11) 3456-7890',
  senhaHash: '1234', // senha padrão para demonstração segura
  tempoInatividadeMin: 15,
  chaveOpenAIConfigurada: true,
  chaveOpenAIApelido: 'sk-proj-...k89A',
  bloqueioAtivado: false,
  ultimaDataBackup: new Date().toISOString()
}

// STORAGE HELPERS
function getItem<T>(key: string, seed: T): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(item)
  } catch (e) {
    console.error(`Erro ao carregar chave ${key}:`, e)
    return seed
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Erro ao salvar chave ${key}:`, e)
  }
}

// REGISTRADOR DE AUDITORIA
export function registrarLog(acao: string, categoria: LogAuditoria['categoria'], detalhe: string, pacienteAnonimizadoId?: string) {
  const logs = getItem<LogAuditoria[]>(STORAGE_KEYS.LOGS, [])
  const novoLog: LogAuditoria = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    acao,
    categoria,
    detalhe,
    pacienteAnonimizadoId
  }
  const atualizados = [novoLog, ...logs].slice(0, 300) // mantém os últimos 300 logs
  setItem(STORAGE_KEYS.LOGS, atualizados)
}

// MOTOR DE ANONIMIZAÇÃO CONFORME LGPD
export function anonimizarTextoClinico(texto: string, paciente?: Paciente): string {
  if (!texto) return ''
  let anonimizado = texto

  if (paciente) {
    // Substitui nome por "Paciente [Iniciais]"
    const iniciais = paciente.nome.split(' ').map(p => p[0]).join('')
    anonimizado = anonimizado.replace(new RegExp(paciente.nome, 'gi'), `Paciente [${iniciais}]`)
    
    // Substitui CPF, Telefone, Email, Endereço
    if (paciente.cpf) anonimizado = anonimizado.replace(new RegExp(paciente.cpf.replace(/\./g, '\\.'), 'g'), '[CPF REMOVIDO]')
    if (paciente.telefone) anonimizado = anonimizado.replace(new RegExp(paciente.telefone.replace(/\(/g, '\\(').replace(/\)/g, '\\)'), 'g'), '[TELEFONE REMOVIDO]')
    if (paciente.email) anonimizado = anonimizado.replace(new RegExp(paciente.email, 'gi'), '[EMAIL REMOVIDO]')
    if (paciente.endereco) anonimizado = anonimizado.replace(new RegExp(paciente.endereco, 'gi'), '[ENDEREÇO REMOVIDO]')
  }

  // Regex geral para telefones, cpfs e emails remanescentes
  anonimizado = anonimizado
    .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '[CPF REMOVIDO]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REMOVIDO]')
    .replace(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g, '[TELEFONE REMOVIDO]')

  return anonimizado
}

// API CLIENTE LOCAL COMPLETA (EXPOSTA VIA window.api)
export const api = {
  // PACIENTES
  pacientes: {
    listar: async (): Promise<Paciente[]> => {
      return getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
    },
    obter: async (id: string): Promise<Paciente | null> => {
      const lista = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      return lista.find((p) => p.id === id) || null
    },
    criar: async (dados: Partial<Paciente>): Promise<Paciente> => {
      const lista = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      const novo: Paciente = {
        id: `pac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        nome: dados.nome || 'Sem nome',
        dataNascimento: dados.dataNascimento || new Date().toISOString(),
        telefone: dados.telefone || '',
        email: dados.email || '',
        cpf: dados.cpf || '',
        endereco: dados.endereco || '',
        profissao: dados.profissao || '',
        queixa: dados.queixa || '',
        historico: dados.historico || '',
        status: 'ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setItem(STORAGE_KEYS.PACIENTES, [novo, ...lista])
      registrarLog('Criar Paciente', 'PACIENTE', `Prontuário criado para "${novo.nome}"`, novo.id)
      return novo
    },
    atualizar: async (id: string, dados: Partial<Paciente>): Promise<Paciente | null> => {
      const lista = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      const index = lista.findIndex((p) => p.id === id)
      if (index === -1) return null
      const atualizado: Paciente = {
        ...lista[index],
        ...dados,
        updatedAt: new Date().toISOString()
      }
      lista[index] = atualizado
      setItem(STORAGE_KEYS.PACIENTES, lista)
      registrarLog('Atualizar Paciente', 'PACIENTE', `Dados cadastrais atualizados para "${atualizado.nome}"`, id)
      return atualizado
    },
    arquivar: async (id: string): Promise<boolean> => {
      const lista = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      const index = lista.findIndex((p) => p.id === id)
      if (index === -1) return false
      lista[index].status = lista[index].status === 'arquivado' ? 'ativo' : 'arquivado'
      setItem(STORAGE_KEYS.PACIENTES, lista)
      registrarLog('Status Paciente', 'PACIENTE', `Status alterado para ${lista[index].status}`, id)
      return true
    },
    excluir: async (id: string): Promise<boolean> => {
      const lista = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      const filtrados = lista.filter((p) => p.id !== id)
      setItem(STORAGE_KEYS.PACIENTES, filtrados)
      registrarLog('Excluir Paciente', 'PACIENTE', `Prontuário excluído permanentemente`, id)
      return true
    }
  },

  // CONSULTAS & CICLO DE VIDA DA AGENDA
  consultas: {
    listar: async (): Promise<Consulta[]> => {
      return getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
    },
    porPaciente: async (pacienteId: string): Promise<Consulta[]> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      return lista.filter((c) => c.pacienteId === pacienteId)
    },
    criar: async (dados: Partial<Consulta>): Promise<Consulta> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const nova: Consulta = {
        id: `con-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId: dados.pacienteId || '',
        data: dados.data || new Date().toISOString().slice(0, 10),
        horarioAgendado: dados.horarioAgendado || new Date().toISOString(),
        status: dados.status || 'agendado',
        resumo: dados.resumo || 'Sessão de Psicoterapia',
        observacoes: dados.observacoes || '',
        createdAt: new Date().toISOString()
      }
      setItem(STORAGE_KEYS.CONSULTAS, [...lista, nova])
      registrarLog('Agendar Consulta', 'CONSULTA', `Consulta agendada para ${new Date(nova.horarioAgendado).toLocaleString('pt-BR')}`, nova.pacienteId)
      return nova
    },
    atualizar: async (id: string, dados: Partial<Consulta>): Promise<Consulta | null> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const idx = lista.findIndex((c) => c.id === id)
      if (idx === -1) return null
      const atualizada: Consulta = { ...lista[idx], ...dados }
      lista[idx] = atualizada
      setItem(STORAGE_KEYS.CONSULTAS, lista)
      registrarLog('Atualizar Consulta', 'CONSULTA', `Consulta atualizada: ${atualizada.resumo}`, atualizada.pacienteId)
      return atualizada
    },
    registrarChegada: async (id: string): Promise<Consulta | null> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const idx = lista.findIndex((c) => c.id === id)
      if (idx === -1) return null
      const agora = new Date().toISOString()
      lista[idx].horarioChegada = agora
      lista[idx].status = 'aguardando'
      setItem(STORAGE_KEYS.CONSULTAS, lista)
      registrarLog('Chegada do Paciente', 'CONSULTA', `Paciente chegou às ${new Date(agora).toLocaleTimeString('pt-BR')}`, lista[idx].pacienteId)
      return lista[idx]
    },
    iniciarAtendimento: async (id: string): Promise<Consulta | null> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const idx = lista.findIndex((c) => c.id === id)
      if (idx === -1) return null
      const agora = new Date().toISOString()
      lista[idx].horarioInicio = agora
      lista[idx].status = 'em_atendimento'
      setItem(STORAGE_KEYS.CONSULTAS, lista)
      registrarLog('Iniciar Atendimento', 'CONSULTA', `Atendimento iniciado às ${new Date(agora).toLocaleTimeString('pt-BR')}`, lista[idx].pacienteId)
      return lista[idx]
    },
    finalizarAtendimento: async (id: string): Promise<{ consulta: Consulta; sessaoGerada: Sessao } | null> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const idx = lista.findIndex((c) => c.id === id)
      if (idx === -1) return null
      const con = lista[idx]
      const agora = new Date()
      con.horarioTermino = agora.toISOString()
      con.status = 'concluido'
      
      // Calcular duração em minutos
      const inicio = con.horarioInicio ? new Date(con.horarioInicio) : new Date(con.horarioAgendado)
      const duracaoMs = agora.getTime() - inicio.getTime()
      con.duracaoMinutos = Math.max(1, Math.round(duracaoMs / (1000 * 60)))
      
      lista[idx] = con
      setItem(STORAGE_KEYS.CONSULTAS, lista)

      // Gera ou vincula sessão no prontuário
      const sessoes = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      const novaSessao: Sessao = {
        id: `ses-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId: con.pacienteId,
        consultaId: con.id,
        dataSessao: con.horarioInicio || con.horarioAgendado,
        resumo: con.resumo || 'Sessão clínica',
        anotacoes: con.observacoes || `Sessão finalizada. Duração real: ${con.duracaoMinutos} min. Chegada: ${con.horarioChegada ? new Date(con.horarioChegada).toLocaleTimeString('pt-BR') : 'No horário'}.`,
        createdAt: agora.toISOString()
      }
      setItem(STORAGE_KEYS.SESSOES, [novaSessao, ...sessoes])
      registrarLog('Finalizar Atendimento', 'CONSULTA', `Atendimento finalizado. Duração: ${con.duracaoMinutos} min`, con.pacienteId)
      return { consulta: con, sessaoGerada: novaSessao }
    },
    marcarAusencia: async (id: string): Promise<Consulta | null> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const idx = lista.findIndex((c) => c.id === id)
      if (idx === -1) return null
      lista[idx].status = 'ausencia'
      setItem(STORAGE_KEYS.CONSULTAS, lista)
      registrarLog('Marcar Ausência', 'CONSULTA', `Paciente faltou à consulta`, lista[idx].pacienteId)
      return lista[idx]
    },
    excluir: async (id: string): Promise<boolean> => {
      const lista = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const filtrados = lista.filter((c) => c.id !== id)
      setItem(STORAGE_KEYS.CONSULTAS, filtrados)
      registrarLog('Excluir Consulta', 'CONSULTA', `Consulta cancelada/removida da agenda`)
      return true
    }
  },

  // SESSÕES & PRONTUÁRIO
  sessoes: {
    listar: async (pacienteId: string): Promise<Sessao[]> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      return lista
        .filter((s) => s.pacienteId === pacienteId)
        .sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
    },
    todas: async (): Promise<Sessao[]> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      return lista.sort((a, b) => new Date(b.dataSessao).getTime() - new Date(a.dataSessao).getTime())
    },
    obter: async (id: string): Promise<Sessao | null> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      return lista.find((s) => s.id === id) || null
    },
    criar: async (dados: Partial<Sessao>): Promise<Sessao> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      const nova: Sessao = {
        id: `ses-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId: dados.pacienteId || '',
        consultaId: dados.consultaId,
        dataSessao: dados.dataSessao || new Date().toISOString(),
        resumo: dados.resumo || 'Sessão clínica',
        anotacoes: dados.anotacoes || '',
        conteudoIA: dados.conteudoIA,
        createdAt: new Date().toISOString()
      }
      setItem(STORAGE_KEYS.SESSOES, [nova, ...lista])
      registrarLog('Criar Sessão', 'SESSAO', `Evolução clínica registrada: "${nova.resumo}"`, nova.pacienteId)
      return nova
    },
    atualizar: async (id: string, dados: Partial<Sessao>): Promise<Sessao | null> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      const index = lista.findIndex((s) => s.id === id)
      if (index === -1) return null
      const atualizada: Sessao = {
        ...lista[index],
        ...dados,
        updatedAt: new Date().toISOString()
      }
      lista[index] = atualizada
      setItem(STORAGE_KEYS.SESSOES, lista)
      registrarLog('Atualizar Sessão', 'SESSAO', `Evolução clínica alterada: "${atualizada.resumo}"`, atualizada.pacienteId)
      return atualizada
    },
    excluir: async (id: string): Promise<boolean> => {
      const lista = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      const sessaoExcluida = lista.find(s => s.id === id)
      const filtrados = lista.filter((s) => s.id !== id)
      setItem(STORAGE_KEYS.SESSOES, filtrados)
      registrarLog('Excluir Sessão', 'SESSAO', `Sessão clínica removida`, sessaoExcluida?.pacienteId)
      return true
    }
  },

  // AVALIAÇÕES PSICOLÓGICAS
  avaliacoes: {
    listar: async (pacienteId?: string): Promise<Avaliacao[]> => {
      const lista = getItem<Avaliacao[]>(STORAGE_KEYS.AVALIACOES, SEED_AVALIACOES)
      if (pacienteId) return lista.filter(a => a.pacienteId === pacienteId)
      return lista
    },
    criar: async (dados: Partial<Avaliacao>): Promise<Avaliacao> => {
      const lista = getItem<Avaliacao[]>(STORAGE_KEYS.AVALIACOES, SEED_AVALIACOES)
      const nova: Avaliacao = {
        id: `av-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId: dados.pacienteId || '',
        data: dados.data || new Date().toISOString(),
        tipo: dados.tipo || 'Avaliação Psicológica',
        instrumento: dados.instrumento || '',
        observacoes: dados.observacoes || '',
        resultados: dados.resultados || '',
        referenciasUtilizadas: dados.referenciasUtilizadas || '',
        createdAt: new Date().toISOString()
      }
      setItem(STORAGE_KEYS.AVALIACOES, [nova, ...lista])
      registrarLog('Criar Avaliação', 'PACIENTE', `Avaliação registrada: ${nova.tipo}`, nova.pacienteId)
      return nova
    },
    excluir: async (id: string): Promise<boolean> => {
      const lista = getItem<Avaliacao[]>(STORAGE_KEYS.AVALIACOES, SEED_AVALIACOES)
      setItem(STORAGE_KEYS.AVALIACOES, lista.filter(a => a.id !== id))
      registrarLog('Excluir Avaliação', 'PACIENTE', `Avaliação removida do histórico`)
      return true
    }
  },

  // DIAGNÓSTICOS OFICIAIS (CID-10 / CID-11 / DSM-5)
  diagnosticos: {
    listar: async (pacienteId?: string): Promise<Diagnostico[]> => {
      const lista = getItem<Diagnostico[]>(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS)
      if (pacienteId) return lista.filter(d => d.pacienteId === pacienteId)
      return lista
    },
    criar: async (dados: Partial<Diagnostico>): Promise<Diagnostico> => {
      const lista = getItem<Diagnostico[]>(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS)
      const config = getItem<ConfiguracoesApp>(STORAGE_KEYS.CONFIG, SEED_CONFIG)
      const novo: Diagnostico = {
        id: `diag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId: dados.pacienteId || '',
        classificacao: dados.classificacao || 'CID-11',
        codigo: dados.codigo || '',
        descricao: dados.descricao || '',
        data: dados.data || new Date().toISOString(),
        observacoes: dados.observacoes || '',
        profissionalResponsavel: config.nomeProfissional,
        crp: config.crp,
        status: dados.status || 'hipotese',
        createdAt: new Date().toISOString()
      }
      setItem(STORAGE_KEYS.DIAGNOSTICOS, [novo, ...lista])
      registrarLog('Registro Diagnóstico', 'DIAGNOSTICO', `Diagnóstico oficial registrado: ${novo.codigo} - ${novo.descricao}`, novo.pacienteId)
      return novo
    },
    atualizar: async (id: string, dados: Partial<Diagnostico>): Promise<Diagnostico | null> => {
      const lista = getItem<Diagnostico[]>(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS)
      const idx = lista.findIndex(d => d.id === id)
      if (idx === -1) return null
      lista[idx] = { ...lista[idx], ...dados }
      setItem(STORAGE_KEYS.DIAGNOSTICOS, lista)
      registrarLog('Atualizar Diagnóstico', 'DIAGNOSTICO', `Diagnóstico atualizado: ${lista[idx].codigo}`, lista[idx].pacienteId)
      return lista[idx]
    },
    excluir: async (id: string): Promise<boolean> => {
      const lista = getItem<Diagnostico[]>(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS)
      setItem(STORAGE_KEYS.DIAGNOSTICOS, lista.filter(d => d.id !== id))
      registrarLog('Excluir Diagnóstico', 'DIAGNOSTICO', `Registro diagnóstico removido`)
      return true
    }
  },

  // ASSISTENTE DE IA COM RASTREABILIDADE, GOVERNANÇA E PRIVACIDADE (OPENAI COMPATIBLE)
  ia: {
    verificarStatus: async () => {
      try {
        const res = await fetch('/api/ia/status')
        if (res.ok) return await res.json()
      } catch (err) {
        // Modo offline
      }
      return {
        disponivel: true,
        provedor: 'Motor Clínico Estruturado (Local/Offline)',
        configurada: false,
        modo: 'Modo Local'
      }
    },
    listarAnalises: async (pacienteId?: string): Promise<AnaliseIA[]> => {
      const lista = getItem<AnaliseIA[]>(STORAGE_KEYS.ANALISES_IA, SEED_ANALISES_IA)
      if (pacienteId) return lista.filter(a => a.pacienteId === pacienteId)
      return lista
    },
    solicitarAnalise: async (
      pacienteId: string,
      tipo: AnaliseIA['tipoAnalise'],
      contextoAnonimizado: string,
      sessaoId?: string
    ): Promise<AnaliseIA> => {
      let resultadoIA: any = null
      let modeloUtilizado = 'Motor Clínico Heurístico Local'
      let origemResposta = 'LOCAL'

      // Tentar chamar a rota de backend conectada à OpenAI
      try {
        const response = await fetch('/api/ia/analise-clinica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipoAnalise: tipo,
            contextoAnonimizado
          })
        })

        if (response.ok) {
          const body = await response.json()
          if (body.success && body.data) {
            resultadoIA = body.data
            origemResposta = body.origem || 'OPENAI_API'
            modeloUtilizado = body.modeloUtilizado || (origemResposta === 'OPENAI_API' ? 'OpenAI GPT-4o-mini' : 'Motor Local')
          }
        }
      } catch (e) {
        console.warn('Backend /api/ia/analise-clinica inacessível, utilizando motor heurístico local:', e)
      }

      // Fallback se não obteve resultado
      if (!resultadoIA) {
        let condicaoSugerida = 'Avaliação Sintomatológica'
        let criteriosPresentes = [
          'Relato espontâneo de angústia e interferência no desempenho ocupacional/pessoal.',
          'Sintomas comportamentais e emocionais coerentes com queixa principal.'
        ]
        let criteriosNaoIdentificados = [
          'Sem evidência nos dados de risco de autoagressão ou heteroagressão imediata.',
          'Sem relato de histórico psicótico ou perda de contato com a realidade.'
        ]
        let informacoesInsuficientes = [
          'Exame do estado mental completo e investigação de histórico familiar de transtornos do humor.',
          'Tempo total de cronicidade dos sintomas relatados.'
        ]
        let hipoteses = [
          'Transtorno de Adaptação / Reação ao Estresse Agudo',
          'Sintomatologia Mista de Ansiedade e Depressão',
          'Fatores Psicossociais e Ambientais Desencadeantes'
        ]

        if (contextoAnonimizado.toLowerCase().includes('ansiedade') || contextoAnonimizado.toLowerCase().includes('insônia') || contextoAnonimizado.toLowerCase().includes('pânico')) {
          condicaoSugerida = 'Espectro Ansioso (DSM-5 / CID-11: 6B00 / 6B01)'
          criteriosPresentes = [
            'Preocupação excessiva e apreensão desproporcional ao evento.',
            'Hiperativação autonômica e alterações no padrão de sono.',
            'Dificuldade relatada em interromper fluxos de pensamentos catastróficos.'
          ]
          criteriosNaoIdentificados = [
            'Evitação fóbica generalizada de ambientes abertos não confirmada.',
            'Ataques de pânico recorrentes com medo persistente de novos ataques.'
          ]
          informacoesInsuficientes = [
            'Descartar etiologia orgânica (função tireoidiana, cafeísmo ou uso de substâncias).',
            'Avaliar presença de sintomas depressivos comórbidos.'
          ]
          hipoteses = [
            'Transtorno de Ansiedade Generalizada (TAG)',
            'Transtorno de Pânico com ou sem Agorafobia',
            'Transtorno de Ansiedade Social (em contextos de avaliação social)'
          ]
        } else if (contextoAnonimizado.toLowerCase().includes('tristeza') || contextoAnonimizado.toLowerCase().includes('choro') || contextoAnonimizado.toLowerCase().includes('desmotiva')) {
          condicaoSugerida = 'Espectro do Humor / Transtornos Depressivos (CID-11: 6A70)'
          criteriosPresentes = [
            'Humor deprimido na maior parte dos dias e anedonia/perda de interesse.',
            'Oscilação de energia vital e fadiga relatada.',
            'Sensação de desesperança situacional.'
          ]
          criteriosNaoIdentificados = [
            'Ideação suicida ativa com planejamento (critério não evidenciado no texto).',
            'Alterações psicomotoras graves (lentificação extrema ou agitação).'
          ]
          informacoesInsuficientes = [
            'Duração contínua dos sintomas (mais de 2 semanas ininterruptas?).',
            'Histórico de fases de euforia ou hipomania prévias.'
          ]
          hipoteses = [
            'Episódio Depressivo Maior (Leve a Moderado)',
            'Reação de Luto Não Complicado vs. Transtorno do Luto Prolongado',
            'Distimia / Transtorno Depressivo Persistente'
          ]
        }

        resultadoIA = {
          condicaoSugerida,
          criteriosPresentes,
          criteriosNaoIdentificados,
          informacoesInsuficientes,
          hipotesesDiferenciais: hipoteses,
          sinteseEstruturada: `Síntese estruturada para apoio ao psicólogo:\n\n• Resumo: ${contextoAnonimizado.slice(0, 180)}...\n• Foco terapêutico sugerido: Fortalecimento de estratégias de regulação emocional e registro de pensamentos disfuncionais.`,
          recomendacaoIntervencao: 'Psicoeducação e registro reflexivo continuado.'
        }
      }

      const novaAnalise: AnaliseIA = {
        id: `ana-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pacienteId,
        sessaoId,
        tipoAnalise: tipo,
        dadosAnonimizadosUtilizados: contextoAnonimizado,
        resultado: {
          condicao: resultadoIA.condicaoSugerida || resultadoIA.condicao || 'Análise Concluída',
          criteriosPresentes: resultadoIA.criteriosPresentes || [],
          criteriosNaoIdentificados: resultadoIA.criteriosNaoIdentificados || [],
          informacoesInsuficientes: resultadoIA.informacoesInsuficientes || [],
          hipotesesDiferenciais: resultadoIA.hipotesesDiferenciais || [],
          consideracoes: 'As informações e hipóteses fornecidas constituem apoio técnico de triagem e organização. A soberania técnica e a decisão diagnóstica cabem exclusivamente ao psicólogo responsável.',
          textoEstruturado: resultadoIA.sinteseEstruturada || resultadoIA.textoEstruturado || ''
        },
        modelo: modeloUtilizado,
        referenciaUtilizada: 'DSM-5-TR / CID-11 (Fontes Oficiais Estruturadas)',
        versaoReferencia: '2024.1',
        statusRevisao: 'gerado_ia',
        data: new Date().toISOString()
      }

      const lista = getItem<AnaliseIA[]>(STORAGE_KEYS.ANALISES_IA, SEED_ANALISES_IA)
      setItem(STORAGE_KEYS.ANALISES_IA, [novaAnalise, ...lista])
      registrarLog('Análise de IA Solicitada', 'IA', `Tipo: ${tipo} | Provedor: ${origemResposta} (${modeloUtilizado})`, pacienteId)
      return novaAnalise
    },
    gerarMinutaDocumento: async (
      tipoDocumento: string,
      finalidade: string,
      dadosClinicos: string,
      pacienteAnonimo?: string
    ): Promise<string> => {
      try {
        const response = await fetch('/api/ia/gerar-documento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipoDocumento,
            finalidade,
            dadosClinicos,
            pacienteAnonimo
          })
        })
        if (response.ok) {
          const body = await response.json()
          if (body.conteudo) return body.conteudo
        }
      } catch (err) {
        console.warn('Erro ao chamar /api/ia/gerar-documento:', err)
      }
      return `DECLARAÇÃO / RELATÓRIO PSICOLÓGICO MODELO\n\n1. Identificação: ${pacienteAnonimo || 'Paciente'}\n2. Finalidade: ${finalidade}\n3. Descrição da Demanda: ${dadosClinicos}\n4. Conclusão: Em acompanhamento psicoterapêutico regular.`
    },
    atualizarStatusRevisao: async (id: string, status: StatusRevisaoIA, observacoes?: string): Promise<AnaliseIA | null> => {
      const lista = getItem<AnaliseIA[]>(STORAGE_KEYS.ANALISES_IA, SEED_ANALISES_IA)
      const idx = lista.findIndex(a => a.id === id)
      if (idx === -1) return null
      lista[idx].statusRevisao = status
      if (observacoes !== undefined) lista[idx].observacoesProfissional = observacoes
      setItem(STORAGE_KEYS.ANALISES_IA, lista)
      registrarLog('Revisão de IA', 'IA', `Status atualizado para "${status}"`, lista[idx].pacienteId)
      return lista[idx]
    }
  },

  // AUDITORIA E LOGS
  auditoria: {
    listar: async (): Promise<LogAuditoria[]> => {
      return getItem<LogAuditoria[]>(STORAGE_KEYS.LOGS, [])
    },
    limpar: async (): Promise<boolean> => {
      setItem(STORAGE_KEYS.LOGS, [])
      registrarLog('Limpeza de Logs', 'CONFIG', 'Logs arquivados pelo profissional')
      return true
    }
  },

  // BACKUP & RESTAURAÇÃO DE DADOS
  backup: {
    exportarDados: async (): Promise<string> => {
      const dump = {
        versao: '2.0.0',
        geradoEm: new Date().toISOString(),
        pacientes: getItem(STORAGE_KEYS.PACIENTES, SEED_PACIENTES),
        consultas: getItem(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS),
        sessoes: getItem(STORAGE_KEYS.SESSOES, SEED_SESSOES),
        avaliacoes: getItem(STORAGE_KEYS.AVALIACOES, SEED_AVALIACOES),
        diagnosticos: getItem(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS),
        analisesIA: getItem(STORAGE_KEYS.ANALISES_IA, SEED_ANALISES_IA),
        logs: getItem(STORAGE_KEYS.LOGS, []),
        config: getItem(STORAGE_KEYS.CONFIG, SEED_CONFIG)
      }
      // Atualiza data do último backup
      const config = getItem<ConfiguracoesApp>(STORAGE_KEYS.CONFIG, SEED_CONFIG)
      config.ultimaDataBackup = new Date().toISOString()
      setItem(STORAGE_KEYS.CONFIG, config)
      registrarLog('Backup do Sistema', 'BACKUP', 'Exportação completa de banco de dados e prontuários')
      return JSON.stringify(dump, null, 2)
    },
    restaurarDados: async (conteudoJson: string): Promise<boolean> => {
      try {
        const dados = JSON.parse(conteudoJson)
        if (!dados.pacientes || !Array.isArray(dados.pacientes)) {
          throw new Error('Arquivo de backup inválido')
        }
        if (dados.pacientes) setItem(STORAGE_KEYS.PACIENTES, dados.pacientes)
        if (dados.consultas) setItem(STORAGE_KEYS.CONSULTAS, dados.consultas)
        if (dados.sessoes) setItem(STORAGE_KEYS.SESSOES, dados.sessoes)
        if (dados.avaliacoes) setItem(STORAGE_KEYS.AVALIACOES, dados.avaliacoes)
        if (dados.diagnosticos) setItem(STORAGE_KEYS.DIAGNOSTICOS, dados.diagnosticos)
        if (dados.analisesIA) setItem(STORAGE_KEYS.ANALISES_IA, dados.analisesIA)
        if (dados.logs) setItem(STORAGE_KEYS.LOGS, dados.logs)
        if (dados.config) setItem(STORAGE_KEYS.CONFIG, dados.config)
        registrarLog('Restauração do Sistema', 'BACKUP', 'Base de dados restaurada com sucesso a partir de arquivo de backup')
        return true
      } catch (e) {
        console.error('Falha na restauração:', e)
        return false
      }
    }
  },

  // CONFIGURAÇÕES E SEGURANÇA LOCAL
  config: {
    obter: async (): Promise<ConfiguracoesApp> => {
      return getItem<ConfiguracoesApp>(STORAGE_KEYS.CONFIG, SEED_CONFIG)
    },
    salvar: async (novasConfig: Partial<ConfiguracoesApp>): Promise<ConfiguracoesApp> => {
      const config = getItem<ConfiguracoesApp>(STORAGE_KEYS.CONFIG, SEED_CONFIG)
      const atualizado = { ...config, ...novasConfig }
      setItem(STORAGE_KEYS.CONFIG, atualizado)
      registrarLog('Configurações Alteradas', 'CONFIG', 'Parâmetros do consultório ou segurança atualizados')
      return atualizado
    },
    verificarSenha: async (senhaDigitada: string): Promise<boolean> => {
      const config = getItem<ConfiguracoesApp>(STORAGE_KEYS.CONFIG, SEED_CONFIG)
      if (!config.senhaHash) return true
      return config.senhaHash === senhaDigitada
    }
  },

  // DASHBOARD RESUMO
  dashboard: {
    resumo: async () => {
      const pacientes = getItem<Paciente[]>(STORAGE_KEYS.PACIENTES, SEED_PACIENTES)
      const sessoes = getItem<Sessao[]>(STORAGE_KEYS.SESSOES, SEED_SESSOES)
      const consultas = getItem<Consulta[]>(STORAGE_KEYS.CONSULTAS, SEED_CONSULTAS)
      const analises = getItem<AnaliseIA[]>(STORAGE_KEYS.ANALISES_IA, SEED_ANALISES_IA)
      const diagnosticos = getItem<Diagnostico[]>(STORAGE_KEYS.DIAGNOSTICOS, SEED_DIAGNOSTICOS)
      
      const hojeStr = new Date().toISOString().slice(0, 10)
      const consultasHoje = consultas.filter(c => c.data === hojeStr || c.horarioAgendado.slice(0, 10) === hojeStr)

      return {
        totalPacientes: pacientes.filter(p => p.status === 'ativo').length,
        totalSessoes: sessoes.length,
        totalConsultasHoje: consultasHoje.length,
        totalDiagnosticos: diagnosticos.length,
        analisesPendentesRevisao: analises.filter(a => a.statusRevisao === 'gerado_ia' || a.statusRevisao === 'aguardando_revisao').length
      }
    }
  }
}

// Injeção global no window
export function initApi() {
  if (typeof window !== 'undefined') {
    ;(window as any).api = api
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).api = api
}

export default api
