export type ValidCoin = "5" | "10" | "20" | "50" | "100";
export type Coins = {
  [key in ValidCoin]: number;
};

export const validCoinList: ValidCoin[] = ["5", "10", "20", "50", "100"];

export type DepositPayload = Partial<Coins>;

export interface Product {
  name: string;
  owner: string; // username
  price: number; // value is expressed in cents, ex: 1000 = 10.00
  quantity: number;
}

export interface ProductCreatePayload {
  name: string;
  price: number;
  quantity: number;
}

export interface ProductUpdatePayload {
  price: number;
  quantity: number;
}
