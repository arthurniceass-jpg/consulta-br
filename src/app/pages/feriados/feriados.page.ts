import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { RefresherCustomEvent } from '@ionic/angular';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, cloudOfflineOutline } from 'ionicons/icons';
import { type Subscription, finalize } from 'rxjs';

import type { Feriado } from '../../core/models/feriado.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { EstadoComponent } from '../../shared/components/estado/estado.component';

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MS_POR_DIA = 86_400_000;

@Component({
  selector: 'app-feriados',
  templateUrl: 'feriados.page.html',
  styleUrls: ['feriados.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonSkeletonText,
    EstadoComponent,
  ],
})
export class FeriadosPage {
  private readonly api = inject(BrasilApiService);
  private readonly destroyRef = inject(DestroyRef);
  private consulta?: Subscription;

  private readonly agora = signal(new Date());
  private readonly anoAtual = computed(() => this.agora().getFullYear());
  private readonly hojeUtc = computed(() => {
    const agora = this.agora();
    // Usa a data local do aparelho e representa o dia à meia-noite UTC.
    return Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate());
  });

  protected readonly hoje = computed(() => new Date(this.hojeUtc()).toISOString().slice(0, 10));
  protected readonly anos = computed(() => [this.anoAtual() - 1, this.anoAtual(), this.anoAtual() + 1]);
  protected readonly ano = signal(this.anoAtual());
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly feriados = signal<Feriado[]>([]);
  protected readonly esqueletos = [1, 2, 3, 4, 5, 6];

  private readonly ordenados = computed(() => [...this.feriados()].sort((a, b) => a.date.localeCompare(b.date)));

  protected readonly porMes = computed(() => {
    const grupos = new Map<string, Feriado[]>();

    for (const feriado of this.ordenados()) {
      const mes = MESES[Number(feriado.date.slice(5, 7)) - 1];
      const itens = grupos.get(mes) ?? [];
      itens.push(feriado);
      grupos.set(mes, itens);
    }

    return Array.from(grupos, ([mes, itens]) => ({ mes, itens }));
  });

  protected readonly proximo = computed(() =>
    this.ano() === this.anoAtual() ? this.ordenados().find((feriado) => feriado.date >= this.hoje()) : undefined,
  );

  protected readonly diasAteProximo = computed(() => {
    const feriado = this.proximo();
    if (!feriado) return 0;

    // Compara dias do calendário sem depender da duração do dia no fuso local.
    const [ano, mes, dia] = feriado.date.split('-').map(Number);
    return (Date.UTC(ano, mes - 1, dia) - this.hojeUtc()) / MS_POR_DIA;
  });

  constructor() {
    addIcons({ calendarOutline, cloudOfflineOutline });
    this.carregar();
  }

  ionViewWillEnter(): void {
    this.atualizarData();
  }

  protected trocarAno(valor: string | number | null | undefined): void {
    const ano = Number(valor);
    if (!this.anos().includes(ano) || ano === this.ano()) return;

    this.ano.set(ano);
    this.carregar();
  }

  protected carregar(evento?: RefresherCustomEvent): void {
    this.atualizarData();
    this.consulta?.unsubscribe();
    this.carregando.set(true);
    this.erro.set('');

    this.consulta = this.api
      .getFeriados(this.ano())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.carregando.set(false);
          void evento?.target.complete();
        }),
      )
      .subscribe({
        next: (feriados) => this.feriados.set(feriados),
        error: (erro) => this.erro.set(mensagemDeErro(erro, 'Nenhum feriado encontrado para este ano.')),
      });
  }

  private atualizarData(): void {
    this.agora.set(new Date());
  }
}
