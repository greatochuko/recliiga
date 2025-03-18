import { UserType } from "@/contexts/AuthContext";
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
