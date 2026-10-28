export interface UpdateProfileRequest {
  username: string;
  deleteProfileImage: boolean;
  profileImage?: File;
}
