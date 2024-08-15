export interface PostImage {
  postId: string;
  description: string;
  imageUrl: string;
}

export interface PaginatedPostImages {
  content: PostImage[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
}
