export enum AssetType { ETF = 'ETF', STOCK = 'STOCK', CRYPTO = 'CRYPTO' }
export enum Currency { USD = 'USD', EUR = 'EUR' }

export interface AssetRead {
  id: number;
  ticker: string;
  asset_type: AssetType;
  current_price: number;
  currency: Currency;
}

export interface AssetCreate {
  ticker: string;
  asset_type: AssetType;
  current_price: number;
  currency: Currency;
}

export type AssetUpdate = Partial<AssetCreate>;
