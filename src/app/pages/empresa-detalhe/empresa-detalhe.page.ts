import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
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
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  briefcaseOutline,
  callOutline,
  copyOutline,
  chevronDown,
  chevronUp,
  locationOutline,
  mailOutline,
  mapOutline,
  peopleOutline,
  star,
  starOutline,
} from 'ionicons/icons';

import type { Empresa } from '../../core/models/empresa.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { somenteDigitos } from '../../core/utils/somente-digitos';
import { EstadoComponent } from '../../shared/components/estado/estado.component';
import { CopiarDirective } from '../../shared/directives/copiar.directive';
import { SituacaoDirective } from '../../shared/directives/situacao.directive';
import { CepPipe } from '../../shared/pipes/cep.pipe';
import { CnpjPipe } from '../../shared/pipes/cnpj.pipe';
import { TelefonePipe } from '../../shared/pipes/telefone.pipe';

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
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    CnpjPipe,
    CepPipe,
    TelefonePipe,
    SituacaoDirective,
    CopiarDirective,
  ],
})
export class EmpresaDetalhePage {
  private readonly api = inject(BrasilApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastController);

  /** CNPJ vindo da URL (/inicio/empresa/:cnpj). */
  protected readonly cnpj = signal('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  /** true quando o CNPJ não existe ou é inválido: não adianta tentar de novo. */
  protected readonly semVolta = signal(false);
  protected readonly empresa = signal<Empresa | null>(null);
  protected readonly mostrarTodosSocios = signal(false);

  /** true quando a empresa aberta está salva nos favoritos (id = CNPJ só com números). */
  protected readonly favorito = computed(() => this.favoritos.ehFavorito('empresa', somenteDigitos(this.cnpj())));

  protected readonly socios = computed(() => {
    const todos = this.empresa()?.qsa ?? [];
    return this.mostrarTodosSocios() ? todos : todos.slice(0, SOCIOS_INICIAIS);
  });

  protected readonly temMaisSocios = computed(() => (this.empresa()?.qsa.length ?? 0) > SOCIOS_INICIAIS);

  /** Endereço em uma linha sem a UF, pulando as partes vazias. A UF fica de fora para o titlecase não virar "Sp". */
  protected readonly logradouro = computed(() => {
    const e = this.empresa();
    if (!e) return '';
    const rua = [e.descricao_tipo_de_logradouro, e.logradouro].filter(Boolean).join(' ');
    return [rua, e.numero, e.complemento, e.bairro, e.municipio].filter(Boolean).join(', ');
  });

  /** " - SP" quando a empresa tem município e UF. */
  protected readonly sufixoUf = computed(() => {
    const e = this.empresa();
    return e?.municipio && e.uf ? ` - ${e.uf}` : '';
  });

  /** Endereço completo, usado no link do mapa. */
  protected readonly endereco = computed(() => this.logradouro() + this.sufixoUf());

  protected readonly linkMapa = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.endereco())}`,
  );

  constructor() {
    addIcons({
      alertCircleOutline,
      briefcaseOutline,
      callOutline,
      copyOutline,
      chevronDown,
      chevronUp,
      locationOutline,
      mailOutline,
      mapOutline,
      peopleOutline,
      star,
      starOutline,
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

  /** Estrela do topo: salva/remove a empresa e avisa com um toast rápido. */
  protected async alternarFavorito(): Promise<void> {
    const empresa = this.empresa();
    if (!empresa) return;

    const ficouFavorito = this.favoritos.alternar({
      tipo: 'empresa',
      id: somenteDigitos(empresa.cnpj),
      titulo: empresa.razao_social,
      subtitulo: empresa.municipio && empresa.uf ? `${empresa.municipio} - ${empresa.uf}` : undefined,
    });

    const toast = await this.toast.create({
      message: ficouFavorito ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
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
