import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

import { mensagemDeErro } from './mensagem-erro';

describe('mensagemDeErro', () => {
  const erro = (status: number, error: unknown = null) => new HttpErrorResponse({ status, error });

  it('explica a falta de conexão', () => {
    expect(mensagemDeErro(erro(0))).toContain('Sem conexão');
  });

  it('usa o texto de "não encontrado" informado', () => {
    expect(mensagemDeErro(erro(404), 'Banco não encontrado.')).toBe('Banco não encontrado.');
  });

  it('mostra a mensagem da API no erro 400', () => {
    expect(mensagemDeErro(erro(400, { message: 'CNPJ inválido.' }))).toBe('CNPJ inválido.');
  });

  it('trata limite de consultas e demora', () => {
    expect(mensagemDeErro(erro(429))).toContain('Muitas consultas');
    expect(mensagemDeErro(new TimeoutError())).toContain('demorou');
  });
});
