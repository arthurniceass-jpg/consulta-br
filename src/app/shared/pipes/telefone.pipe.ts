import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

/**
 * Formata telefone brasileiro: "6134939002" vira "(61) 3493-9002" (fixo, 10 dígitos)
 * e "32999990000" vira "(32) 99999-0000" (celular, 11 dígitos).
 * Qualquer outro tamanho devolve o valor original.
 */
@Pipe({ name: 'telefone' })
export class TelefonePipe implements PipeTransform {
  transform(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    const digitos = String(valor).replace(/\D/g, '');

    if (digitos.length === 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }

    if (digitos.length === 11) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
    }

    return String(valor);
  }
}
