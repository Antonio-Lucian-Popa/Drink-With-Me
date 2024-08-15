import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostDialogComponent } from './create-post-dialog/create-post-dialog.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { UserPost } from '../../interfaces/post';

@Component({
  selector: 'app-post-create-input',
  standalone: false,
  templateUrl: './post-create-input.component.html',
  styleUrl: './post-create-input.component.scss'
})
export class PostCreateInputComponent {

  user!: UserPost;

  constructor(public dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    // this.authService.getUserId().then(userId => {

    //   if (userId) {
    //     this.userService.getUserProfileInfo(userId).subscribe({
    //       next: (userProfile) => {
    //         this.user = userProfile;
    //         this.userProfileImage = userProfile.profileImageUrl;
    //       },
    //       error: (error) => {
    //         console.error('Error fetching user profile data:', error);
    //       }
    //     });
    //   }
    // }).catch(error => {
    //   console.error('Error during user detail fetch operation:', error);
    // });
    this.user = {
      id: '1',
      firstName: 'Adrian',
      lastName: 'Lupu',
      profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '80vw',  // Increase width to 80% of the viewport width
      maxWidth: '600px',  // Set maximum width
      height: 'auto',  // Let the height adjust based on content
      maxHeight: '90vh',  // Set a max height to ensure it's not too tall
      data: {
        profileImageUrl: this.user.profileImageUrl,
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle the post creation result
      console.log(result);
    });
  }
}
