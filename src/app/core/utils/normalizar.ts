/** Deixa o texto pronto para busca: minúsculo e sem acentos ("Itaú" → "itau"). */
export function normalizar(texto: string | null | undefined): string {
  return (texto ?? '')
    .normalize('NFD') // separa a letra do acento: "ú" vira "u" + "´"
    .replace(/\p{Diacritic}/gu, '') // remove os acentos
    .toLowerCase()
    .trim();
}
