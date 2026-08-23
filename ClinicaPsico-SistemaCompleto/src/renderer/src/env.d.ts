/// <reference types="vite/client" />
interface Window {
  api: {
    dashboard: { resumo: () => Promise<any> };
    pacientes: {
      listar: () => Promise<any[]>;
      obter: (id: string) => Promise<any>;
      criar: (dados: any) => Promise<any>;
      atualizar: (id: string, dados: any) => Promise<any>;
      excluir: (id: string) => Promise<any>;
    };
    sessoes: {
      listar: (pacienteId: string) => Promise<any[]>;
      criar: (dados: any) => Promise<any>;
      excluir: (id: string) => Promise<any>;
    };
  }
}
