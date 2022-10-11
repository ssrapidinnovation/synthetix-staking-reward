import { Address } from "../types";
declare function getCompoundAssets(params: {
    targets: Address[];
    block?: number;
}): Promise<{
    "0x0000000000000000000000000000000000000000": string;
}>;
declare function getAllAssetsLocked(params: {
    targets: Address[];
    block?: number;
}): Promise<void>;
declare function getMakerAssets(params: {
    targets: Address[];
    block?: number;
}): Promise<void>;
declare function getAaveAssets(params: {
    targets: Address[];
    block?: number;
}): Promise<void>;
declare const compound: {
    getAssetsLocked: typeof getCompoundAssets;
};
declare const aave: {
    getAssetsLocked: typeof getAaveAssets;
};
declare const maker: {
    getAssetsLocked: typeof getMakerAssets;
};
export { getAllAssetsLocked as getAssetsLocked, compound, aave, maker };
