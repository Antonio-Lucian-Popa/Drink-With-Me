import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registrationForm: FormGroup;
  birthdayInvalid: boolean = false;

  message = "";
  errorMessage = "";
  showConfirmationBanner = false;  // Controls the visibility of the confirmation banner
  showErrorBanner = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', Validators.required],
      occupation: ['', Validators.required],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to changes in the birthday form control
    this.registrationForm.get('birthday')?.valueChanges.subscribe(value => {
      const age = this.calculateAge(new Date(value));
      this.birthdayInvalid = age < 18;
    });
  }

  onSubmit(): void {

    if (this.registrationForm.invalid || this.birthdayInvalid) {
      this.registrationForm.markAllAsTouched();
      return;
    } else {
      const { firstName, lastName, email, birthday, occupation, password, gender } = this.registrationForm.value;
      const payload = { firstName, lastName, email, birthday, occupation, password, gender };
      this.authService.register(payload).subscribe({
        next: (res) => {
          this.showErrorBanner = false;
          //this.router.navigate(['/sign-in']);
          this.message = res;
          this.showConfirmationBanner = true;
          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (error) => {
          this.showConfirmationBanner = false;
          this.errorMessage = error.message;
          this.showErrorBanner = true;
        }
      })
    }
  }

  // Watch for changes in birthday to check if the user is at least 18 years old
  get birthday() {
    return this.registrationForm.get('birthday');
  }

  ngOnChanges(): void {
    if (this.birthday && this.birthday.value) {
      const age = this.calculateAge(new Date(this.birthday.value));
      this.birthdayInvalid = age < 18;
    }
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    const isInvalid = control ? control.invalid && (control.touched || control.dirty) : false;
    return isInvalid;
  }
}
