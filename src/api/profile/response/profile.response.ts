import type { ProfileData } from "../profile.types";

export interface GetProfileResponse {
  success: boolean;
  data: ProfileData;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: null;
  message: string;
}
