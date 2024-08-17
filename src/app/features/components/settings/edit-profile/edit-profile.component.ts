import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

  profileForm: FormGroup;
  profileImagePreview: string | ArrayBuffer = 'https://via.placeholder.com/150';

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      profileImage: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      occupation: [''],
      birthday: ['', [Validators.required, this.ageValidator]]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImagePreview = e.target?.result || '';
      };
      reader.readAsDataURL(file);
      this.profileForm.patchValue({
        profileImage: file
      });
    }
  }

  ageValidator(control: any) {
    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 ? null : { underage: true };
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Handle form submission
      console.log(this.profileForm.value);
    } else {
      // Handle form errors
      console.log('Form is invalid');
    }
  }
}
