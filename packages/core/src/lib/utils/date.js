"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDate = void 0;
/**
 * Takes a number in seconds and returns the date in the future.
 * Optionally takes a second date parameter. In that case
 * the date in the future will be calculated from that date instead of now.
 */
function fromDate(time, date) {
    if (date === void 0) { date = Date.now(); }
    return new Date(date + time * 1000);
}
exports.fromDate = fromDate;
