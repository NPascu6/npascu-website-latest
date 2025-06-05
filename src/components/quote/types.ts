export interface FinnhubTrade {
    p: number; // price
    s: string; // symbol
    t: number; // timestamp (ms)
    v: number; // volume
    c?: number | null;
    side?: "bid" | "ask";
}
