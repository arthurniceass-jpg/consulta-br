import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { constructOutline } from 'ionicons/icons';

import { EstadoComponent } from '../../shared/components/estado/estado.component';

@Component({
  selector: 'app-equipe',
  templateUrl: 'equipe.page.html',
  styleUrls: ['equipe.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, EstadoComponent],
})
export class EquipePage {
  constructor() {
    addIcons({ constructOutline });
  }
}
