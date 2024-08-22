import { Component, input, Input, OnInit } from '@angular/core';
import { Post } from '../../../interfaces/post';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {


  @Input() post: Post | null = null;

  @Input() userId: string | null = null;

  isPostOwner: boolean = true;


  constructor(private postService: PostService) { }

  ngOnInit(): void {
    // check if the user is the owner of the post
    if(this.post && this.userId) {
      this.isPostOwner = this.post.user.id === this.userId;
    }
    // if the user is the owner of the post, show edit and delete buttons
    // otherwise, hide the buttons
  }

  participate() {
    console.log('User has clicked participate');
    if(this.post && this.userId) {
      this.postService.participPost(this.post.id, this.userId).subscribe({
        next: () => {
          console.log('Participation successful');
          // update the participation count
          if(this.post) {
           // this.post.participants += 1;
            this.post.participantsCount += 1;
            this.post.participated = true;
          }
        },
        error: (error) => {
          console.error('Failed to participate:', error);
        }
      });
    }
  }

  unparticipate() {
    if(this.post && this.userId) {
      this.postService.removeParticipPost(this.post.id, this.userId).subscribe({
        next: (post) => {
          if(this.post && this.post.participantsCount > 0) {
            //this.post.participants = ;
           this.post.participantsCount -= 1;
           this.post.participated = false
          }
        },
        error: (error) => {
          console.error('Failed to participate:', error);
        }
      });
    }
  }

  editPost() {
    console.log('Editing post');
    // Implement edit logic
  }

  deletePost() {
    console.log('Deleting post');
    // Implement delete logic
  }
}
