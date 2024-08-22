import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post } from '../../interfaces/post';
import { PostDto } from '../../interfaces/post-dto';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Page } from '../../interfaces/page';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{

  // postList: Post[] = [
  //   {
  //     id: '1',
  //     description: 'Careva la o bere prin Decebal centru?',
  //     participationCount: 10,
  //     commentsCount: 5,
  //     createdAt: new Date().toDateString(),
  //     user: {
  //       id: '1',
  //       firstName: 'Adrian',
  //       lastName: 'Lupu',
  //       profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  //     }
  //   },
  //   {
  //     id: '2',
  //     description: 'Haideti la o bauta prin Awery la ora 21',
  //     participationCount: 6,
  //     commentsCount: 3,
  //     createdAt: new Date().toDateString(),
  //     user: {
  //       id: '2',
  //       firstName: 'Iulian',
  //       lastName: 'Beraru',
  //       profileImageUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
  //     }
  //   }
  // ];
  @Input() userId!: string;
  @Input() includeFollowers: boolean = false;

  @Input() county!: string;
  @Input() city!: string;

  posts: Post[] = [];

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  morePostsAvailable: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private postService: PostService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] || changes['county'] || changes['city']) {
      this.resetPagination();
      this.loadPosts();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMorePosts(): void {
    this.page += 1;
    this.loadPosts();
  }

  private loadPosts(): void {
    if (this.userId && this.includeFollowers && !this.county && !this.city) {
      this.loadPostsByUserId();
    } else if (this.county && this.city) {
      this.loadPostsByLocation();
    }
  }

  private loadPostsByUserId(): void {
    this.subscription.add(
      this.postService.findAllPostsByUserId(this.userId, this.page, this.size, this.includeFollowers).subscribe({
        next: (response) => {
          this.handlePostResponse(response);
        },
        error: (error) => {
          console.error('Error loading posts by user ID:', error);
        },
      })
    );
  }

  private loadPostsByLocation(): void {
    console.log('Loading posts by location:', this.county, this.city);
    this.subscription.add(
      this.postService.getPostsByLocation(this.userId, this.county, this.city, this.page, this.size).subscribe({
        next: (response: Page<Post>) => {
          this.handlePostResponse(response);
        },
        error: (error) => {
          console.error('Error loading posts by location:', error);
        },
      })
    );
  }

  private handlePostResponse(response: Page<Post>): void {
    this.posts = [...this.posts, ...response.content];
    this.page = response.number;
    this.size = response.size;
    this.totalPages = response.totalPages;
    this.morePostsAvailable = this.page + 1 < this.totalPages;
  }

  private resetPagination(): void {
    this.page = 0;
    this.posts = [];
    this.morePostsAvailable = false;
  }
}
