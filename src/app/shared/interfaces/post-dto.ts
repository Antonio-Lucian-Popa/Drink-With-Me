export interface PostDto {
  id: string;
  description: string;
  createdAt: string;
  user: UserPostDto;
  likes: UserPostDto[];
  numberOfComments: number;
  imageFilenames: string[];
}

export interface UserPostDto {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}
