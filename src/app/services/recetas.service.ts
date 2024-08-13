import { Injectable } from '@angular/core';
import { Receta } from '../models/receta.model';
import { AlertController, ToastController } from '@ionic/angular';
import { Instruction } from '../models/intruction.model';
import { Ingredient } from '../models/ingredients.model';

@Injectable({
  providedIn: 'root',
})
export class RecetasService {
  public recetas: Receta[] = [];
  constructor(
    public alertController: AlertController,
    public toastController: ToastController
  ) {
    this.cargarStorage();
  }
  /**
   * @function crearReceta
   * @description Crea y guarda una receta segun los parametros recibidos
   * @param nombreReceta Nombre de la receta
   * @param ingredientes Lista de ingredientes de la receta
   * @param instrucciones Lista de instrucciones de la receta
   * @param imagen Imagen de la receta
   * @param id ID de la receta
   * @returns EL titulo/nombre de la receta
   */
  crearReceta(nombreReceta: string, ingredientes: Ingredient[], instrucciones: Instruction[], imagen: string, id?: number) {
    let ObjetoReceta = new Receta(nombreReceta, ingredientes, instrucciones, imagen, id);
    this.recetas.push(ObjetoReceta);
    this.guardarStorage();
    return ObjetoReceta.titulo;
  }
  /**
   * @function guardarStorage
   * @description Guarda en el almacenamiento local las recetas
   */
  guardarStorage() {
    let stringRecetas: string = JSON.stringify(this.recetas);
    localStorage.setItem('Recetas', stringRecetas);
  }
  /**
   * @function cargarStorage
   * @description Carga las recetas del almacenamiento local y las devuelve
   * @returns Lista de recetas del almacenamiento local
   */
  cargarStorage() {
    const recetasStorage = localStorage.getItem('Recetas');
    if (recetasStorage === null) {
      return (this.recetas = []);
    } else {
      let objLista = JSON.parse(recetasStorage);
      return (this.recetas = objLista);
    }
  }
  /**
   * @function eliminarReceta
   * @description Recibe un id de receta y la elimina del almacenamiento local
   * @param idReceta 
   */
  eliminarReceta(idReceta: number) {
    let nuevoSave = this.recetas.filter(
      (unaReceta) => unaReceta.id !== idReceta
    );

    this.recetas = nuevoSave;
    this.guardarStorage();
  }
  /**
   * @function editarReceta
   * @description Recibe una receta y busca otra con el mismo id en el almacenamiento local y la sobreescribe (local por la recibida) 
   * @param receta 
   */
  editarReceta(receta: Receta) {
    let recetaEditar = this.recetas.find(
      (unaReceta) => unaReceta.id == receta.id
    );
    if (recetaEditar) {
      recetaEditar = receta;
    }

    this.guardarStorage();
  }
  /**
   * @function validarInput
   * @description Valida el input del alertController
   * @param input 
   * @returns Si fue ingresado un valor o no (true/false)
   */
  validarInput(input: any): boolean {
    for (const key in input) {
      if (input[key] == '') {
        this.presentToast('Debe ingresar un valor');
        return false;
      }
    }
    return true;
    
  }
  /**
   * @function presentToast
   * @description Muestra un mensaje por sobre la app
   * @param mensage 
   */
  async presentToast(mensage: string) {
    let toast = await this.toastController.create({
      message: mensage,
      duration: 2000,
    });
    toast.present();
  }
  /**
   * @function obtenerReceta
   * @description Recibe un id de receta, la busca y la devuelve
   * @param idReceta 
   * @returns La receta buscada
   */
  obtenerReceta(idReceta: string | number) {
    const id = Number(idReceta);
    let receta = this.recetas.find((unaReceta)=> unaReceta.id == id);
    return receta;
   }
   
}
