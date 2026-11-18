import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

/**
 * Transforma um erro de requisição em uma frase para mostrar na tela.
 * @param naoEncontrado texto usado quando a API responde 404 (ex.: "Banco não encontrado.")
 */
export function mensagemDeErro(erro: unknown, naoEncontrado = 'Nada encontrado.'): string {
  if (erro instanceof TimeoutError) {
    return 'A BrasilAPI demorou para responder. Tente de novo.';
  }
  if (!(erro instanceof HttpErrorResponse)) {
    return 'Algo deu errado. Tente de novo.';
  }
  if (erro.status === 0) {
    return 'Sem conexão com a internet ou a BrasilAPI está fora do ar.';
  }
  if (erro.status === 404) {
    return naoEncontrado;
  }
  if (erro.status === 400) {
    return erro.error?.message ?? 'Dado inválido.';
  }
  if (erro.status === 429) {
    return 'Muitas consultas seguidas. Espere alguns segundos e tente de novo.';
  }
  return 'A BrasilAPI está instável agora. Tente de novo em instantes.';
}
