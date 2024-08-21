import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public profilePhotos: UserPhoto[] = [];
  public photos: UserPhoto[] = [];
  constructor(private auth: AutheticationService) { }
  /**
   * @function takePhoto
   * @description Llama a la camara para permitir sacar una foto y la guarda en una variable temporal
   * @param id Id de la foto
   * @param filePath 
   */
  public async takePhoto(id:string, filePath: string) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    if (id == "0") {
      this.profilePhotos.pop()
      this.profilePhotos.unshift({
        id: id,
        filepath: filePath,
        webviewPath: capturedPhoto.webPath!
      });
      await this.savePhoto()
    }
    else {
      this.photos.unshift({
        id: id,
        filepath: filePath,
        webviewPath: capturedPhoto.webPath!
      });
    }
  }
  /**
   * @function savePhoto
   * @description Guarda la foto en la base de datos
   */
  async savePhoto() {
    this.auth.updatePhoto(this.profilePhotos[0])
  }
}

export interface UserPhoto {
  id: string;
  filepath: string;
  webviewPath?: string;
}
