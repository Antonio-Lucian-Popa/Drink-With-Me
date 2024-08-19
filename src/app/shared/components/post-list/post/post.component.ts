import { Component, input, Input, OnInit } from '@angular/core';
import { Post } from '../../../interfaces/post';

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
    // You can implement the participation logic here
    // e.g., increment the participation count, send data to the server, etc.
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
