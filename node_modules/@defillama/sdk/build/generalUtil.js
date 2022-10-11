"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTVL = exports.sumChainTvls = exports.sumSingleBalance = exports.sumMultiBalanceOf = void 0;
var ethers_1 = require("ethers");
var computeTVL_1 = __importDefault(require("./computeTVL"));
exports.computeTVL = computeTVL_1.default;
// We ignore `sum` as it's never used (only in some SDK wrapper code)
function sumMultiBalanceOf(balances, results, allCallsMustBeSuccessful, transformAddress) {
    if (allCallsMustBeSuccessful === void 0) { allCallsMustBeSuccessful = true; }
    if (transformAddress === void 0) { transformAddress = function (addr) { return addr; }; }
    results.output.map(function (result) {
        var _a;
        if (result.success) {
            var address = transformAddress(result.input.target);
            var balance = result.output;
            if (ethers_1.BigNumber.from(balance).lte(0)) {
                return;
            }
            balances[address] = ethers_1.BigNumber.from((_a = balances[address]) !== null && _a !== void 0 ? _a : 0)
                .add(balance)
                .toString();
        }
        else if (allCallsMustBeSuccessful) {
            console.error(result);
            throw new Error("balanceOf multicall failed");
        }
    });
}
exports.sumMultiBalanceOf = sumMultiBalanceOf;
function sumSingleBalance(balances, token, balance) {
    var _a, _b;
    if (typeof balance === 'number') {
        var prevBalance = (_a = balances[token]) !== null && _a !== void 0 ? _a : 0;
        if (typeof prevBalance !== 'number') {
            throw new Error("Trying to merge token balance and coingecko amount for " + token);
        }
        balances[token] = prevBalance + balance;
    }
    else {
        var prevBalance = ethers_1.BigNumber.from((_b = balances[token]) !== null && _b !== void 0 ? _b : "0");
        balances[token] = prevBalance.add(ethers_1.BigNumber.from(balance)).toString();
    }
}
exports.sumSingleBalance = sumSingleBalance;
function mergeBalances(balances, balancesToMerge) {
    Object.entries(balancesToMerge).forEach(function (balance) {
        sumSingleBalance(balances, balance[0], balance[1]);
    });
}
function sumChainTvls(chainTvls) {
    var _this = this;
    return function (timestamp, ethBlock, chainBlocks) { return __awaiter(_this, void 0, void 0, function () {
        var balances;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    balances = {};
                    return [4 /*yield*/, Promise.all(chainTvls.map(function (chainTvl) { return __awaiter(_this, void 0, void 0, function () {
                            var chainBalances;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, chainTvl(timestamp, ethBlock, chainBlocks)];
                                    case 1:
                                        chainBalances = _a.sent();
                                        mergeBalances(balances, chainBalances);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, balances];
            }
        });
    }); };
}
exports.sumChainTvls = sumChainTvls;
