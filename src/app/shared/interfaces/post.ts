export interface Post {
  id: string;
  description: string;
  createdAt: string;
  location: Location;
  user: UserPost;
  participantsCount: number;
  numberOfComments: number;
  participated: boolean;
  imageFileNames?: string;
}

export interface UserPost {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export interface Location {
  id: string;
  name: string;
}
