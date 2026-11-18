import { somenteDigitos } from './somente-digitos';

/**
 * Confere se o CNPJ é válido pelos dois dígitos verificadores (regra da Receita Federal).
 * Evita gastar uma consulta na API com um número digitado errado.
 */
export function cnpjValido(valor: string): boolean {
  const cnpj = somenteDigitos(valor);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }
  const digito = (base: string): number => {
    // pesos: 5,4,3,2,9,8,7,6,5,4,3,2 para o 1º dígito e 6,5,4,3,2,9,... para o 2º
    let peso = base.length - 7;
    let soma = 0;
    for (const n of base) {
      soma += Number(n) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const primeiro = digito(cnpj.slice(0, 12));
  const segundo = digito(cnpj.slice(0, 12) + primeiro);
  return cnpj.endsWith(`${primeiro}${segundo}`);
}
