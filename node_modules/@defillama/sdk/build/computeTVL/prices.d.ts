export interface TokenPrices {
    [token: string]: {
        usd: number;
    } | undefined;
}
export declare type GetCoingeckoLog = () => Promise<any>;
export declare function makeCoingeckoCall(url: string, coingeckoMaxRetries: number, getCoingeckoLock: GetCoingeckoLog): Promise<any>;
export declare function getTokenPrices(originalIds: string[], url: string, knownTokenPrices: TokenPrices, getCoingeckoLock: GetCoingeckoLog, coingeckoMaxRetries: number, prefix?: string): Promise<TokenPrices>;
export declare function getHistoricalTokenPrices(ids: string[], url: string, timestamp: number, getCoingeckoLock: GetCoingeckoLog, coingeckoMaxRetries: number): Promise<TokenPrices>;
