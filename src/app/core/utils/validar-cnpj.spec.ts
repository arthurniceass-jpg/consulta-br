import { cnpjValido } from './validar-cnpj';

describe('cnpjValido', () => {
  it('aceita CNPJs reais, com ou sem máscara', () => {
    expect(cnpjValido('00000000000191')).toBe(true);
    expect(cnpjValido('33.000.167/0001-01')).toBe(true);
    expect(cnpjValido('60701190000104')).toBe(true);
  });

  it('recusa dígito verificador errado, tamanho errado e números repetidos', () => {
    expect(cnpjValido('00000000000192')).toBe(false);
    expect(cnpjValido('123')).toBe(false);
    expect(cnpjValido('11111111111111')).toBe(false);
  });
});
