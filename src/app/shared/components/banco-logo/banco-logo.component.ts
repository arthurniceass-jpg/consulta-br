import { Component, computed, input, signal } from '@angular/core';

/** Cores de fundo para quando o banco não tem logo (escolhidas pelo código do banco). */
const CORES = ['#0b7a55', '#1e5aa8', '#b45309', '#7c3aed', '#be123c', '#0e7490', '#4d7c0f'];

/** Palavras que não entram nas iniciais ("BCO DO BRASIL" → "BB"). */
const IGNORAR = new Set(['BCO', 'BANCO', 'DE', 'DO', 'DA', 'DOS', 'DAS', 'S.A.', 'SA', 'S/A', 'E', '-']);

/**
 * Logo do banco. Se a API não tiver logo (ou a imagem falhar), mostra as iniciais com uma cor fixa.
 * Uso: <app-banco-logo [nome]="banco.name" [codigo]="banco.code" [logoUrl]="banco.logo_url" tamanho="48px" />
 */
@Component({
  selector: 'app-banco-logo',
  template: `
    @if (logoUrl() && !falhou()) {
      <img [src]="logoUrl()" [alt]="'Logo ' + nome()" loading="lazy" (error)="falhou.set(true)" />
    } @else {
      <span [style.background]="cor()" aria-hidden="true">{{ iniciais() }}</span>
    }
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      flex: none;
      width: var(--tamanho);
      height: var(--tamanho);
      border-radius: 28%;
      overflow: hidden;
      background: #fff;
      border: 1px solid var(--cb-border);
    }
    img {
      width: 72%;
      height: 72%;
      object-fit: contain;
    }
    span {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      color: #fff;
      font-weight: 800;
      font-size: calc(var(--tamanho) * 0.36);
      letter-spacing: -0.03em;
    }
  `,
  host: { '[style.--tamanho]': 'tamanho()' },
})
export class BancoLogoComponent {
  readonly nome = input.required<string>();
  readonly codigo = input<number | string>(0);
  readonly logoUrl = input<string | null | undefined>(null);
  readonly tamanho = input('44px');

  protected readonly falhou = signal(false);

  protected readonly iniciais = computed(() => {
    const palavras = this.nome()
      .toUpperCase()
      .split(/\s+/)
      .filter((p) => p && !IGNORAR.has(p));
    return (
      palavras
        .slice(0, 2)
        .map((p) => p[0])
        .join('') || '?'
    );
  });

  protected readonly cor = computed(() => CORES[Number(this.codigo()) % CORES.length]);
}
