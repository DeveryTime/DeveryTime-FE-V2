import client from "../client";
import type { UpdateProfileRequest } from "./request/profile.request";
import type {
  GetProfileResponse,
  UpdateProfileResponse,
} from "./response/profile.response";
import type { ProfileData } from "./profile.types";

const getMyProfile = async (): Promise<ProfileData> => {
  const response = await client.get<GetProfileResponse>("/users/me");

  return response.data.data;
};

const updateMyProfile = async (
  request: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          username: request.username,
          deleteProfileImage: request.deleteProfileImage,
        }),
      ],
      {type: "application/json"},
    ),
  );

  if (request.profileImage) {
    formData.append("profileImage", request.profileImage);
  }

  const response = await client.patch<UpdateProfileResponse>(
    "/users/me",
    formData,
  );

  return response.data;
};

const profileApi = {
  getMyProfile,
  updateMyProfile,
};

export default profileApi;
