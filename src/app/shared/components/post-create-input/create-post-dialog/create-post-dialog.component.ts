import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { UserPost } from '../../../interfaces/post';

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

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
    ) {
    this.user = data.user;
    this.userProfileImage = data.profileImageUrl;
    this.postForm = this.fb.group({
      description: ''
    });
  }

  ngOnInit(): void {
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  createPost(): void {
    // Handle post creation...
    if (this.user.id && this.user.id !== '') {
     // make post creation request
      this.postService.createPost(this.user.id, this.postForm.value, this.images).subscribe(() => {
        this.dialogRef.close();
        this.postForm.reset();
        this.images = [];
      });
    }
  }

  onImageUpload(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let files: FileList | null = element.files;

    if (files) {
      // Convert FileList to array and iterate
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
