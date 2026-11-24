/** Feriado do GET /feriados/v1/{ano}. A data vem como "AAAA-MM-DD". */
export interface Feriado {
  date: string;
  name: string;
  type: string;
}
