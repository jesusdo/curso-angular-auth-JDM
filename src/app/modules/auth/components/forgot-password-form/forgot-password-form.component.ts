import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestStatus } from '@models/request-status.models';
import { AuthService } from '@services/auth.service';
@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html'
})
export class ForgotPasswordFormComponent {
  status: RequestStatus = 'init';
  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });
  emailSent = false;
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  sendLink() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email } = this.form.getRawValue();
      this.authService.recovery(email).subscribe({
        next: () => {
          this.status= 'success';
          this.emailSent= true;
        }, error: (e) => {
          this.status= 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

}
