import { Deferrable } from "@ethersproject/properties";
import { BaseProvider, BlockTag, TransactionRequest } from "@ethersproject/providers";
export declare function call(provider: BaseProvider, data: Deferrable<TransactionRequest>, block: BlockTag, chain?: string): Promise<string>;
