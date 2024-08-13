import { Component } from '@angular/core';
import { RecetasService } from '../services/recetas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  constructor(public recetasService: RecetasService) {}
  /**
   * @function AgregarReceta
   * @description Le permite al usuario crear una receta, ingresando un nombre para la misma.
   */
  async AgregarReceta() {
    let alerta = await this.recetasService.alertController.create({
      header: 'Agregar receta',
      inputs: [
        {
          type: 'text',
          name: 'titulo',
          placeholder: 'Ingresar nombre de la receta',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: (data: any) => {
            let esValido: boolean = this.recetasService.validarInput(data);
            if (esValido) {
              let creadaOk = this.recetasService.crearReceta(data.titulo, [], [], '');
              if (creadaOk) {
                this.recetasService.presentToast(
                  'Receta creada correctamente!'
                );
              }
            }
          },
        },
      ],
    });
    await alerta.present();
  }
}
