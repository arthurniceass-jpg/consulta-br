/** Remove tudo que não for número: "00.000.000/0001-91" → "00000000000191". */
export function somenteDigitos(valor: string | number | null | undefined): string {
  return String(valor ?? '').replace(/\D/g, '');
}
