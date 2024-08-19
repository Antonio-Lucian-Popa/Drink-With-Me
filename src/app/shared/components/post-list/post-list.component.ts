import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post } from '../../interfaces/post';
import { PostDto } from '../../interfaces/post-dto';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

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

  @Input() userId!: string;
  @Input() includeFollowers: boolean = false;

  posts: PostDto[] = [];

  page: number = 0;
  size: number = 10;
  morePostsAvailable: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private postService: PostService, private userService: UserService) { }

  ngOnInit(): void {
    // Fetch posts from the server
    // this.postList = this.postService.getPosts();
    this.loadPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'].currentValue) {
      this.loadPosts();
    }
  }

  loadMorePosts() {
    this.page += 1; // Increment the page number to fetch the next page of posts
    this.subscription.add(
      this.postService.findAllPostsByUserId(this.userId, this.page, this.size, this.includeFollowers).subscribe((posts) => {
        // Append the new posts to the existing ones
        this.posts = [...this.posts, ...posts.content];
        // Update the morePostsAvailable flag
        this.morePostsAvailable = posts.totalPages > (posts.pageable.pageNumber + 1);
      })
    );
  }

  loadPosts(page: number = 0, size: number = 10): void {
   if(this.userId) {
    this.postService.findAllPostsByUserId(this.userId, page, size, this.includeFollowers).subscribe({
      next: (response) => {
        console.log(response)
        this.posts = response.content;
        this.page = response.pageable.pageNumber;
        this.size = response.pageable.pageSize;
        // Check if there are more pages available
        this.morePostsAvailable = response.totalPages > (response.pageable.pageNumber + 1);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
   }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
