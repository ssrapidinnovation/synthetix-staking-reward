"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.abi = exports.cdp = exports.erc20 = exports.eth = exports.util = void 0;
exports.util = __importStar(require("./util"));
exports.eth = __importStar(require("./eth"));
exports.erc20 = __importStar(require("./erc20"));
exports.cdp = __importStar(require("./cdp"));
exports.abi = __importStar(require("./abi"));
var general_1 = require("./general");
var config = {
    setProvider: general_1.setProvider,
};
exports.config = config;
