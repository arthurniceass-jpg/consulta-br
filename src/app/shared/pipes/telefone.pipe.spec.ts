import { TelefonePipe } from './telefone.pipe';

describe('TelefonePipe', () => {
  const pipe = new TelefonePipe();

  it('formata telefone fixo (10 dígitos) e celular (11 dígitos)', () => {
    expect(pipe.transform('6134939002')).toBe('(61) 3493-9002');
    expect(pipe.transform('32999990000')).toBe('(32) 99999-0000');
  });

  it('devolve o valor original quando não tem 10 ou 11 dígitos', () => {
    expect(pipe.transform('123')).toBe('123');
    expect(pipe.transform('telefone inválido')).toBe('telefone inválido');
  });

  it('devolve vazio para null e undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
