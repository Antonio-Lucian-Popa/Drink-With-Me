import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      // TODO: call the API to login the user
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
