"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizedBinomialCoefficient = exports.binomialCoefficient = void 0;
function binomialCoefficient(n, k) {
    var result = 1;
    if (n < k || k < 0) {
        return 0;
    }
    // take advantage of symmetry
    if (k > n - k) {
        k = n - k;
    }
    for (var x = n - k + 1; x <= n; x += 1) {
        result *= x;
    }
    for (var x = 1; x <= k; x += 1) {
        result /= x;
    }
    return result;
}
exports.binomialCoefficient = binomialCoefficient;
function memoizedBinomialCoefficient() {
    var cache = [];
    return function (n, k) {
        if (cache[n] !== undefined && cache[n][k] !== undefined) {
            return cache[n][k];
        }
        else {
            if (cache[n] === undefined) {
                cache[n] = [];
            }
            var result = binomialCoefficient(n, k);
            cache[n][k] = result;
            return result;
        }
    };
}
exports.memoizedBinomialCoefficient = memoizedBinomialCoefficient;
