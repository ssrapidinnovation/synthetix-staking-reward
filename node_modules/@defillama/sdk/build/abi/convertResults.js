"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("@ethersproject/bignumber");
var lodash_1 = __importDefault(require("lodash"));
function stringifyBigNumbers(result, final) {
    Object.keys(result).forEach(function (key) {
        try {
            final[key] = lodash_1.default.cloneDeep(result[key]);
            if (bignumber_1.BigNumber.isBigNumber(result[key]) ||
                typeof result[key] === "number") {
                final[key] = result[key].toString();
            }
            if (typeof final[key] === "object") {
                stringifyBigNumbers(result[key], final[key]);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
function containsNamedResults(obj) {
    return Object.keys(obj).some(function (key) { return isNaN(Number(key)); }); // Are there any non-numeric keys?
}
function default_1(results) {
    if (typeof results === "string" || typeof results === "boolean") {
        return results;
    }
    var convertedResults = {};
    if (results instanceof Array && !containsNamedResults(results)) {
        // Match every idiosynchrasy of the SDK
        convertedResults = [];
    }
    if (bignumber_1.BigNumber.isBigNumber(results) || typeof results === "number") {
        convertedResults = results.toString();
    }
    else {
        stringifyBigNumbers(results, convertedResults);
    }
    if (results instanceof Array) {
        if (results.length === 1) {
            return convertedResults[0];
        }
        else {
            // Some calls return the extra __length__ parameter (I think when some results are named)
            if (containsNamedResults(convertedResults)) {
                convertedResults["__length__"] = results.length;
            }
        }
    }
    return convertedResults;
}
exports.default = default_1;
