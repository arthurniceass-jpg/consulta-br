/** Endereço da sede de um banco, como vem da BrasilAPI. */
export interface EnderecoSede {
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

/** Banco do GET /banks/v1 e /banks/v1/{codigo}. */
export interface Banco {
  ispb: string;
  name: string;
  /** Código de compensação (001 = Banco do Brasil). A lista descarta os bancos sem código. */
  code: number;
  fullName: string;
  localizacao_sede?: string | null;
  headquarters_address?: EnderecoSede | null;
  logo_url?: string | null;
}
