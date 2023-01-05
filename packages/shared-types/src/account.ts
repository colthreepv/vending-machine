export interface BuyPayload {
  product: string;
  qty: number;
}

export type Change = [number, number, number, number, number];

export interface BuyResponse {
  spent: number;
  product: string;
  qty: number;
  change: Change;
}
