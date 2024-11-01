import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.models';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]]
  })

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(2), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });
  status: string = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showRegister = false;
  messasgeError = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.register(name, email, password).subscribe({
        next: (response) => {
          console.log(response)
          this.status = 'success';
          this.router.navigate(['/login'])
        }, error: (e) => {
          this.status = 'failed'
          console.log(e)
          if(e.error.statusCode != undefined){
            this.messasgeError = e.error.message
          }else{
            this.messasgeError = 'Mail has been registered'
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUser(){
    if(this.formUser.valid){
      this.statusUser = 'loading'
      const { email } = this.formUser.getRawValue();
      this.authService.isAvailable(email).subscribe({
        next: (data) => {
          console.log(data.isAvailable)
          this.statusUser = 'success';
          if(data.isAvailable){
            this.showRegister = true;
            this.form.controls.email.setValue(email);
          }else{
            this.router.navigate(['/login'], {
              queryParams: {email: email}
            });
          }
        }, error: (e) => {
          this.statusUser = 'failed';

        }
      })
    }else{
      this.formUser.markAllAsTouched();
    }
  }
}
