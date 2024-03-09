export type User = {
  email: string;
  sub: number;
  role: string;
  name: string;
  avatar: string;
};

export type BackendTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginResponse = {
  data: {
    backendTokens: BackendTokens;
    user: User;
  };
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  loginWithApi: (userData: LoginData) => void;
  logout: () => void;
  backendTokens: BackendTokens | null;
};
