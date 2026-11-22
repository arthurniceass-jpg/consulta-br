import { Directive, HostBinding, HostListener, Input, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Directive({
  selector: '[appCopiar]',
  standalone: true,
})
export class CopiarDirective {
  @Input('appCopiar') texto = '';

  private toastController = inject(ToastController);

  @HostBinding('style.cursor')
  cursor = 'pointer';

  @HostBinding('class.copiar')
  classeCopiar = true;

  @HostListener('click')
  async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.texto);

      const toast = await this.toastController.create({
        message: `Copiado: ${this.texto}`,
        duration: 1500,
        color: 'success',
      });

      await toast.present();
    } catch {
      const toast = await this.toastController.create({
        message: 'Não foi possível copiar',
        duration: 1500,
        color: 'danger',
      });

      await toast.present();
    }
  }
}
