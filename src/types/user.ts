export interface UserDataType {
  id: string;
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
  forename: string;
  surname: string;
  displayName: string;
  email: string;
  about: string | null | undefined;
  image: string | null | undefined;
  garages: string[];
  liveries: string[];
}
export type UsersDataType = UserDataType[];

export type CreatorType = Pick<UserDataType, 'id' | 'displayName' | 'image'>;

export interface UserLoginArgs {}

export interface UpdateUserProfileDataType
  extends Pick<
    UserDataType,
    'id' | 'about' | 'forename' | 'surname' | 'email' | 'displayName'
  > {
  imageFiles: Array<File>;
}
