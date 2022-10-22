export interface UserDataType {
  id: string;
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
  forename: string | null | undefined;
  surname: string | null | undefined;
  displayName: string;
  email: string;
  about: string | null | undefined;
  image: string | null | undefined;
  garages: string[];
  liveries: string[];
}
export type PublicUserDataType = Pick<
  UserDataType,
  'id' | 'about' | 'displayName' | 'image' | 'liveries'
>;

export type UsersDataType = UserDataType[];

export type CreatorType = Pick<UserDataType, 'id' | 'displayName' | 'image'>;

export interface CreateUserProfileDataType
  extends Partial<Pick<UserDataType, 'forename' | 'surname'>>,
    Pick<UserDataType, 'email' | 'displayName'> {}

export interface UpdateUserProfileDataType
  extends Pick<
    UserDataType,
    'about' | 'forename' | 'surname' | 'email' | 'displayName'
  > {
  imageFiles: File | null;
}
