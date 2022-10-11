import computeTVL from "./computeTVL";
import type { Balances, StringNumber, Address } from "./types";
export declare function sumMultiBalanceOf(balances: Balances, results: {
    ethCallCount?: number;
    output: {
        output: StringNumber;
        success: boolean;
        input: {
            target: Address;
            params: string[];
        };
    }[];
}, allCallsMustBeSuccessful?: boolean, transformAddress?: (addr: string) => string): void;
export declare function sumSingleBalance(balances: Balances, token: string, balance: string | number): void;
declare type ChainBlocks = {
    [chain: string]: number;
};
export declare function sumChainTvls(chainTvls: Array<(timestamp: number, ethBlock: number, chainBlocks: ChainBlocks) => Promise<Balances>>): (timestamp: number, ethBlock: number, chainBlocks: ChainBlocks) => Promise<{}>;
export { computeTVL };
