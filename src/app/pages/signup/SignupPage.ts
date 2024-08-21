import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/services/authetication.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm!: FormGroup;

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AutheticationService, public router : Router) { }
  /**
   * @function ngOnInit
   * @description Crea el formulario de la app con las reglas pertinentes
   */
  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      password: ['', [   
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
      Validators.required,
      ] ]
    });
  }

  get errorControl() {
    return this.regForm.controls;
  }
  /**
   * @function signUp
   * @description Registra al usuario con los datos puesto en el formulario de la app
   */
  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    if (this.regForm.valid) {
      const user = await this.authService.registerUser(this.regForm.value.email,this.regForm.value.password).catch((error)=> {
        console.log(error);
        loading.dismiss()
      })

      if(user){
        await this.authService.generateUser(this.regForm.value.fullname)
        loading.dismiss()
        this.router.navigate(['/tabs'])
      }else {
        console.log('provide correct values')
      }
    }
    loading.dismiss()
  }
}