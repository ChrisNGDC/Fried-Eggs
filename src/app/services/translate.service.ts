import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }
  
  /**
   * @function traslate
   * @description Recibe texto en un idioma y lo traduce a otro
   * @param text Texto a traducir
   * @returns Texto traducido
   */
  async traslate(text: string) {
    let translatedText: string = text;
    // encontrar API para traducir instrucciones
    return translatedText;
  }
}
