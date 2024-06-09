"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthAction = void 0;
var actions = [
    "providers",
    "session",
    "csrf",
    "signin",
    "signout",
    "callback",
    "verify-request",
    "error",
    "webauthn-options",
];
function isAuthAction(action) {
    return actions.includes(action);
}
exports.isAuthAction = isAuthAction;
