import { SignupDataType, UserType } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/utils";

export async function getSession() {
  const { data } = await fetchApi<UserType>("/auth/session");
  return data;
}

export async function login(email: string, password: string) {
  const data = await fetchApi<UserType>("/auth/login", {
    body: {
      email,
      password,
    },
    method: "POST",
  });
  return data;
}

export async function registerUser(signupData: SignupDataType) {
  const data = await fetchApi<UserType>("/auth/signup", {
    body: signupData,
    method: "POST",
  });
  return data;
}

export async function logout() {
  const { data } = await fetchApi<boolean>("/auth/logout", {
    method: "POST",
    body: undefined,
  });
  return data;
}

export async function deleteUser() {
  const data = await fetchApi<boolean>("/user", {
    method: "DELETE",
    body: undefined,
  });
  return data;
}
