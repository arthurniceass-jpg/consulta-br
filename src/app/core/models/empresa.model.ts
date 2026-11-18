/** Sócio (quadro societário) de uma empresa. */
export interface Socio {
  nome_socio: string;
  qualificacao_socio: string;
  data_entrada_sociedade: string | null;
  faixa_etaria?: string | null;
}

/** Empresa do GET /cnpj/v1/{cnpj} (só os campos que o app usa). */
export interface Empresa {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  /** "ATIVA", "BAIXADA", "INAPTA", "SUSPENSA" ou "NULA". */
  descricao_situacao_cadastral: string;
  descricao_identificador_matriz_filial: string | null;
  capital_social: number;
  data_inicio_atividade: string | null;
  cnae_fiscal_descricao: string | null;
  natureza_juridica: string | null;
  porte: string | null;
  descricao_tipo_de_logradouro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  municipio: string | null;
  uf: string | null;
  cep: string | null;
  ddd_telefone_1: string | null;
  email: string | null;
  qsa: Socio[];
}
