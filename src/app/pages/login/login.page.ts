import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/services/authetication.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  constructor(public route: Router,public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AutheticationService) { }

  /**
   * @function ngOnInit
   * @description Crea el formulario de la app con las reglas pertinentes
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      password: ['', [  Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ] ]
    });
  }
  get errorControl() {
    return this.loginForm.controls;
  }
  /**
   * @function login
   * @description Realiza el inicio de sesion segun los datos puestos en el formulario de la app
   */
  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if (this.loginForm.valid) {
      const user = await this.authService.loginUser(this.loginForm.value.email,this.loginForm.value.password).catch((error)=> {
        console.log(error);
        loading.dismiss()
      })

      if(user){
        loading.dismiss()
        this.route.navigate(['/tabs'])
      }else {
        console.log('provide correct values')
      }
    }
    loading.dismiss()
  }


}
