import { CepPipe } from './cep.pipe';

describe('CepPipe', () => {
  const pipe = new CepPipe();

  it('formata 8 dígitos com ou sem hífen', () => {
    expect(pipe.transform('36010000')).toBe('36010-000');
    expect(pipe.transform('36010-000')).toBe('36010-000');
    expect(pipe.transform('01310100')).toBe('01310-100');
  });

  it('devolve o valor original quando não tem 8 dígitos', () => {
    expect(pipe.transform('123')).toBe('123');
    expect(pipe.transform('CEP inválido')).toBe('CEP inválido');
  });

  it('devolve vazio para null e undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
