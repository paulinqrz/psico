import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Standard .env loading (dotenv.config() defaults to .env in cwd)
dotenv.config();

import express from 'express';
import OpenAI from 'openai';
// Vite import will be dynamic to avoid require('vite') in production

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const DB_FILE = path.join(process.cwd(), 'db.json');
  
  app.get('/api/db', (req, res) => {
    try {
      if (!fs.existsSync(DB_FILE)) {
        return res.json({});
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch(e) {
      res.json({});
    }
  });

  app.post('/api/db', (req, res) => {
    try {
      const { key, value } = req.body;
      let db = {};
      if (fs.existsSync(DB_FILE)) {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      }
      db[key] = value;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      res.json({ success: true });
    } catch(e) {
      res.status(500).json({ success: false });
    }
  });


  // Helper para cliente OpenAI seguro e preguiçoso (lazy init)
  function getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({ apiKey });
  }

  // --- ROTA DE STATUS DA IA ---
  app.get('/api/ia/status', (req, res) => {
    const hasKey = !!process.env.OPENAI_API_KEY;
    res.json({
      disponivel: true,
      provedor: 'OpenAI (GPT-4o / GPT-4o-mini)',
      configurada: hasKey,
      modo: hasKey ? 'OpenAI Cloud (Ativo)' : 'Modo Heurístico / Local (Fallback)'
    });
  });

  // --- ROTA DE ANÁLISE CLÍNICA ÉTICA DA OPENAI ---
  app.post('/api/ia/analise-clinica', async (req, res) => {
    try {
      const { tipoAnalise, contextoAnonimizado, pacienteContexto, modelo } = req.body;

      if (!contextoAnonimizado || contextoAnonimizado.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'O texto clínico para análise não pode estar vazio.'
        });
      }

      const client = getOpenAIClient();

      // Se a chave não estiver configurada no servidor, usar o motor heurístico estruturado
      if (!client) {
        return res.json({
          success: true,
          origem: 'LOCAL_HEURISTICO',
          aviso: 'Chave OPENAI_API_KEY não configurada. Resposta gerada via motor heurístico clínico local.',
          data: gerarAnaliseHeuristica(tipoAnalise, contextoAnonimizado)
        });
      }

      // Instrução do sistema com rigor ético CFP (Resolução CFP 06/2019) e Psicopatologia
      const systemPrompt = `Você é um assistente técnico especializado em psicologia clínica, psicopatologia (DSM-5-TR e CID-11) e elaboração de documentos psicológicos (Resolução CFP nº 06/2019).
Sua função é EXCLUSIVAMENTE apoiar o psicólogo humano com reflexões, organização de notas e mapeamento de hipóteses.
NUNCA feche diagnósticos de maneira categórica ou definitiva. Trate tudo como "hipóteses a verificar" e destaque "critérios ausentes ou insuficientes".

Você DEVE responder ESTRITAMENTE em formato JSON com o seguinte esquema:
{
  "condicaoSugerida": "string (ex: Hipótese Diagnóstica / Síntese Clínica de Transtorno...)",
  "criteriosPresentes": ["string com critérios observados nos dados clínicos"],
  "criteriosNaoIdentificados": ["string com critérios não descritos ou ausentes"],
  "informacoesInsuficientes": ["string com aspectos fundamentais a aprofundar nas próximas sessões"],
  "hipotesesDiferenciais": ["string com outros diagnósticos a considerar e descartar"],
  "sinteseEstruturada": "string detalhada contendo Subjetivo, Objetivo, Avaliação Terapêutica e Plano de Ação",
  "recomendacaoIntervencao": "string com técnicas e intervenções baseadas em evidências (ex: TCC, ACT, Psicanálise)"
}`;

      const userPrompt = `Tipo de Análise Solicitada: ${tipoAnalise || 'ANAMNESE'}
${pacienteContexto ? `Contexto do Caso: ${JSON.stringify(pacienteContexto)}` : ''}

Dados Clínicos Anonimizados para Análise:
"""
${contextoAnonimizado}
"""

Gere a análise em JSON estrito.`;

      const completion = await client.chat.completions.create({
        model: modelo || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 2000
      });

      const rawContent = completion.choices[0]?.message?.content || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(rawContent);
      } catch (parseErr) {
        parsedData = {
          condicaoSugerida: 'Análise Concluída',
          sinteseEstruturada: rawContent,
          criteriosPresentes: [],
          criteriosNaoIdentificados: [],
          informacoesInsuficientes: [],
          hipotesesDiferenciais: [],
          recomendacaoIntervencao: ''
        };
      }

      return res.json({
        success: true,
        origem: 'OPENAI_API',
        modeloUtilizado: completion.model,
        data: parsedData
      });
    } catch (error: any) {
      console.error('Erro na API OpenAI:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao processar análise com a OpenAI.'
      });
    }
  });

  // --- ROTA PARA GERAÇÃO/REFINAMENTO DE DOCUMENTOS PSICOLÓGICOS (RESOLUÇÃO CFP 06/2019) ---
  app.post('/api/ia/gerar-documento', async (req, res) => {
    try {
      const { tipoDocumento, finalidade, dadosClinicos, pacienteAnonimo } = req.body;
      const client = getOpenAIClient();

      if (!client) {
        return res.json({
          success: true,
          origem: 'LOCAL_MODELO',
          conteudo: `[DOCUMENTO PSICOLÓGICO MODELO - ${tipoDocumento}]\n\nFINALIDADE: ${finalidade}\n\n1. IDENTIFICAÇÃO:\nPaciente: ${pacienteAnonimo || '[NOME DO PACIENTE]'}\n\n2. DESCRIÇÃO DA DEMANDA:\n${dadosClinicos}\n\n3. PROCEDIMENTO:\nForam realizadas sessões de psicoterapia clínica...\n\n4. ANÁLISE:\nObserva-se evolução no quadro clínico...\n\n5. CONCLUSÃO:\nEncaminhamento / Recomendações.\n\n(Revisão e assinatura profissional obrigatórias)`
        });
      }

      const prompt = `Você é um perito em redação de documentos psicológicos conforme a Resolução CFP nº 06/2019.
Redija a minuta de um(a) "${tipoDocumento}" com a finalidade: "${finalidade}".
Dados clínicos:
${dadosClinicos}

Mantenha tom estritamente técnico, ético, objetivo e respeitoso. Não adicione dados inventados não fornecidos nos dados clínicos.`;

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você redige minutas de documentos psicológicos éticos segundo as normas do CFP.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      });

      return res.json({
        success: true,
        origem: 'OPENAI_API',
        conteudo: completion.choices[0]?.message?.content || ''
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao redigir documento com a OpenAI.'
      });
    }
  });

  // --- ROTA DE CHAT INTERATIVO ---
  app.post('/api/ia/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      const client = getOpenAIClient();

      if (!client) {
        return res.json({
          success: true,
          message: { role: 'assistant', content: '[MODO OFFLINE] A chave da OpenAI não está configurada no servidor. Configure a chave para conversar comigo de verdade.' }
        });
      }

      const systemMessage = {
        role: 'system',
        content: 'Você é um assistente especializado em psicologia clínica. Responda de forma ética, profissional e acolhedora, auxiliando o psicólogo em suas reflexões e dúvidas.'
      };

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...(messages || [])],
        temperature: 0.7
      });

      return res.json({
        success: true,
        message: completion.choices[0]?.message
      });
    } catch (error: any) {
      console.error('Erro no chat OpenAI:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Erro ao conversar com a OpenAI.'
      });
    }
  });

  // --- FALLBACK HEURÍSTICO LOCAL QUANDO OFFLINE OU SEM CHAVE ---
  function gerarAnaliseHeuristica(tipoAnalise: string, texto: string) {
    const lower = (texto || '').toLowerCase();
    const criterios: string[] = [];
    const ausentes: string[] = [];
    const insuficientes: string[] = [];
    const diferenciais: string[] = [];
    let condicao = 'Investigação Clínica Geral';

    if (lower.includes('ansiedade') || lower.includes('preocupa') || lower.includes('angústia') || lower.includes('taquicardia')) {
      condicao = 'Hipótese: Transtorno de Ansiedade Generalizada (DSM-5: 300.02 / CID-11: 6B00)';
      criterios.push('Relato de ansiedade e preocupação excessiva');
      criterios.push('Sintomatologia neurovegetativa ou inquietação');
      ausentes.push('Critério de duração contínua por no mínimo 6 meses não confirmada textualmente');
      ausentes.push('Exclusão de fatores tireoidianos ou uso de substâncias psicoativas');
      insuficientes.push('Impacto funcional específico em ambiente de trabalho/acadêmico');
      diferenciais.push('Transtorno de Pânico (DSM-5: 300.01)');
      diferenciais.push('Ansiedade Social (DSM-5: 300.23)');
    } else if (lower.includes('triste') || lower.includes('depress') || lower.includes('choro') || lower.includes('sono') || lower.includes('vazio')) {
      condicao = 'Hipótese: Episódio Depressivo Maior (DSM-5: 296.xx / CID-11: 6A70)';
      criterios.push('Humor deprimido ou anedonia relatada');
      criterios.push('Alterações no padrão de sono, energia ou disposição');
      ausentes.push('Investigação de episódios hipomaníacos prévios (para descartar Bipolaridade)');
      insuficientes.push('Presença ou ausência de ideação autolítica estruturada');
      diferenciais.push('Transtorno Depressivo Persistente / Distimia (DSM-5: 300.4)');
      diferenciais.push('Reação de Ajustamento com Humor Deprimido (CID-11: 6B43)');
    } else {
      condicao = 'Hipótese: Ajuste / Queixa Terapêutica Específica';
      criterios.push('Queixas associadas a estressores psicossociais');
      ausentes.push('Critérios de psicopatologia primária estruturada');
      insuficientes.push('Histórico familiar pregresso e rede de apoio social');
      diferenciais.push('Transtorno de Adaptação');
    }

    return {
      condicaoSugerida: condicao,
      criteriosPresentes: criterios,
      criteriosNaoIdentificados: ausentes,
      informacoesInsuficientes: insuficientes,
      hipotesesDiferenciais: diferenciais,
      sinteseEstruturada: `[SÍNTESE CLÍNICA AUXILIAR]\n• Subjetivo: O paciente relata vivências de sofrimento psíquico focadas em sua rotina.\n• Objetivo: Relato espontâneo em sessão terapêutica.\n• Avaliação: Identificam-se padrões cognitivos e emocionais compatíveis com a hipótese descrita.\n• Plano: Prosseguir com investigação diagnóstica aprofundada e intervenções psicoeducativas.`,
      recomendacaoIntervencao: 'Recomenda-se psicoeducação sobre regulação emocional, registro de pensamentos disfuncionais e estabelecimento de metas terapêuticas graduadas.'
    };
  }

  // --- VITE MIDDLEWARE (DEV) E ARQUIVOS ESTÁTICOS (PROD) ---
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Em produção (Electron ASAR), o server.cjs já está dentro da pasta dist
    const distPath = typeof __dirname !== 'undefined' ? __dirname : path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    const addr = server.address() as any;
    console.log(`Servidor Clínico Seguro rodando em http://localhost:${addr.port}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`Porta ${PORT} já está em uso! Tentando ligar de qualquer forma...`);
    }
  });
}

startServer();
