import { CnpjPipe } from './cnpj.pipe';

describe('CnpjPipe', () => {
  const pipe = new CnpjPipe();

  it('formata 14 dígitos e completa número com zeros à esquerda', () => {
    expect(pipe.transform('00000000000191')).toBe('00.000.000/0001-91');
    expect(pipe.transform('60701190000104')).toBe('60.701.190/0001-04');
    expect(pipe.transform(191)).toBe('00.000.000/0001-91');
  });

  it('devolve o valor original quando não tem 14 dígitos', () => {
    expect(pipe.transform('123')).toBe('123');
    expect(pipe.transform('CNPJ inválido')).toBe('CNPJ inválido');
  });

  it('devolve vazio para null e undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
