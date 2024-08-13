import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { UserPhoto } from './photo.service';

const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root',
})
export class AutheticationService {
  currentUserData: any;
  constructor() {}

  /**
   * @function registerUser
   * @description Recibe un mail y contraseña y lo registra en el sistema
   * @param email
   * @param password
   * @returns Una promesa con las credenciales del nuevo usuario
   */
  async registerUser(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
  /**
   * @function loginUser
   * @description Recibe un mail y contraseña e inicia la sesion en caso de ser correctos
   * @param email 
   * @param password 
   * @returns Una promesa con las credenciales del usuario
   */
  async loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  /**
   * @function resetPassword
   * @description Recibe un mail y le envia uno de reseteo de contraseña
   * @param email 
   * @returns Una promesa vacia
   */
  async resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }
  /**
   * @function signOut
   * @description Cierra la sesion actual
   * @returns Una promesa vacia
   */
  async signOut() {
    return signOut(auth);
  }
  /**
   * @function getData
   * @description Obtiene los datos de la base de datos de el usuario actual
   * @returns Los datos del usuario actual
   */
  async getData() {
    const docRef = doc(db, 'Usuarios', this.currentUserData['uid']);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
    }
    return false;
  }
  /**
   * @function generateUser
   * @description Guarda por primera vez en la base de datos el usuario actual
   * @param nombre 
   */
  async generateUser(nombre: string) {
    await this.getCurrentUser();
    try {
      await setDoc(doc(db, 'Usuarios', this.currentUserData['uid']), {
        Nombre: nombre,
        Foto: {
          id: '-1',
          filepath: 'default',
          webviewPath: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        },
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  /**
   * @function updatePhoto
   * @description Actualiza en la base de datos la imgen del usuario actual
   * @param picUrl 
   */
  async updatePhoto(picUrl: UserPhoto) {
    await this.getCurrentUser();
    try {
      await updateDoc(doc(db, 'Usuarios', this.currentUserData['uid']), {
        Foto: picUrl,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  /**
   * @function getCurrentUser
   * @description Asigna a la variable currentUserData los datos del usuario actual
   */
  async getCurrentUser() {
    this.currentUserData = auth.currentUser;
  }
}
