"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.maker = exports.aave = exports.compound = exports.getAssetsLocked = void 0;
var graphql_request_1 = require("graphql-request");
var general_1 = require("../general");
function getCompoundAssets(params) {
    return __awaiter(this, void 0, void 0, function () {
        var totalCollateralValueInEth, queries, i, addresses, query, req;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    totalCollateralValueInEth = 0;
                    queries = [];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < params.targets.length)) return [3 /*break*/, 4];
                    addresses = params.targets.slice(i, i + 1000);
                    query = graphql_request_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    {\n      accounts(where:{\n        id_in:[", "]\n      }) {\n        id\n        totalCollateralValueInEth\n        tokens{\n          symbol\n          supplyBalanceUnderlying\n        }\n      }\n    }\n    "], ["\n    {\n      accounts(where:{\n        id_in:[", "]\n      }) {\n        id\n        totalCollateralValueInEth\n        tokens{\n          symbol\n          supplyBalanceUnderlying\n        }\n      }\n    }\n    "])), addresses.map(function (addr) { return "\"" + addr.toLowerCase() + "\""; }).join(","));
                    return [4 /*yield*/, graphql_request_1.request("https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2", query).then(function (data) {
                            return data.accounts.forEach(function (account) {
                                totalCollateralValueInEth += Number(account.totalCollateralValueInEth);
                            });
                        })];
                case 2:
                    req = _b.sent();
                    queries.push(req);
                    _b.label = 3;
                case 3:
                    i += 1000;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, Promise.all(queries)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, (_a = {},
                            _a[general_1.ETHER_ADDRESS] = Math.floor(totalCollateralValueInEth * Math.pow(10, 18)).toString(),
                            _a)];
            }
        });
    });
}
function getAllAssetsLocked(params) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
exports.getAssetsLocked = getAllAssetsLocked;
function getMakerAssets(params) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
function getAaveAssets(params) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
var compound = {
    getAssetsLocked: getCompoundAssets,
};
exports.compound = compound;
var aave = {
    getAssetsLocked: getAaveAssets,
};
exports.aave = aave;
var maker = {
    getAssetsLocked: getMakerAssets,
};
exports.maker = maker;
var templateObject_1;
/*
cdp: {
      getAssetsLocked: (options) => cdp('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 1000, combine: 'balances'} }),
      maker: {
        tokens: (options) => maker('tokens', { ...options }),
        getAssetsLocked: (options) => maker('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 3000, combine: 'balances'} })
      },
      compound: {
        tokens: (options) => compound('tokens', { ...options }),
        getAssetsLocked: (options) => compound('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 1000, combine: 'balances'} })
      }
    },
    */
