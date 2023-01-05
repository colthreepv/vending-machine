export interface BuyPayload {
  product: string;
  qty: number;
}

export interface BuyResponse {
  spent: number;
  product: string;
  qty: number;
  change: [number, number, number, number, number];
}
