import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { InfiniteScrollCustomEvent } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline, searchOutline } from 'ionicons/icons';

import type { Banco } from '../../core/models/banco.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { normalizar } from '../../core/utils/normalizar';
import { BancoLogoComponent } from '../../shared/components/banco-logo/banco-logo.component';
import { EstadoComponent } from '../../shared/components/estado/estado.component';

/** Quantos bancos aparecem por vez (o resto carrega ao rolar a tela). */
const POR_PAGINA = 30;

/** Códigos dos bancos mais conhecidos, mostrados como atalho no topo. */
const POPULARES = [1, 33, 104, 237, 341, 260, 77, 336];

@Component({
  selector: 'app-bancos',
  templateUrl: 'bancos.page.html',
  styleUrls: ['bancos.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    BancoLogoComponent,
    EstadoComponent,
    TitleCasePipe,
  ],
})
export class BancosPage {
  private readonly api = inject(BrasilApiService);

  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly bancos = signal<Banco[]>([]);
  protected readonly busca = signal('');
  protected readonly limite = signal(POR_PAGINA);
  protected readonly esqueletos = Array.from({ length: 8 }, (_, i) => i);

  /** Bancos que batem com a busca (nome, nome completo ou código). */
  protected readonly filtrados = computed(() => {
    const termo = normalizar(this.busca());
    if (!termo) return this.bancos();
    return this.bancos().filter(
      (b) =>
        normalizar(b.name).includes(termo) ||
        normalizar(b.fullName).includes(termo) ||
        String(b.code).padStart(3, '0').includes(termo),
    );
  });

  /** Só a parte da lista que já apareceu na tela. */
  protected readonly visiveis = computed(() => this.filtrados().slice(0, this.limite()));

  protected readonly populares = computed(() =>
    POPULARES.map((codigo) => this.bancos().find((b) => b.code === codigo)).filter((b) => !!b),
  );

  constructor() {
    addIcons({ cloudOfflineOutline, searchOutline });
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.getBancos().subscribe({
      next: (bancos) => {
        this.bancos.set(bancos);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.erro.set(mensagemDeErro(erro));
        this.carregando.set(false);
      },
    });
  }

  protected buscar(valor: string | null | undefined): void {
    this.busca.set(valor ?? '');
    this.limite.set(POR_PAGINA);
  }

  /** Rolagem infinita: mostra mais 30 bancos quando chega no fim da lista. */
  protected carregarMais(evento: InfiniteScrollCustomEvent): void {
    this.limite.update((n) => n + POR_PAGINA);
    evento.target.complete();
  }

  protected codigo(banco: Banco): string {
    return String(banco.code).padStart(3, '0');
  }
}
