import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

/**
 * Formata CNPJ: "00000000000191" vira "00.000.000/0001-91".
 * Regra: usa só os dígitos; se o valor for número, completa com zeros à esquerda até 14.
 * Se não sobrar exatamente 14 dígitos, devolve o valor original (sem quebrar a tela).
 */
@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {
  transform(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    // String(valor) converte número em texto; replace(/\D/g, '') remove pontos, barras etc.
    const digitos = String(valor).replace(/\D/g, '');
    // Número pode vir sem os zeros à esquerda (191) e precisa ser completado.
    const completo = typeof valor === 'number' ? digitos.padStart(14, '0') : digitos;

    if (completo.length !== 14) {
      return String(valor);
    }

    return `${completo.slice(0, 2)}.${completo.slice(2, 5)}.${completo.slice(5, 8)}/${completo.slice(8, 12)}-${completo.slice(12)}`;
  }
}
