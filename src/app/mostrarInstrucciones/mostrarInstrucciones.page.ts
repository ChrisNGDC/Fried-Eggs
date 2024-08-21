/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetasService } from '../services/recetas.service';
import { Receta } from '../models/receta.model';
import { Instruction } from '../models/intruction.model';

@Component({
  selector: 'app-mostrarInstrucciones',
  templateUrl: './mostrarInstrucciones.page.html',
  styleUrls: ['./mostrarInstrucciones.page.scss'],
})
export class MostrarInstrucciones {
  receta: Receta;
  descripcionPaso: string = '';
  constructor(
    private router: ActivatedRoute,
    public recetasService: RecetasService
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
   * @description Agrega la instruccion ingresada en la app en la lista de instrucciones actual
   * @returns Nada (retorno innecesario a cambiar)
   */
  agregar() {
    if (this.descripcionPaso.length === 0) {
      return;
    }
    const intruccion = new Instruction(this.descripcionPaso, false);
    this.receta.recipe.push(intruccion);
    this.recetasService.guardarStorage();
    this.descripcionPaso = '';
  }
  async EditarInstruccion(instruccion: Instruction) {
    let alerta = await this.recetasService.alertController.create({
      header: 'Editar intruccion',
      inputs: [
        {
          type: 'text',
          name: 'titulo',
          placeholder: 'Ingresar nueva instruccion',
          value: instruccion.description,
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
              instruccion.description = data.titulo;
              this.recetasService.presentToast('Instruccion editada correctamente!');
            }
          },
        },
      ],
    });
    await alerta.present();
  }
  /**
   * @function editar
   * @description Llama a la funcion EditarInstruccion
   * @param instruccion 
   */
  editar(instruccion: Instruction) {
    this.EditarInstruccion(instruccion);
  }
  /**
   * @function eliminar
   * @description Recibe una instruccion y la elimina de la lista de intrucciones actual
   * @param instruccion 
   */
  eliminar(instruccion: Instruction) {
    this.receta.recipe = this.receta.recipe.filter((item)=> item !== instruccion);
    this.recetasService.guardarStorage();
  }
  /**
   * @function cambioCheck
   * @description Comprueba si todas las intrucciones estan marcadas y marca la receta como completada
   */
  cambioCheck() {
    const faltanPasos = this.receta.recipe.some((item) => item.done == false);
    if (faltanPasos) {
      this.receta.completada = false;
      this.receta.terminadaEn = undefined;
    } else {
      this.receta.completada = true;
      this.receta.terminadaEn = new Date();
      console.log(this.receta);
    }
    this.recetasService.guardarStorage();
  }
}
