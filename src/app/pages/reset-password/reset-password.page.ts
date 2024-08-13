import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/services/authetication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
email:any

  constructor(public route: Router, public authService:AutheticationService) { }

  ngOnInit() {
  }
  /**
   * @function resetPassword
   * @description Manda un mail con un link de reseteo de contraseña al mail puesto en la app
   */
  async resetPassword(){
    this.authService.resetPassword(this.email).then(()=>{
      console.log('reset link sent');
      this.route.navigate(['/login'])
    }

    
    ).catch((error)=>{
      console.log(error);
    })
  }
}
