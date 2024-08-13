import { Component, OnInit } from '@angular/core';
import { RecetasService } from 'src/app/services/recetas.service';
import { Receta } from 'src/app/models/receta.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss'],
})
export class RecetasComponent {

  constructor(
    public recetasService: RecetasService,
    private router: Router
  ) { }
  /**
   * @function editarReceta
   * @description Permite mediente alertController la edicion del nombre de una receta
   * @param receta 
   */
  async EditarReceta(receta: Receta) {
    let alerta = await this.recetasService.alertController.create({
      header: 'Editar receta',
      inputs: [
        {
          type: 'text',
          name: 'titulo',
          placeholder: 'Ingresar nuevo nombre de la receta',
          value: receta.titulo,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Editar',
          handler: (data: any) => {
            let esValido: boolean = this.recetasService.validarInput(data);
            if (esValido) {
              (receta.titulo = data.titulo),
                this.recetasService.editarReceta(receta);
              this.recetasService.presentToast('Receta editada correctamente!');
            }
          },
        },
      ],
    });
    await alerta.present();

    console.log('Editar receta:', receta);
  }
  /**
   * @function editarReceta
   * @description Llama a la funcion EditarReceta
   * @param receta 
   */
  editarReceta(receta: Receta) {
    this.EditarReceta(receta)
  }
  /**
   * @function eliminarReceta
   * @description Llama a la funcion eliminarReceta de recetasService para eliminar la receta
   * @param receta 
   */
  eliminarReceta(receta: Receta) {
    this.recetasService.eliminarReceta(receta.id);
    console.log('Eliminar receta:', receta);
  }
  /**
   * @function recetaSeleccionada
   * @description Lleva a la pestaña de mostrar los ingredientes de la receta recibida
   * @param receta 
   */
  recetaSeleccionada(receta: Receta) {
    const URL = '/mostrar-ingredientes/' + receta.id
    this.router.navigateByUrl(URL);
  }
}
