import { Address } from "../types";
import { Chain } from "../general";
export declare function info(tokenAddress: Address, chain?: Chain): Promise<{
    output: {
        symbol: any;
        decimals: any;
    };
}>;
export declare function symbol(tokenAddress: Address, chain?: Chain): Promise<{
    output: any;
}>;
export declare function decimals(tokenAddress: Address, chain?: Chain): Promise<{
    output: any;
}>;
export declare function totalSupply(params: {
    target: Address;
    block?: number;
    decimals?: number;
    chain?: Chain;
}): Promise<{
    output: string;
}>;
export declare function balanceOf(params: {
    target: Address;
    owner: Address;
    block?: number;
    decimals?: number;
    chain?: Chain;
}): Promise<{
    output: string;
}>;
