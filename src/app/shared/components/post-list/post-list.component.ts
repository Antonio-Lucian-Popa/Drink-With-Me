import { Component, OnInit } from '@angular/core';
import { Post } from '../../interfaces/post';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{

  postList: Post[] = [
    {
      id: '1',
      description: 'Careva la o bere prin Decebal centru?',
      participationCount: 10,
      commentsCount: 5,
      createdAt: new Date().toDateString(),
      user: {
        id: '1',
        firstName: 'Adrian',
        lastName: 'Lupu',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      }
    },
    {
      id: '2',
      description: 'Haideti la o bauta prin Awery la ora 21',
      participationCount: 6,
      commentsCount: 3,
      createdAt: new Date().toDateString(),
      user: {
        id: '2',
        firstName: 'Iulian',
        lastName: 'Beraru',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
      }
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Fetch posts from the server
    // this.postList = this.postService.getPosts();
  }

}
