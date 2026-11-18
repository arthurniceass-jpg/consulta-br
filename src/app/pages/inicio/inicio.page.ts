import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonInput, IonSegment, IonSegmentButton, IonSpinner } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircle, arrowForward, business, calendar, location, search, sparkles, star } from 'ionicons/icons';

import type { Cep } from '../../core/models/cep.model';
import { BrasilApiService } from '../../core/services/brasil-api.service';
import { mensagemDeErro } from '../../core/utils/mensagem-erro';
import { somenteDigitos } from '../../core/utils/somente-digitos';
import { cnpjValido } from '../../core/utils/validar-cnpj';
import { CepPipe } from '../../shared/pipes/cep.pipe';

type TipoBusca = 'cnpj' | 'cep';

/** Atalhos da Home: CNPJs reais que sempre respondem (bons para a demonstração). */
const ATALHOS = [
  { nome: 'Banco do Brasil', cnpj: '00000000000191' },
  { nome: 'Petrobras', cnpj: '33000167000101' },
  { nome: 'Itaú Unibanco', cnpj: '60701190000104' },
];

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  imports: [RouterLink, IonContent, IonSegment, IonSegmentButton, IonInput, IonButton, IonIcon, IonSpinner, CepPipe],
})
export class InicioPage {
  private readonly api = inject(BrasilApiService);
  private readonly router = inject(Router);

  protected readonly atalhos = ATALHOS;

  protected readonly tipo = signal<TipoBusca>('cnpj');
  protected readonly termo = signal('');
  protected readonly erro = signal('');

  // Resultado da busca de CEP (mostrado na própria Home)
  protected readonly buscandoCep = signal(false);
  protected readonly endereco = signal<Cep | null>(null);

  constructor() {
    addIcons({ search, arrowForward, business, calendar, star, location, alertCircle, sparkles });
  }

  protected trocarTipo(valor: unknown): void {
    this.tipo.set(valor === 'cep' ? 'cep' : 'cnpj');
    this.termo.set('');
    this.erro.set('');
    this.endereco.set(null);
  }

  protected digitar(valor: string | null | undefined): void {
    this.termo.set(valor ?? '');
    this.erro.set('');
  }

  /** Valida o que foi digitado e faz a consulta do tipo escolhido. */
  protected consultar(): void {
    const digitos = somenteDigitos(this.termo());
    if (this.tipo() === 'cnpj') {
      this.consultarCnpj(digitos);
    } else {
      this.consultarCep(digitos);
    }
  }

  /** Abre o detalhe da empresa passando o CNPJ como parâmetro de rota. */
  protected abrirEmpresa(cnpj: string): void {
    this.router.navigate(['/inicio/empresa', cnpj]);
  }

  private consultarCnpj(cnpj: string): void {
    if (!cnpjValido(cnpj)) {
      this.erro.set('CNPJ inválido. Confira os 14 números.');
      return;
    }
    this.abrirEmpresa(cnpj);
  }

  private consultarCep(cep: string): void {
    if (cep.length !== 8) {
      this.erro.set('O CEP tem 8 números.');
      return;
    }
    this.buscandoCep.set(true);
    this.endereco.set(null);
    this.api.getCep(cep).subscribe({
      next: (endereco) => {
        this.endereco.set(endereco);
        this.buscandoCep.set(false);
      },
      error: (erro) => {
        this.erro.set(mensagemDeErro(erro, 'CEP não encontrado.'));
        this.buscandoCep.set(false);
      },
    });
  }
}
