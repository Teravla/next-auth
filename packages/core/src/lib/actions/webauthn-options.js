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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.webAuthnOptions = void 0;
var session_js_1 = require("../utils/session.js");
var webauthn_utils_js_1 = require("../utils/webauthn-utils.js");
/**
 * Returns authentication or registration options for a WebAuthn flow
 * depending on the parameters provided.
 */
function webAuthnOptions(request, options, sessionStore, cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var narrowOptions, provider, action, sessionUser, getUserInfoResponse, _a, userInfo, decision;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    narrowOptions = (0, webauthn_utils_js_1.assertInternalOptionsWebAuthn)(options);
                    provider = narrowOptions.provider;
                    action = ((_b = request.query) !== null && _b !== void 0 ? _b : {}).action;
                    // Action must be either "register", "authenticate", or undefined
                    if (action !== "register" &&
                        action !== "authenticate" &&
                        typeof action !== "undefined") {
                        return [2 /*return*/, {
                                status: 400,
                                body: { error: "Invalid action" },
                                cookies: cookies,
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }];
                    }
                    return [4 /*yield*/, (0, session_js_1.getLoggedInUser)(options, sessionStore)
                        // Extract user info from request
                        // If session user exists, we don't need to call getUserInfo
                    ];
                case 1:
                    sessionUser = _c.sent();
                    if (!sessionUser) return [3 /*break*/, 2];
                    _a = {
                        user: sessionUser,
                        exists: true,
                    };
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, provider.getUserInfo(options, request)];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    getUserInfoResponse = _a;
                    userInfo = getUserInfoResponse === null || getUserInfoResponse === void 0 ? void 0 : getUserInfoResponse.user;
                    decision = (0, webauthn_utils_js_1.inferWebAuthnOptions)(action, !!sessionUser, getUserInfoResponse);
                    switch (decision) {
                        case "authenticate":
                            return [2 /*return*/, (0, webauthn_utils_js_1.getAuthenticationResponse)(narrowOptions, request, userInfo, cookies)];
                        case "register":
                            if (typeof (userInfo === null || userInfo === void 0 ? void 0 : userInfo.email) === "string") {
                                return [2 /*return*/, (0, webauthn_utils_js_1.getRegistrationResponse)(narrowOptions, request, userInfo, cookies)];
                            }
                        default:
                            return [2 /*return*/, {
                                    status: 400,
                                    body: { error: "Invalid request" },
                                    cookies: cookies,
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.webAuthnOptions = webAuthnOptions;
