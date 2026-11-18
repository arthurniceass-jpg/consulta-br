import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
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
import {
  alertCircleOutline,
  briefcaseOutline,
  callOutline,
  chevronDown,
  chevronUp,
  locationOutline,
  mailOutline,
  mapOutline,
  peopleOutline,
} from 'ionicons/icons';

import type { Empresa } from '../../core/models/empresa.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { EstadoComponent } from '../../shared/components/estado/estado.component';

/** Quantos sócios aparecem antes do "ver todos" (o Itaú, por exemplo, tem 138). */
const SOCIOS_INICIAIS = 10;

@Component({
  selector: 'app-empresa-detalhe',
  templateUrl: 'empresa-detalhe.page.html',
  styleUrls: ['empresa-detalhe.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonBadge,
    IonButton,
    IonIcon,
    IonSkeletonText,
    EstadoComponent,
  ],
})
export class EmpresaDetalhePage {
  private readonly api = inject(BrasilApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** CNPJ vindo da URL (/inicio/empresa/:cnpj). */
  protected readonly cnpj = signal('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  /** true quando o CNPJ não existe ou é inválido: não adianta tentar de novo. */
  protected readonly semVolta = signal(false);
  protected readonly empresa = signal<Empresa | null>(null);
  protected readonly mostrarTodosSocios = signal(false);

  protected readonly socios = computed(() => {
    const todos = this.empresa()?.qsa ?? [];
    return this.mostrarTodosSocios() ? todos : todos.slice(0, SOCIOS_INICIAIS);
  });

  protected readonly temMaisSocios = computed(() => (this.empresa()?.qsa.length ?? 0) > SOCIOS_INICIAIS);

  /** Endereço em uma linha, pulando as partes vazias. */
  protected readonly endereco = computed(() => {
    const e = this.empresa();
    if (!e) return '';
    const rua = [e.descricao_tipo_de_logradouro, e.logradouro].filter(Boolean).join(' ');
    return [rua, e.numero, e.complemento, e.bairro, e.municipio && `${e.municipio} - ${e.uf}`]
      .filter(Boolean)
      .join(', ');
  });

  protected readonly linkMapa = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.endereco())}`,
  );

  constructor() {
    addIcons({
      alertCircleOutline,
      briefcaseOutline,
      callOutline,
      chevronDown,
      chevronUp,
      locationOutline,
      mailOutline,
      mapOutline,
      peopleOutline,
    });

    // Parâmetro de rota: lê o :cnpj da URL e carrega a empresa
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.cnpj.set(params.get('cnpj') ?? '');
      this.carregar();
    });
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.mostrarTodosSocios.set(false);
    this.api.getEmpresa(this.cnpj()).subscribe({
      next: (empresa) => {
        this.empresa.set(empresa);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.semVolta.set(erro instanceof HttpErrorResponse && [400, 404].includes(erro.status));
        this.erro.set(mensagemDeErro(erro, 'Nenhuma empresa encontrada com esse CNPJ.'));
        this.carregando.set(false);
      },
    });
  }

  protected novaBusca(): void {
    this.router.navigate(['/inicio']);
  }

  /** Duas primeiras letras do nome, para o avatar ("ITAU UNIBANCO" → "IU"). */
  protected iniciais(nome: string): string {
    return nome
      .split(/\s+/)
      .filter((p) => p.length > 2)
      .slice(0, 2)
      .map((p) => p[0])
      .join('');
  }
}
