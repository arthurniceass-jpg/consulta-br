import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appSituacao]',
  standalone: true,
})
export class SituacaoDirective {
  @Input('appSituacao') situacao: string | null | undefined;

  @HostBinding('attr.color')
  get cor(): string {
    switch (this.situacao?.trim().toUpperCase()) {
      case 'ATIVA':
        return 'success';

      case 'SUSPENSA':
        return 'warning';

      case 'BAIXADA':
      case 'INAPTA':
      case 'NULA':
        return 'danger';

      default:
        return 'medium';
    }
  }

  @HostBinding('attr.title')
  get descricao(): string {
    switch (this.situacao?.trim().toUpperCase()) {
      case 'ATIVA':
        return 'Empresa ativa na Receita Federal';

      case 'SUSPENSA':
        return 'Empresa com cadastro suspenso';

      case 'BAIXADA':
        return 'Empresa com cadastro baixado';

      case 'INAPTA':
        return 'Empresa com cadastro inapto';

      case 'NULA':
        return 'Empresa com cadastro nulo';

      default:
        return 'Situação cadastral não identificada';
    }
  }
}
