import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

/**
 * Mensagem centralizada para estados de tela: erro, lista vazia, "em breve".
 * Uso: <app-estado icone="cloud-offline-outline" titulo="Sem conexão" textoAcao="Tentar de novo" (acao)="carregar()" />
 */
@Component({
  selector: 'app-estado',
  templateUrl: 'estado.component.html',
  styleUrls: ['estado.component.scss'],
  imports: [IonButton, IonIcon],
})
export class EstadoComponent {
  readonly icone = input('information-circle-outline');
  readonly titulo = input.required<string>();
  readonly mensagem = input('');
  readonly textoAcao = input('');
  readonly tom = input<'neutro' | 'erro'>('neutro');
  readonly acao = output<void>();
}
