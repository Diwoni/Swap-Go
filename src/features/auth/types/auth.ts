export type User = {
  id: string;
  password: string;
  email: string;
  name: string;
  address: Address;
};

export type Address = {
  country: string;
  region: string;
  street?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
