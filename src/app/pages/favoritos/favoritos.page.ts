import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline, trashOutline } from 'ionicons/icons';

import type { Favorito } from '../../core/models/favorito.model';
import { FavoritosService } from '../../core/services/favoritos.service';
import { BancoLogoComponent } from '../../shared/components/banco-logo/banco-logo.component';
import { EstadoComponent } from '../../shared/components/estado/estado.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: 'favoritos.page.html',
  styleUrls: ['favoritos.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBadge,
    IonContent,
    IonList,
    IonListHeader,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    BancoLogoComponent,
    EstadoComponent,
  ],
})
export class FavoritosPage {
  private readonly favoritosService = inject(FavoritosService);
  private readonly alerta = inject(AlertController);
  private readonly router = inject(Router);

  /** Total de favoritos (vem do computed do service). */
  protected readonly total = this.favoritosService.total;

  /** Só os bancos salvos, na ordem em que foram favoritados. */
  protected readonly bancos = computed(() => this.favoritosService.favoritos().filter((item) => item.tipo === 'banco'));

  /** Só as empresas salvas, na ordem em que foram favoritadas. */
  protected readonly empresas = computed(() =>
    this.favoritosService.favoritos().filter((item) => item.tipo === 'empresa'),
  );

  constructor() {
    addIcons({ star, starOutline, trashOutline });
  }

  /** Rota de detalhe certa para cada tipo de favorito. */
  protected link(item: Favorito): string[] {
    return item.tipo === 'banco' ? ['/bancos', item.id] : ['/inicio/empresa', item.id];
  }

  /** Duas primeiras letras do nome, para o avatar da empresa ("ITAU UNIBANCO" → "IU"). */
  protected iniciais(nome: string): string {
    return nome
      .split(/\s+/)
      .filter((p) => p.length > 2)
      .slice(0, 2)
      .map((p) => p[0])
      .join('');
  }

  /** Tira o item da lista (e do localStorage) na hora. */
  protected remover(item: Favorito): void {
    this.favoritosService.remover(item.tipo, item.id);
  }

  protected irParaBancos(): void {
    this.router.navigate(['/bancos']);
  }

  /** Pede confirmação antes de apagar todos os favoritos do aparelho. */
  protected async confirmarLimpar(): Promise<void> {
    const alerta = await this.alerta.create({
      header: 'Limpar favoritos?',
      message: 'Todos os bancos e empresas salvos serão removidos deste aparelho.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Limpar',
          role: 'destructive',
          handler: () => this.favoritosService.limpar(),
        },
      ],
    });
    await alerta.present();
  }
}
