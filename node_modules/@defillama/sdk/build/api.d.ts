export * as util from "./util";
export * as eth from "./eth";
export * as erc20 from "./erc20";
export * as cdp from "./cdp";
export * as abi from "./abi";
import { setProvider } from "./general";
declare const config: {
    setProvider: typeof setProvider;
};
export { config };
