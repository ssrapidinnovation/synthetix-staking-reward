import { Address } from "../types";
import { Chain } from "../general";
export declare function getBalance(params: {
    target: Address;
    block?: number;
    decimals?: number;
    chain?: Chain;
}): Promise<{
    output: string;
}>;
export declare function getBalances(params: {
    targets: Address[];
    block?: number;
    decimals?: number;
    chain?: Chain;
}): Promise<{
    output: {
        target: string;
        balance: string;
    }[];
}>;
