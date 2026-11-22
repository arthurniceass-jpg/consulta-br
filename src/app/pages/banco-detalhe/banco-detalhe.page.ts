import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline, copyOutline, locationOutline, mapOutline } from 'ionicons/icons';

import type { Banco } from '../../core/models/banco.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { BancoLogoComponent } from '../../shared/components/banco-logo/banco-logo.component';
import { EstadoComponent } from '../../shared/components/estado/estado.component';
import { CopiarDirective } from '../../shared/directives/copiar.directive';

@Component({
  selector: 'app-banco-detalhe',
  templateUrl: 'banco-detalhe.page.html',
  styleUrls: ['banco-detalhe.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSkeletonText,
    BancoLogoComponent,
    EstadoComponent,
    CopiarDirective,
  ],
})
export class BancoDetalhePage {
  private readonly api = inject(BrasilApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Código vindo da URL (/bancos/:codigo). */
  protected readonly codigo = signal(0);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  /** true quando a API respondeu 404: não adianta tentar de novo. */
  protected readonly naoExiste = signal(false);
  protected readonly banco = signal<Banco | null>(null);

  /** Endereço da sede em uma linha só, pulando as partes vazias. */
  protected readonly enderecoSede = computed(() => {
    const e = this.banco()?.headquarters_address;
    if (!e) return '';
    return [e.street, e.number, e.complement, e.district, e.city && `${e.city} - ${e.state}`]
      .filter(Boolean)
      .join(', ');
  });

  /** Link do Google Maps para a sede do banco. */
  protected readonly linkMapa = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.enderecoSede())}`,
  );

  constructor() {
    addIcons({ locationOutline, copyOutline, mapOutline, alertCircleOutline });

    // Parâmetro de rota: lê o :codigo da URL e carrega o banco correspondente
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.codigo.set(Number(params.get('codigo')));
      this.carregar();
    });
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.api.getBanco(this.codigo()).subscribe({
      next: (banco) => {
        this.banco.set(banco);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.naoExiste.set(erro instanceof HttpErrorResponse && erro.status === 404);
        this.erro.set(mensagemDeErro(erro, `Não existe banco com o código ${this.codigo()}.`));
        this.carregando.set(false);
      },
    });
  }

  protected voltarParaLista(): void {
    this.router.navigate(['/bancos']);
  }

  protected codigoFormatado(): string {
    return String(this.codigo()).padStart(3, '0');
  }
}
