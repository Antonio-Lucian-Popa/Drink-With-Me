import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

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

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    const isInvalid = control ? control.invalid && (control.touched || control.dirty) : false;
    if (controlName === 'lastName') {
      console.log('Control:', isInvalid);
    }
    return isInvalid;
  }

}
