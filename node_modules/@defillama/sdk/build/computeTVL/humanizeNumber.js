"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanizeNumber = void 0;
function humanizeNumber(amount) {
    var quantifiers = [
        [Math.pow(10, 9), "B"],
        [Math.pow(10, 6), "M"],
        [Math.pow(10, 3), "k"],
    ];
    for (var _i = 0, quantifiers_1 = quantifiers; _i < quantifiers_1.length; _i++) {
        var _a = quantifiers_1[_i], denominator = _a[0], letter = _a[1];
        if (amount > denominator) {
            return (amount / denominator).toFixed(2) + " " + letter;
        }
    }
    return amount.toString();
}
exports.humanizeNumber = humanizeNumber;
