export interface Post {
  id: string;
  description: string;
  imageUrl?: string;
  participationCount: number;
  commentsCount: number;
  createdAt: string;
  user: UserPost;
}

export interface UserPost {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}
