import { Component } from '@angular/core';
import { BaseRecetasService } from '../services/base-recetas.service';
import { RecetasService } from '../services/recetas.service';
import { Ingredient } from '../models/ingredients.model';
import { Instruction } from '../models/intruction.model';
import { Area } from '../models/areas.model';
import { TranslateService } from '../services/translate.service';
import { Receta } from '../models/receta.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  recetasAPI: any[] = [];
  cantidadRecetas = 10;
  isActive: boolean = false;
  categorias: any[] = [];
  recetasFiltro: any[] = [];
  categoriaActual = 'Categorias';
  paisActual = 'Paises';
  paises: any[] = [];
  // Esto es de esta manera debido a que la API da el nombre del area y las imagenes se trabajan con las siglas y no hay una conversion directa debido a los nombres particulares que da la API
  areas: Area[] = [
    new Area('American', 'US'),
    new Area('British', 'GB'),
    new Area('Canadian', 'CA'),
    new Area('Chinese', 'CN'),
    new Area('Croatian', 'HR'),
    new Area('Dutch', 'NL'),
    new Area('Egyptian', 'EG'),
    new Area('Filipino', 'PH'),
    new Area('French', 'FR'),
    new Area('Greek', 'GR'),
    new Area('Indian', 'IN'),
    new Area('Irish', 'IE'),
    new Area('Italian', 'IT'),
    new Area('Jamaican', 'JM'),
    new Area('Japanese', 'JP'),
    new Area('Kenyan', 'KE'),
    new Area('Malaysian', 'MY'),
    new Area('Mexican', 'MX'),
    new Area('Moroccan', 'MA'),
    new Area('Polish', 'PL'),
    new Area('Portuguese', 'PT'),
    new Area('Russian', 'RU'),
    new Area('Spanish', 'ES'),
    new Area('Thai', 'TH'),
    new Area('Tunisian', 'TN'),
    new Area('Turkish', 'TR'),
    new Area('Unknown', 'UY'),
    new Area('Vietnamese', 'VN'),
  ];
  volverCategoria = {
    strCategory: 'Volver',
    strCategoryThumb: '../assets/back.png',
  };
  volverPais = {
    name: 'Volver',
    image: '../assets/back.png',
  };
  constructor(
    public baseRecetas: BaseRecetasService,
    public recetasService: RecetasService,
    public translate: TranslateService
  ) {}
  /**
   * @function ngOnInit
   * @description Se ejecuta al iniciar la carga de la tab
   */
  ngOnInit() {
    this.getRecetas();
    this.getCategorias();
    this.getPaises();
  }
  /**
   * @function getCategorias
   * @description Obtiene todas las categorias por ingrediente principal y las guarda en un array
   */
  getCategorias() {
    this.categorias = [];
    this.baseRecetas.obtenerCategorias().subscribe({
      next: (data) => {
        Object.values(data)[0].forEach((categoria: any) => {
          this.categorias.push(categoria);
        });
      },
      error: (error) => console.log(error.statusText),
    });
    this.categorias.forEach((categoria) => (categoria.plate = false));
  }
  /**
   * @function getPaises
   * @description Reinicia la lista de paises a la original
   */
  getPaises() {
    this.paises = this.areas;
  }
  /**
   * @function getRecetas
   * @description Obtiene recetas aleatorias y las guarda en un array
   */
  getRecetas() {
    this.recetasAPI = [];
    for (let i = 0; i < this.cantidadRecetas; i++) {
      this.baseRecetas.obtenerReceta().subscribe({
        next: (data) => this.recetasAPI.push(data),
        error: (error) => console.log(error.statusText),
      });
    }
    this.recetasAPI.forEach((receta) => (receta.favorite = false));
  }
  /**
   * @function AgregarReceta
   * @description Guarda una receta segun los parametros ingresados.
   * @param nombre Nombre de la Receta
   * @param ingredientes Lista de ingredientes
   * @param instrucciones Lista de pasos
   * @param imagen Imagen del plato terminado
   */
  async AgregarReceta(
    nombre: string,
    ingredientes: Ingredient[],
    instrucciones: Instruction[],
    imagen: string,
    id: number
  ) {
    let creadaOk = this.recetasService.crearReceta(
      nombre,
      ingredientes,
      instrucciones,
      imagen,
      id
    );
    if (creadaOk) {
      this.recetasService.presentToast('Receta favorita guardada!');
    }
  }
  /**
   * @function interactuarReceta
   * @description Recibe una receta y invierte su estado de favorita.
   * @param unaReceta Receta a interactuar
   */
  async interactuarReceta(unaReceta: any) {
    console.log(unaReceta);
    this.baseRecetas.obtenerRecetaSegunID(unaReceta['idMeal']).subscribe({
      next: (data) => {
        let receta = data['meals' as keyof typeof data];
        receta = receta[0 as keyof typeof receta];
        if (!unaReceta.favorite) {
          console.log('guardando');
          this.guardarReceta(receta);
        } else {
          console.log('Eliminando');
          this.recetasService.eliminarReceta(unaReceta['idMeal'] / 1);
          this.recetasService.presentToast('Receta favorita olvidada!');
        }
        unaReceta.favorite = !unaReceta.favorite;
      },
      error: (error) => {
        console.log(error.statusText);
      },
    });
  }
  /**
   * @function guardarReceta
   * @description Convierte una receta de la API a una de estructura propia
   * @param unaReceta Una receta proveniente de la API
   */
  guardarReceta(unaReceta: any) {
    let ingredientes = [];
    let instrucciones: Instruction[] = [];
    let numeroIngrediente = 1;
    let imagen: string = unaReceta['strMealThumb'];
    do {
      let ingrediente = new Ingredient(
        unaReceta[`strIngredient${numeroIngrediente}`],
        unaReceta[`strMeasure${numeroIngrediente}`]
      );
      if (ingrediente.name == '' || ingrediente.amount == '') {
        break;
      }
      ingredientes.push(ingrediente);
      numeroIngrediente++;
    } while (true);
    let nombre: string = unaReceta.strMeal;
    let instruccionesStr: string[] = unaReceta.strInstructions.split('.');
    instruccionesStr.splice(-1, 1);
    instruccionesStr.forEach((instruccionStr) => {
      this.translate.traslate(instruccionStr).then((result) => {
        instruccionStr = result;
      });
      instrucciones.push(new Instruction(instruccionStr, false));
    });
    this.AgregarReceta(
      nombre,
      ingredientes,
      instrucciones,
      imagen,
      unaReceta.idMeal / 1
    );
  }
  /**
   * @function elegirCategoria
   * @description Recibe una categoria (ingrediente principal) y actualiza la lista de categoria a una que tiene las recetas que pertenecen a esa categoria
   * @param categoria Categoria elegida
   */
  async elegirCategoria(categoria: any) {
    if (categoria == this.volverCategoria) {
      this.categoriaActual = 'Categorias';
      this.getCategorias();
    } else {
      if (!categoria['plate']) {
        this.categoriaActual = categoria['strCategory'];
        this.categorias = [this.volverCategoria];
        this.baseRecetas
          .obtenerRecetasSegunCategoria(categoria['strCategory'])
          .subscribe({
            next: (data) => {
              Object.values(data).forEach((recetas: any) =>
                recetas.forEach((receta: any) =>
                  this.categorias.push({
                    strCategory: receta['strMeal'],
                    strCategoryThumb: receta['strMealThumb'],
                    plate: true,
                    idMeal: receta['idMeal'],
                    favorite: false,
                  })
                )
              );
            },
            error: (error) => console.log(error.statusText),
          });
      }
    }
  }
  /**
   * @function elegirPais
   * @description Recibe un pais y actualiza la lista de paises a una que tiene las recetas que pertenecen a ese pais
   * @param pais Pais elegido
   */
  async elegirPais(pais: any) {
    if (pais == this.volverPais) {
      this.paisActual = 'Paises';
      this.getPaises();
    } else {
      if (!pais['plate']) {
        this.paisActual = pais['name'];
        this.paises = [this.volverPais];
        this.baseRecetas.obtenerRecetasSegunPais(pais['name']).subscribe({
          next: (data) => {
            Object.values(data).forEach((recetas: any) =>
              recetas.forEach((receta: any) =>
                this.paises.push({
                  name: receta['strMeal'],
                  image: receta['strMealThumb'],
                  plate: true,
                  idMeal: receta['idMeal'],
                  favorite: false,
                })
              )
            );
          },
          error: (error) => console.log(error.statusText),
        });
      }
    }
  }
}
