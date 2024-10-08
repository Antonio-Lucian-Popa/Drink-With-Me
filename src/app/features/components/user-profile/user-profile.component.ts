import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserInformation } from '../../../shared/interfaces/user-profile-data';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  private routeSub!: Subscription;

  currentUserId!: string | null; // current user id from url
  userId!: string | null; // current user id from token
  user!: UserInformation;

  isUserProfile = false;


  constructor(private route: ActivatedRoute, private userService: UserService, public dialog: MatDialog, private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.currentUserId = params.get('id');

      this.authService.getUserId().then((userId) => {
        this.userId = userId;
        if (this.userId) {
          this.loadUserInfo(this.userId);
        }
      });
    });

    // this.postService.postDeleted.subscribe((postId: string) => {
    //   this.user.totalPosts--;
    // });
  }

  loadUserInfo(userId: string): void {
   if(this.currentUserId && userId) {
    this.userService.getUserProfileInfo(this.currentUserId, userId).subscribe({
      next: (data) => {
        this.user = data;
        this.isUserProfile = this.userId == data.id;
      },
      error: (error) => {
        console.error('Error fetching user profile data:', error);
      }
    });
   }
  }

  follow(): void {
    if(this.currentUserId && this.userId) {
      this.userService.followUser(this.currentUserId, this.userId).subscribe({
        next: (data) => {
          console.log('Followed user:', data);
          this.user.following = true;
          if(this.userId) this.loadUserInfo(this.userId);
        },
        error: (error) => {
          console.error('Error following user:', error);
          this.user.following = false;
        }
      });
    }
  }

  unfollow(): void {
    if(this.currentUserId && this.userId) {
      this.userService.unfollowUser(this.currentUserId, this.userId).subscribe({
        next: (data) => {
          console.log('Followed user:', data);
          this.user.following = false;
          if(this.userId) this.loadUserInfo(this.userId);
        },
        error: (error) => {
          console.error('Error following user:', error);
          this.user.following = true;
        }
      });
    }
  }

  onBack(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
