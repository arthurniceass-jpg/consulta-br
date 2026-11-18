import { Component } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { codeSlashOutline, logoAngular, phonePortraitOutline } from 'ionicons/icons';

import { EQUIPE } from './equipe.data';

/** Cor do avatar de cada integrante (na ordem da lista). */
const CORES = ['#0b7a55', '#1e5aa8', '#b45309', '#7c3aed', '#be123c'];

@Component({
  selector: 'app-equipe',
  templateUrl: 'equipe.page.html',
  styleUrls: ['equipe.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon],
})
export class EquipePage {
  protected readonly equipe = EQUIPE;

  constructor() {
    addIcons({ codeSlashOutline, phonePortraitOutline, logoAngular });
  }

  protected iniciais(nome: string): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('');
  }

  protected cor(indice: number): string {
    return CORES[indice % CORES.length];
  }
}
