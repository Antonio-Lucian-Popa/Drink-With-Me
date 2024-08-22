export interface UserProfileData {
  userInfo: User;
  userProfileImage: string;
}

export interface UserInformation {
  id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  gender: Gender;
  occupation: string;
  followingCount: number;
  followersCount: number;
  livesIn: string;
  following: boolean;
}

export enum Gender {
  MALE="MALE",
  FEMALE="FEMALE",
}

export interface User {
  id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
}
