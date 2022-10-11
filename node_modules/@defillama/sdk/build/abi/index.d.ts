import { Address } from "../types";
import { Chain } from "../general";
declare type CallParams = string | number | (string | number)[] | undefined;
export declare function call(params: {
    target: Address;
    abi: string | any;
    block?: number;
    params?: CallParams;
    chain?: Chain;
}): Promise<{
    output: any;
}>;
export declare function multiCall(params: {
    abi: string | any;
    calls: {
        target: Address;
        params?: CallParams;
    }[];
    block?: number;
    target?: Address;
    chain?: Chain;
    requery?: boolean;
}): Promise<{
    output: any[];
}>;
export {};
