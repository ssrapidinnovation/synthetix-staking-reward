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
exports.getHistoricalTokenPrices = exports.getTokenPrices = exports.makeCoingeckoCall = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
function fetchJson(url) {
    return node_fetch_1.default(url).then(function (res) { return res.json(); });
}
function makeCoingeckoCall(url, coingeckoMaxRetries, getCoingeckoLock) {
    return __awaiter(this, void 0, void 0, function () {
        var j, values, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    j = 0;
                    _a.label = 1;
                case 1:
                    if (!(j < coingeckoMaxRetries)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, getCoingeckoLock()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fetchJson(url)];
                case 4:
                    values = _a.sent();
                    return [2 /*return*/, values];
                case 5:
                    e_1 = _a.sent();
                    if (j >= coingeckoMaxRetries - 1) {
                        throw e_1;
                    }
                    return [3 /*break*/, 6];
                case 6:
                    j++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.makeCoingeckoCall = makeCoingeckoCall;
function getTokenPrices(originalIds, url, knownTokenPrices, getCoingeckoLock, coingeckoMaxRetries, prefix) {
    if (prefix === void 0) { prefix = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var tokenPrices, newIds, i, knownPrice, i, tempTokenPrices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenPrices = {};
                    newIds = originalIds.slice();
                    for (i = 0; i < newIds.length; i++) {
                        knownPrice = knownTokenPrices[prefix + newIds[i]];
                        if (knownPrice !== undefined) {
                            tokenPrices[newIds[i]] = knownPrice;
                            newIds.splice(i, 1);
                            i--;
                        }
                    }
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < newIds.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, makeCoingeckoCall("https://api.coingecko.com/api/" + url + "=" + newIds
                            .slice(i, i + 100)
                            .join(",") + "&vs_currencies=usd", coingeckoMaxRetries, getCoingeckoLock)];
                case 2:
                    tempTokenPrices = _a.sent();
                    Object.assign(tokenPrices, tempTokenPrices);
                    Object.entries(tempTokenPrices).forEach(function (tokenPrice) {
                        knownTokenPrices[prefix + tokenPrice[0]] = tokenPrice[1];
                    });
                    _a.label = 3;
                case 3:
                    i += 100;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, tokenPrices];
            }
        });
    });
}
exports.getTokenPrices = getTokenPrices;
var secondsPerHalfDay = Math.round((24 * 3600) / 2);
function getHistoricalTokenPrices(ids, url, timestamp, getCoingeckoLock, coingeckoMaxRetries) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var tokenPrices, _i, ids_1, id, range, closest, _b, _c, price;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tokenPrices = {};
                    _i = 0, ids_1 = ids;
                    _d.label = 1;
                case 1:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                    id = ids_1[_i];
                    return [4 /*yield*/, makeCoingeckoCall(url + "/" + id.toLowerCase() + "/market_chart/range?vs_currency=usd&from=" + (timestamp - secondsPerHalfDay) + "&to=" + (timestamp + secondsPerHalfDay), coingeckoMaxRetries, getCoingeckoLock)];
                case 2:
                    range = _d.sent();
                    if (range.error === undefined && ((_a = range.prices) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        closest = range.prices[0];
                        for (_b = 0, _c = range.prices; _b < _c.length; _b++) {
                            price = _c[_b];
                            if (Math.abs(price[0] - timestamp) < Math.abs(closest[0] - timestamp)) {
                                closest = price;
                            }
                        }
                        tokenPrices[id.toLowerCase()] = {
                            usd: closest[1],
                        };
                    }
                    else {
                        tokenPrices[id.toLowerCase()] = undefined;
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, tokenPrices];
            }
        });
    });
}
exports.getHistoricalTokenPrices = getHistoricalTokenPrices;
