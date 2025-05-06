import { UserType } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/utils";

export async function fetchUserProfile(userId: string) {
  const data = await fetchApi<UserType>(`/user/${userId}`);
  return data;
}

export async function updateUser(updateProfileData: Partial<UserType>) {
  const data = await fetchApi<UserType>("/user", {
    body: updateProfileData,
    method: "PATCH",
  });
  return data;
}

export type ProfileRegistrationDataType = {
  nickname: string;
  date_of_birth: string;
  city: string;
  sports: string[];
  positions: string[];
  avatar_url: string;
};

export async function completeProfileRegistration(
  updateProfileData: ProfileRegistrationDataType,
) {
  const data = await fetchApi<UserType>("/user/complete-profile", {
    body: updateProfileData,
    method: "POST",
  });
  return data;
}
