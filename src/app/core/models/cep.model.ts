/** Endereço do GET /cep/v2/{cep}. */
export interface Cep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
  service: string;
}
