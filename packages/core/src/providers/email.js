"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Kepts for backwards compatibility
// Remove this import and encourage users
// to import it from @auth/core/providers/nodemailer directly
var nodemailer_js_1 = require("./nodemailer.js");
/**
 * @deprecated
 *
 * Import this provider from the `providers/nodemailer` submodule instead of `providers/email`.
 *
 * To log in with nodemailer, change `signIn("email")` to `signIn("nodemailer")`
 */
function Email(config) {
    return __assign(__assign({}, (0, nodemailer_js_1.default)(config)), { id: "email", name: "Email" });
}
exports.default = Email;
