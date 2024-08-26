import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      const { email, password } = this.loginForm.value;
      const payload = { email, password };
      this.authService.login(payload).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
        },
        error: (error) => {}
      })
    }
  }

  // signInWithFB(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
  //     // Send token to your backend
  //     this.http.post('your-backend-url', { token: user.authToken }).subscribe((response: any) => {
  //       if (response.needsProfileCompletion) {
  //         this.router.navigate(['/complete-profile']);
  //       } else {
  //         this.router.navigate(['/dashboard']);
  //       }
  //     });
  //   });

  // }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    const isInvalid = control ? control.invalid && (control.touched || control.dirty) : false;
    if (controlName === 'lastName') {
      console.log('Control:', isInvalid);
    }
    return isInvalid;
  }

}
