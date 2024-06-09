"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogger = exports.logger = void 0;
var errors_js_1 = require("../../errors.js");
var red = "\x1b[31m";
var yellow = "\x1b[33m";
var grey = "\x1b[90m";
var reset = "\x1b[0m";
exports.logger = {
    error: function (error) {
        var name = error instanceof errors_js_1.AuthError ? error.type : error.name;
        console.error("".concat(red, "[auth][error]").concat(reset, " ").concat(name, ": ").concat(error.message));
        if (error.cause &&
            typeof error.cause === "object" &&
            "err" in error.cause &&
            error.cause.err instanceof Error) {
            var _a = error.cause, err = _a.err, data = __rest(_a, ["err"]);
            console.error("".concat(red, "[auth][cause]").concat(reset, ":"), err.stack);
            if (data)
                console.error("".concat(red, "[auth][details]").concat(reset, ":"), JSON.stringify(data, null, 2));
        }
        else if (error.stack) {
            console.error(error.stack.replace(/.*/, "").substring(1));
        }
    },
    warn: function (code) {
        var url = "https://warnings.authjs.dev#".concat(code);
        console.warn("".concat(yellow, "[auth][warn][").concat(code, "]").concat(reset), "Read more: ".concat(url));
    },
    debug: function (message, metadata) {
        console.log("".concat(grey, "[auth][debug]:").concat(reset, " ").concat(message), JSON.stringify(metadata, null, 2));
    },
};
/**
 * Override the built-in logger with user's implementation.
 * Any `undefined` level will use the default logger.
 */
function setLogger(newLogger, debug) {
    if (newLogger === void 0) { newLogger = {}; }
    // Turn off debug logging if `debug` isn't set to `true`
    if (!debug)
        exports.logger.debug = function () { };
    if (newLogger.error)
        exports.logger.error = newLogger.error;
    if (newLogger.warn)
        exports.logger.warn = newLogger.warn;
    if (newLogger.debug)
        exports.logger.debug = newLogger.debug;
}
exports.setLogger = setLogger;
