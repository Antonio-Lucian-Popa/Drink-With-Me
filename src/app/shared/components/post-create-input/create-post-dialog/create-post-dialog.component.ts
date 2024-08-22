import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { UserPost } from '../../../interfaces/post';
import { GeolocationService } from '../../../services/geolocation.service';

@Component({
  selector: 'app-create-post-dialog',
  standalone: false,
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent implements OnInit {

  postForm: FormGroup;
  images: string[] = []; // URLs for the preview images
  user!: UserPost;
  userProfileImage!: string;

  counties: any[] = [];
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserPost; profileImageUrl: string },
    private userService: UserService,
    private locationService: GeolocationService
  ) {
    this.user = data.user;
    this.userProfileImage = data.profileImageUrl;

    this.postForm = this.fb.group({
      description: ['', Validators.required],
      county: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCounties();

    // Listen to changes in the county dropdown and update cities accordingly
    this.postForm.get('county')?.valueChanges.subscribe(countyId => {
      this.loadCities(countyId);
      this.postForm.get('city')?.reset();
      this.postForm.get('city')?.enable();
    });
  }

  private loadCounties(): void {
    this.locationService.getCounty().subscribe({
      next: (counties) => this.counties = counties,
      error: (error) => console.error('Failed to load counties:', error)
    });
  }

  private loadCities(countyId: string): void {
    this.locationService.getLocation(countyId).subscribe({
      next: (cities) => this.cities = cities,
      error: (error) => console.error('Failed to load cities:', error)
    });
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  createPost(): void {
    if (this.postForm.valid) {
      const payload = {
        description: this.postForm.get('description')?.value,
        location: this.postForm.get('city')?.value
      }
      this.postService.createPost(this.user.id, payload, this.images).subscribe({
        next: () => {
          this.dialogRef.close();
          this.images = [];
        },
        error: (error) => console.error('Failed to create post:', error)
      });
    }
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.images.push(e.target.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  // Helper method to check if a form field is invalid and touched
  isFieldInvalid(field: string): boolean {
    const control = this.postForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
