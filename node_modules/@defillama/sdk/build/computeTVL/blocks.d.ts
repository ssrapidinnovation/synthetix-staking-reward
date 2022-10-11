import type { Chain } from "../general";
export declare const chainsForBlocks: Chain[];
export declare function getChainBlocks(timestamp: number, chains?: Chain[]): Promise<{
    [chain: string]: number;
}>;
export declare function getBlocks(timestamp: number): Promise<{
    ethereumBlock: number;
    chainBlocks: {
        [chain: string]: number;
    };
}>;
export declare function getCurrentBlocks(): Promise<{
    timestamp: number;
    ethereumBlock: number;
    chainBlocks: {
        [chain: string]: number;
    };
}>;
