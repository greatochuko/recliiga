import { UserType } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/utils";

export type UpdateProfileData = {
  nickname: string;
  date_of_birth: string;
  city: string;
  sports: string[];
  positions: string[];
  avatar_url: string;
};

export async function updateProfile(updateProfileData: UpdateProfileData) {
  const data = await fetchApi<UserType>("/user", {
    body: updateProfileData,
    method: "PATCH",
  });
  return data;
}

export async function checkProfileCompletion() {
  const data = await fetchApi<boolean>("/user/profile-complete");
  return data.data;
}
