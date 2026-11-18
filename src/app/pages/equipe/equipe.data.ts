/** Integrante do grupo e o requisito do trabalho que ele apresenta. */
export interface Integrante {
  nome: string;
  papel: string;
  requisitos: string[];
  /** Onde o requisito está no código. */
  arquivos: string[];
  /** Onde o requisito aparece no app. */
  telas: string[];
}

export const EQUIPE: Integrante[] = [
  {
    nome: 'Arthur',
    papel: 'Arquitetura, telas e integração com a API',
    requisitos: ['Pages (Home + 3)', 'Service HttpClient (3+ GETs)', 'Parâmetro por rota'],
    arquivos: [
      'app.routes.ts',
      'core/services/brasil-api.service.ts',
      'pages/inicio, bancos, banco-detalhe, empresa-detalhe',
    ],
    telas: ['Início', 'Bancos', 'Detalhe do banco', 'Detalhe da empresa'],
  },
  {
    nome: 'Guilherme Juarez',
    papel: 'Favoritos',
    requisitos: ['2º service (localStorage)'],
    arquivos: ['core/services/favoritos.service.ts', 'pages/favoritos'],
    telas: ['Favoritos', 'Estrela nos detalhes'],
  },
  {
    nome: 'Gabriel Fernando',
    papel: 'Formatação dos dados',
    requisitos: ['Pipes personalizadas', 'Pipes do Angular'],
    arquivos: ['shared/pipes'],
    telas: ['Detalhe da empresa', 'Bancos'],
  },
  {
    nome: 'Lucas Cardoso',
    papel: 'Diretivas e documentação',
    requisitos: ['Diretivas personalizadas'],
    arquivos: ['shared/directives', 'README.md'],
    telas: ['Situação da empresa', 'Copiar CNPJ/CEP'],
  },
  {
    nome: 'Guilherme Aguiar',
    papel: 'Feriados',
    requisitos: ['@if e @for'],
    arquivos: ['pages/feriados'],
    telas: ['Feriados'],
  },
];
