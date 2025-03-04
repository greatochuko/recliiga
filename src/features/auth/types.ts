
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  avatar_url?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone: string;
}
