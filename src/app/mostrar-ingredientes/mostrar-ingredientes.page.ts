import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Receta } from '../models/receta.model';
import { RecetasService } from '../services/recetas.service';
import { Ingredient } from '../models/ingredients.model';

@Component({
  selector: 'app-mostrar-ingredientes',
  templateUrl: './mostrar-ingredientes.page.html',
  styleUrls: ['./mostrar-ingredientes.page.scss'],
})
export class MostrarIngredientesPage implements OnInit {
  receta: Receta;
  nombreIngrediente: string = '';
  amountIngrediente: string = '';
  constructor(
    private router: ActivatedRoute,
    public recetasService: RecetasService,
    private routerB: Router
  ) {
    let idReceta = this.router.snapshot.paramMap.get('idReceta');
    this.receta = new Receta('', [], [], '');
    if (idReceta) {
      let ObjetoReceta = this.recetasService.obtenerReceta(idReceta);
      if (ObjetoReceta) {
        this.receta = ObjetoReceta;
      }
    }
  }
  /**
   * @function agregar
   * @description Agrega el ingrediente ingresado en la app en la lista de ingredientes actual
   * @returns Nada (retorno innecesario a cambiar)
   */
  agregar() {
    if (this.nombreIngrediente.length * this.amountIngrediente.length === 0) {
      return;
    }
    const ingrediente = new Ingredient(this.nombreIngrediente, this.amountIngrediente);
    this.receta.ingredients.push(ingrediente);
    this.recetasService.guardarStorage();
    this.nombreIngrediente = '';
    this.amountIngrediente = '';
  }
  /**
   * @function EditarIngrediente
   * @description Recibe un ingrediente y permite al usuario editarlo con un alertController
   * @param ingrediente 
   */
  async EditarIngrediente(ingrediente: Ingredient) {
    let alerta = await this.recetasService.alertController.create({
      header: 'Editar ingrediente',
      inputs: [
        {
          type: 'text',
          name: 'titulo',
          placeholder: 'Ingresar nuevo ingrediente',
          value: ingrediente.name,
        },
        {
          type: 'text',
          name: 'amount',
          placeholder: 'Ingresar nueva cantidad',
          value: ingrediente.amount,
        }
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
            console.log(data);
            if (esValido) {
              ingrediente.name = data.titulo;
              ingrediente.amount = data.amount;
              this.recetasService.presentToast('Ingrediente editada correctamente!');
            }
          },
        },
      ],
    });
    await alerta.present();
  }
  /**
   * @function editar
   * @description LLama la funcion EditarIngrediente
   * @param ingrediente 
   */
  editar(ingrediente: Ingredient) {
    this.EditarIngrediente(ingrediente);
  }
  /**
   * @function eliminar
   * @description Recibe un ingrediente y lo elimina de la lista de ingredientes actual
   * @param ingrediente 
   */
  eliminar(ingrediente: Ingredient) {
    this.receta.ingredients = this.receta.ingredients.filter((item)=> item !== ingrediente);
    this.recetasService.guardarStorage();
  }
  ngOnInit(): void {}
  /**
   * @function recetaSeleccionada
   * @description Redirige a las intrucciones de la receta de los ingredientes actuales
   * @param receta 
   */
  recetaSeleccionada(receta: Receta) {
    const URL = '/mostrarInstrucciones/' + receta.id
    this.routerB.navigateByUrl(URL);
  }
}
