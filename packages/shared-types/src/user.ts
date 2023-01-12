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

export interface JwtContents {
  sub: string; // mario
  role: string; // seller
  jti: string; // jo0R - short random id to track token sequence
  iat: number; // 1620000000
  exp: number; // 1620000000
}
