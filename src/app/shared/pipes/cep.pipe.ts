import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

/**
 * Formata CEP: "36010000" ou "36010-000" vira "36010-000".
 * Regra: usa só os dígitos e exige 8 números; qualquer outro tamanho devolve o valor original.
 */
@Pipe({ name: 'cep' })
export class CepPipe implements PipeTransform {
  transform(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    const digitos = String(valor).replace(/\D/g, '');

    if (digitos.length !== 8) {
      return String(valor);
    }

    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  }
}
