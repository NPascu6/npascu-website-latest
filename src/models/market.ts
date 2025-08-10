export interface FinnhubOrderBookDto {
    symbol: string;
    bids: [number, number][]; // [price, volume]
    asks: [number, number][]; // [price, volume]
}

export interface FinnhubQuoteDto {
    c: number; // current price
    h: number; // high price of the day
    l: number; // low price of the day
    o: number; // open price of the day
    pc: number; // previous close price
    t: number; // timestamp
}

export interface FinnhubTradeDto {
    p: number; // price
    s: string; // symbol
    t: number; // timestamp
    v: number; // volume
    c?: number | null;
    side?: "bid" | "ask";
}

export interface DeductionEstimateResponse {
    taxableIncome: number;
    totalTax: number;
    breakdown: Record<string, number>;
}

export interface AllowanceDto {
    canton: string;
    year: number;
    [key: string]: number | string;
}
