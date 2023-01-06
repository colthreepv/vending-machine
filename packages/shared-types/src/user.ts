// VM always stands for Vending Machine
export type VMRoles = "seller" | "buyer";

export interface JwtUser {
  username: string;
  role: VMRoles;
}

export interface AuthUser extends JwtUser {
  password: string;
}
