// VM always stands for Vending Machine
export type VMRoles = "seller" | "buyer";

export interface JwtUser {
  username: string;
  role: VMRoles;
}

export interface AuthUser extends JwtUser {
  password: string;
}

export interface LoginPayload {
  access_token: string;
}
