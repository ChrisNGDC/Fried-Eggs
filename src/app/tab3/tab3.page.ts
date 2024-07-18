import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { AutheticationService } from '../services/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  photo: UserPhoto = {
    id: '-1',
    filepath: 'default',
    webviewPath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  };

  current_user: string | null | undefined;

  constructor(
    private photoService: PhotoService,
    private auth: AutheticationService,
    private router: Router
  ) {
    this.auth.getCurrentUser();
    this.getUsername();
    this.getPicture();
  }

  /**
   * @function takePhoto
   * @description Toma una foto con la camara (guardandola en la base de datos) y la asigna a la mostrada en la app
   */
  takePhoto() {
    this.photoService.takePhoto('0', 'profile-photo').then((x) => {
      this.photo = this.photoService.profilePhotos[0];
      this.auth.getData()
    });
  }
  /**
   * @function logout
   * @description Cierra la sesion actual y vuelve a el inicio de sesion
   */
  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
  /**
   * @function getUsername
   * @description Obtiene el nombre del usuario actual desde sus datos guardados en la base de datos y lo asigna a lo mostrado en la app
   */
  getUsername() {
    this.auth.getData().then((data) => {
      if (data) {
        this.current_user = data['Nombre' as keyof typeof data];
      }
    });
  }
  /**
   * @function getPicture
   * @description Obtiene la imagen del usuario actual desde su datos guardados en la base de datos y la asigna a la mostrada en la app
   */
  getPicture() {
    this.auth.getData().then((data) => {
      if (data) {
        this.photo = data['Foto' as keyof typeof data];
      }
    });
  }
}
