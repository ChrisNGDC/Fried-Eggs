export class Area {
  name: string;
  code: string;
  image: string
  plate: boolean;
  favorite: boolean;
  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
    this.plate = false;
    this.favorite = false;
    this.image = this.getImage();
  }
  /**
   * @function getImage
   * @description Obtiene una imagen de la bandera del pais/area segun si codigo
   * @returns Un URL a la imagen
   */
  getImage() {
    return 'https://flagsapi.com/' + this.code + '/flat/64.png';
  }
}
