export interface User {
  username: string;
  deposit: number;
  role: string[];
}

export interface AuthUser extends User {
  password: string;
}
