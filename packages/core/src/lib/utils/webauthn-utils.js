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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToTransports = exports.transportsToString = exports.toBase64 = exports.fromBase64 = exports.assertInternalOptionsWebAuthn = exports.verifyRegister = exports.verifyAuthenticate = exports.getAuthenticationResponse = exports.getRegistrationResponse = exports.inferWebAuthnOptions = void 0;
var errors_js_1 = require("../../errors.js");
var checks_js_1 = require("../actions/callback/oauth/checks.js");
var web_js_1 = require("./web.js");
/**
 * Infers the WebAuthn options based on the provided parameters.
 *
 * @param action - The WebAuthn action to perform (optional).
 * @param loggedInUser - The logged-in user (optional).
 * @param userInfoResponse - The response containing user information (optional).
 *
 * @returns The WebAuthn action to perform, or null if no inference could be made.
 */
function inferWebAuthnOptions(action, loggedIn, userInfoResponse) {
    var _a = userInfoResponse !== null && userInfoResponse !== void 0 ? userInfoResponse : {}, user = _a.user, _b = _a.exists, exists = _b === void 0 ? false : _b;
    switch (action) {
        case "authenticate": {
            /**
             * Always allow explicit authentication requests.
             */
            return "authenticate";
        }
        case "register": {
            /**
             * Registration is only allowed if:
             * - The user is logged in, meaning the user wants to register a new authenticator.
             * - The user is not logged in and provided user info that does NOT exist, meaning the user wants to register a new account.
             */
            if (user && loggedIn === exists)
                return "register";
            break;
        }
        case undefined: {
            /**
             * When no explicit action is provided, we try to infer it based on the user info provided. These are the possible cases:
             * - Logged in users must always send an explit action, so we bail out in this case.
             * - Otherwise, if no user info is provided, the desired action is authentication without pre-defined authenticators.
             * - Otherwise, if the user info provided is of an existing user, the desired action is authentication with their pre-defined authenticators.
             * - Finally, if the user info provided is of a non-existing user, the desired action is registration.
             */
            if (!loggedIn) {
                if (user) {
                    if (exists) {
                        return "authenticate";
                    }
                    else {
                        return "register";
                    }
                }
                else {
                    return "authenticate";
                }
            }
            break;
        }
    }
    // No decision could be made
    return null;
}
exports.inferWebAuthnOptions = inferWebAuthnOptions;
/**
 * Retrieves the registration response for WebAuthn options request.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - The user information.
 * @param resCookies - Optional cookies to be included in the response.
 * @returns A promise that resolves to the WebAuthnOptionsResponse.
 */
function getRegistrationResponse(options, request, user, resCookies) {
    return __awaiter(this, void 0, void 0, function () {
        var regOptions, cookie;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRegistrationOptions(options, request, user)
                    // Get signed cookie
                ];
                case 1:
                    regOptions = _a.sent();
                    return [4 /*yield*/, checks_js_1.webauthnChallenge.create(options, regOptions.challenge, user)];
                case 2:
                    cookie = (_a.sent()).cookie;
                    return [2 /*return*/, {
                            status: 200,
                            cookies: __spreadArray(__spreadArray([], (resCookies !== null && resCookies !== void 0 ? resCookies : []), true), [cookie], false),
                            body: {
                                action: "register",
                                options: regOptions,
                            },
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }];
            }
        });
    });
}
exports.getRegistrationResponse = getRegistrationResponse;
/**
 * Retrieves the authentication response for WebAuthn options request.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - Optional user information.
 * @param resCookies - Optional array of cookies to be included in the response.
 * @returns A promise that resolves to a WebAuthnOptionsResponse object.
 */
function getAuthenticationResponse(options, request, user, resCookies) {
    return __awaiter(this, void 0, void 0, function () {
        var authOptions, cookie;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthenticationOptions(options, request, user)
                    // Get signed cookie
                ];
                case 1:
                    authOptions = _a.sent();
                    return [4 /*yield*/, checks_js_1.webauthnChallenge.create(options, authOptions.challenge)];
                case 2:
                    cookie = (_a.sent()).cookie;
                    return [2 /*return*/, {
                            status: 200,
                            cookies: __spreadArray(__spreadArray([], (resCookies !== null && resCookies !== void 0 ? resCookies : []), true), [cookie], false),
                            body: {
                                action: "authenticate",
                                options: authOptions,
                            },
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }];
            }
        });
    });
}
exports.getAuthenticationResponse = getAuthenticationResponse;
function verifyAuthenticate(options, request, resCookies) {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, provider, data, credentialID, authenticator, expectedChallenge, verification, relayingParty, e_1, verified, authenticationInfo, newCounter, e_2, account, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adapter = options.adapter, provider = options.provider;
                    data = request.body && typeof request.body.data === "string"
                        ? JSON.parse(request.body.data)
                        : undefined;
                    if (!data ||
                        typeof data !== "object" ||
                        !("id" in data) ||
                        typeof data.id !== "string") {
                        throw new errors_js_1.AuthError("Invalid WebAuthn Authentication response");
                    }
                    credentialID = toBase64(fromBase64(data.id));
                    return [4 /*yield*/, adapter.getAuthenticator(credentialID)];
                case 1:
                    authenticator = _a.sent();
                    if (!authenticator) {
                        throw new errors_js_1.AuthError("WebAuthn authenticator not found in database: ".concat(JSON.stringify({
                            credentialID: credentialID,
                        })));
                    }
                    return [4 /*yield*/, checks_js_1.webauthnChallenge.use(options, request.cookies, resCookies)
                        // Verify the response
                    ];
                case 2:
                    expectedChallenge = (_a.sent()).challenge;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    relayingParty = provider.getRelayingParty(options, request);
                    return [4 /*yield*/, provider.simpleWebAuthn.verifyAuthenticationResponse(__assign(__assign({}, provider.verifyAuthenticationOptions), { expectedChallenge: expectedChallenge, response: data, authenticator: fromAdapterAuthenticator(authenticator), expectedOrigin: relayingParty.origin, expectedRPID: relayingParty.id }))];
                case 4:
                    verification = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    throw new errors_js_1.WebAuthnVerificationError(e_1);
                case 6:
                    verified = verification.verified, authenticationInfo = verification.authenticationInfo;
                    // Make sure the response was verified
                    if (!verified) {
                        throw new errors_js_1.WebAuthnVerificationError("WebAuthn authentication response could not be verified.");
                    }
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    newCounter = authenticationInfo.newCounter;
                    return [4 /*yield*/, adapter.updateAuthenticatorCounter(authenticator.credentialID, newCounter)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _a.sent();
                    throw new errors_js_1.AdapterError("Failed to update authenticator counter. This may cause future authentication attempts to fail. ".concat(JSON.stringify({
                        credentialID: credentialID,
                        oldCounter: authenticator.counter,
                        newCounter: authenticationInfo.newCounter,
                    })), e_2);
                case 10: return [4 /*yield*/, adapter.getAccount(authenticator.providerAccountId, provider.id)];
                case 11:
                    account = _a.sent();
                    if (!account) {
                        throw new errors_js_1.AuthError("WebAuthn account not found in database: ".concat(JSON.stringify({
                            credentialID: credentialID,
                            providerAccountId: authenticator.providerAccountId,
                        })));
                    }
                    return [4 /*yield*/, adapter.getUser(account.userId)];
                case 12:
                    user = _a.sent();
                    if (!user) {
                        throw new errors_js_1.AuthError("WebAuthn user not found in database: ".concat(JSON.stringify({
                            credentialID: credentialID,
                            providerAccountId: authenticator.providerAccountId,
                            userID: account.userId,
                        })));
                    }
                    return [2 /*return*/, {
                            account: account,
                            user: user,
                        }];
            }
        });
    });
}
exports.verifyAuthenticate = verifyAuthenticate;
function verifyRegister(options, request, resCookies) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, data, _a, expectedChallenge, user, verification, relayingParty, e_3, account, authenticator;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = options.provider;
                    data = request.body && typeof request.body.data === "string"
                        ? JSON.parse(request.body.data)
                        : undefined;
                    if (!data ||
                        typeof data !== "object" ||
                        !("id" in data) ||
                        typeof data.id !== "string") {
                        throw new errors_js_1.AuthError("Invalid WebAuthn Registration response");
                    }
                    return [4 /*yield*/, checks_js_1.webauthnChallenge.use(options, request.cookies, resCookies)];
                case 1:
                    _a = _b.sent(), expectedChallenge = _a.challenge, user = _a.registerData;
                    if (!user) {
                        throw new errors_js_1.AuthError("Missing user registration data in WebAuthn challenge cookie");
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    relayingParty = provider.getRelayingParty(options, request);
                    return [4 /*yield*/, provider.simpleWebAuthn.verifyRegistrationResponse(__assign(__assign({}, provider.verifyRegistrationOptions), { expectedChallenge: expectedChallenge, response: data, expectedOrigin: relayingParty.origin, expectedRPID: relayingParty.id }))];
                case 3:
                    verification = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _b.sent();
                    throw new errors_js_1.WebAuthnVerificationError(e_3);
                case 5:
                    // Make sure the response was verified
                    if (!verification.verified || !verification.registrationInfo) {
                        throw new errors_js_1.WebAuthnVerificationError("WebAuthn registration response could not be verified");
                    }
                    account = {
                        providerAccountId: toBase64(verification.registrationInfo.credentialID),
                        provider: options.provider.id,
                        type: provider.type,
                    };
                    authenticator = {
                        providerAccountId: account.providerAccountId,
                        counter: verification.registrationInfo.counter,
                        credentialID: toBase64(verification.registrationInfo.credentialID),
                        credentialPublicKey: toBase64(verification.registrationInfo.credentialPublicKey),
                        credentialBackedUp: verification.registrationInfo.credentialBackedUp,
                        credentialDeviceType: verification.registrationInfo.credentialDeviceType,
                        transports: transportsToString(data.response
                            .transports),
                    };
                    // Return created stuff
                    return [2 /*return*/, {
                            user: user,
                            account: account,
                            authenticator: authenticator,
                        }];
            }
        });
    });
}
exports.verifyRegister = verifyRegister;
/**
 * Generates WebAuthn authentication options.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - Optional user information.
 * @returns The authentication options.
 */
function getAuthenticationOptions(options, request, user) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, adapter, authenticators, _a, relayingParty;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = options.provider, adapter = options.adapter;
                    if (!(user && user["id"])) return [3 /*break*/, 2];
                    return [4 /*yield*/, adapter.listAuthenticatorsByUserId(user.id)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _b.label = 3;
                case 3:
                    authenticators = _a;
                    relayingParty = provider.getRelayingParty(options, request);
                    return [4 /*yield*/, provider.simpleWebAuthn.generateAuthenticationOptions(__assign(__assign({}, provider.authenticationOptions), { rpID: relayingParty.id, allowCredentials: authenticators === null || authenticators === void 0 ? void 0 : authenticators.map(function (a) { return ({
                                id: fromBase64(a.credentialID),
                                type: "public-key",
                                transports: stringToTransports(a.transports),
                            }); }) }))];
                case 4: 
                // Return the authentication options.
                return [2 /*return*/, _b.sent()];
            }
        });
    });
}
/**
 * Generates WebAuthn registration options.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - The user information.
 * @returns The registration options.
 */
function getRegistrationOptions(options, request, user) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, adapter, authenticators, _a, userID, relayingParty;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    provider = options.provider, adapter = options.adapter;
                    if (!user["id"]) return [3 /*break*/, 2];
                    return [4 /*yield*/, adapter.listAuthenticatorsByUserId(user.id)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _c.label = 3;
                case 3:
                    authenticators = _a;
                    userID = (0, web_js_1.randomString)(32);
                    relayingParty = provider.getRelayingParty(options, request);
                    return [4 /*yield*/, provider.simpleWebAuthn.generateRegistrationOptions(__assign(__assign({}, provider.registrationOptions), { userID: userID, userName: user.email, userDisplayName: (_b = user.name) !== null && _b !== void 0 ? _b : undefined, rpID: relayingParty.id, rpName: relayingParty.name, excludeCredentials: authenticators === null || authenticators === void 0 ? void 0 : authenticators.map(function (a) { return ({
                                id: fromBase64(a.credentialID),
                                type: "public-key",
                                transports: stringToTransports(a.transports),
                            }); }) }))];
                case 4: 
                // Return the registration options.
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function assertInternalOptionsWebAuthn(options) {
    var provider = options.provider, adapter = options.adapter;
    // Adapter is required for WebAuthn
    if (!adapter)
        throw new errors_js_1.MissingAdapter("An adapter is required for the WebAuthn provider");
    // Provider must be WebAuthn
    if (!provider || provider.type !== "webauthn") {
        throw new errors_js_1.InvalidProvider("Provider must be WebAuthn");
    }
    // Narrow the options type for typed usage later
    return __assign(__assign({}, options), { provider: provider, adapter: adapter });
}
exports.assertInternalOptionsWebAuthn = assertInternalOptionsWebAuthn;
function fromAdapterAuthenticator(authenticator) {
    return __assign(__assign({}, authenticator), { credentialDeviceType: authenticator.credentialDeviceType, transports: stringToTransports(authenticator.transports), credentialID: fromBase64(authenticator.credentialID), credentialPublicKey: fromBase64(authenticator.credentialPublicKey) });
}
function fromBase64(base64) {
    return new Uint8Array(Buffer.from(base64, "base64"));
}
exports.fromBase64 = fromBase64;
function toBase64(bytes) {
    return Buffer.from(bytes).toString("base64");
}
exports.toBase64 = toBase64;
function transportsToString(transports) {
    return transports === null || transports === void 0 ? void 0 : transports.join(",");
}
exports.transportsToString = transportsToString;
function stringToTransports(tstring) {
    return tstring
        ? tstring.split(",")
        : undefined;
}
exports.stringToTransports = stringToTransports;
