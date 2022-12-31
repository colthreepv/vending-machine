// VM always stands for Vending Machine
export type VMRoles = "seller" | "buyer";

export interface User {
  username: string;
  deposit: number;
  role: VMRoles;
}

export interface AuthUser extends User {
  password: string;
}
