export interface UserDataType {
  id: string;
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
  forename: string;
  surname: string;
  displayName: string;
  email: string;
  about: string | undefined;
  image: string | undefined;
  garages: string[];
  liveries: string[];
}
export type UsersDataType = UserDataType[];

export type CreatorType = Pick<UserDataType, 'id' | 'displayName' | 'image'>;
