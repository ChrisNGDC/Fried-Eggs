import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseRecetasService {

  constructor(
    public http: HttpClient
  ) { }
  /**
   * @function obtenerReceta
   * @description Llama a la API para obtener una receta aleatoria
   * @returns Una receta aleatoria en formato json
   */
  obtenerReceta() {
    return this.http.get('https://www.themealdb.com/api/json/v1/1/random.php');
  }
  /**
   * @function obtenerCategorias
   * @description Llama a la API para obtener todas las categorias
   * @returns Todas las categorias en formato json
   */
  obtenerCategorias(){ 
    return this.http.get("https://www.themealdb.com/api/json/v1/1/categories.php");
  }
  /**
   * @function obtenerPaises
   * @description Llama a la API para obtener todos los paises/regiones
   * @returns Todos los paises/regiones en formato json
   */
  obtenerPaises() {
    return this.http.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  }
  /**
   * @function obtenerRecetasSegunCategoria
   * @description Recibe una categoria y llama a la API para obtener todas la recetas que correspondan
   * @returns Todas las recetas de la categoria recibida en formato json
   */
  obtenerRecetasSegunCategoria(categoria: string) {
    return this.http.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + categoria);
  }
  /**
   * @function obtenerRecetaSegunID
   * @description Recibe un ID y llama a la API para obtener la receta que corresponda
   * @returns La receta correspondiente en formato json
   */
  obtenerRecetaSegunID(id: string) {
    return this.http.get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
  }
  /**
   * @function obtenerRecetasSegunPais
   * @description Recibe un pais/region y llama a la API para obtener todas la recetas que correspondan
   * @returns Todas las recetas del pais/region recibida en formato json
   */
  obtenerRecetasSegunPais(pais: string) {
    return this.http.get("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + pais)
  }
}
