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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webauthnChallenge = exports.handleState = exports.nonce = exports.state = exports.decodeState = exports.pkce = exports.signCookie = void 0;
var jose = require("jose");
var o = require("oauth4webapi");
var errors_js_1 = require("../../../../errors.js");
var jwt_js_1 = require("../../../../jwt.js");
/** Returns a signed cookie. */
function signCookie(type, value, maxAge, options, data) {
    return __awaiter(this, void 0, void 0, function () {
        var cookies, logger, expires, token, name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cookies = options.cookies, logger = options.logger;
                    logger.debug("CREATE_".concat(type.toUpperCase()), { value: value, maxAge: maxAge });
                    expires = new Date();
                    expires.setTime(expires.getTime() + maxAge * 1000);
                    token = { value: value };
                    if (type === "state" && data)
                        token.data = data;
                    name = cookies[type].name;
                    _a = {
                        name: name
                    };
                    return [4 /*yield*/, (0, jwt_js_1.encode)(__assign(__assign({}, options.jwt), { maxAge: maxAge, token: token, salt: name }))];
                case 1: return [2 /*return*/, (_a.value = _b.sent(),
                        _a.options = __assign(__assign({}, cookies[type].options), { expires: expires }),
                        _a)];
            }
        });
    });
}
exports.signCookie = signCookie;
var PKCE_MAX_AGE = 60 * 15; // 15 minutes in seconds
exports.pkce = {
    create: function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var code_verifier, value, maxAge, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code_verifier = o.generateRandomCodeVerifier();
                        return [4 /*yield*/, o.calculatePKCECodeChallenge(code_verifier)];
                    case 1:
                        value = _a.sent();
                        maxAge = PKCE_MAX_AGE;
                        return [4 /*yield*/, signCookie("pkceCodeVerifier", code_verifier, maxAge, options)];
                    case 2:
                        cookie = _a.sent();
                        return [2 /*return*/, { cookie: cookie, value: value }];
                }
            });
        });
    },
    /**
     * Returns code_verifier if the provider is configured to use PKCE,
     * and clears the container cookie afterwards.
     * An error is thrown if the code_verifier is missing or invalid.
     * @see https://www.rfc-editor.org/rfc/rfc7636
     * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#pkce
     */
    use: function (cookies, resCookies, options) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, codeVerifier, value;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        provider = options.provider;
                        if (!((_a = provider === null || provider === void 0 ? void 0 : provider.checks) === null || _a === void 0 ? void 0 : _a.includes("pkce")))
                            return [2 /*return*/];
                        codeVerifier = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.pkceCodeVerifier.name];
                        if (!codeVerifier)
                            throw new errors_js_1.InvalidCheck("PKCE code_verifier cookie was missing.");
                        return [4 /*yield*/, (0, jwt_js_1.decode)(__assign(__assign({}, options.jwt), { token: codeVerifier, salt: options.cookies.pkceCodeVerifier.name }))];
                    case 1:
                        value = _b.sent();
                        if (!(value === null || value === void 0 ? void 0 : value.value))
                            throw new errors_js_1.InvalidCheck("PKCE code_verifier value could not be parsed.");
                        // Clear the pkce code verifier cookie after use
                        resCookies.push({
                            name: options.cookies.pkceCodeVerifier.name,
                            value: "",
                            options: __assign(__assign({}, options.cookies.pkceCodeVerifier.options), { maxAge: 0 }),
                        });
                        return [2 /*return*/, value.value];
                }
            });
        });
    },
};
var STATE_MAX_AGE = 60 * 15; // 15 minutes in seconds
function decodeState(value) {
    try {
        var decoder = new TextDecoder();
        return JSON.parse(decoder.decode(jose.base64url.decode(value)));
    }
    catch (_a) { }
}
exports.decodeState = decodeState;
exports.state = {
    create: function (options, data) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, encodedState, maxAge, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = options.provider;
                        if (!provider.checks.includes("state")) {
                            if (data) {
                                throw new errors_js_1.InvalidCheck("State data was provided but the provider is not configured to use state.");
                            }
                            return [2 /*return*/];
                        }
                        encodedState = jose.base64url.encode(JSON.stringify(__assign(__assign({}, data), { random: o.generateRandomState() })));
                        maxAge = STATE_MAX_AGE;
                        return [4 /*yield*/, signCookie("state", encodedState, maxAge, options, data)];
                    case 1:
                        cookie = _a.sent();
                        return [2 /*return*/, { cookie: cookie, value: encodedState }];
                }
            });
        });
    },
    /**
     * Returns state if the provider is configured to use state,
     * and clears the container cookie afterwards.
     * An error is thrown if the state is missing or invalid.
     * @see https://www.rfc-editor.org/rfc/rfc6749#section-10.12
     * @see https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
     */
    use: function (cookies, resCookies, options, paramRandom) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, state, encodedState, decodedState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = options.provider;
                        if (!provider.checks.includes("state"))
                            return [2 /*return*/];
                        state = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.state.name];
                        if (!state)
                            throw new errors_js_1.InvalidCheck("State cookie was missing.");
                        return [4 /*yield*/, (0, jwt_js_1.decode)(__assign(__assign({}, options.jwt), { token: state, salt: options.cookies.state.name }))];
                    case 1:
                        encodedState = _a.sent();
                        if (!(encodedState === null || encodedState === void 0 ? void 0 : encodedState.value))
                            throw new errors_js_1.InvalidCheck("State (cookie) value could not be parsed.");
                        decodedState = decodeState(encodedState.value);
                        if (!decodedState)
                            throw new errors_js_1.InvalidCheck("State (encoded) value could not be parsed.");
                        if (decodedState.random !== paramRandom)
                            throw new errors_js_1.InvalidCheck("Random state values did not match. Expected: ".concat(decodedState.random, ". Got: ").concat(paramRandom));
                        // Clear the state cookie after use
                        resCookies.push({
                            name: options.cookies.state.name,
                            value: "",
                            options: __assign(__assign({}, options.cookies.state.options), { maxAge: 0 }),
                        });
                        return [2 /*return*/, encodedState.value];
                }
            });
        });
    },
};
var NONCE_MAX_AGE = 60 * 15; // 15 minutes in seconds
exports.nonce = {
    create: function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var value, maxAge, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options.provider.checks.includes("nonce"))
                            return [2 /*return*/];
                        value = o.generateRandomNonce();
                        maxAge = NONCE_MAX_AGE;
                        return [4 /*yield*/, signCookie("nonce", value, maxAge, options)];
                    case 1:
                        cookie = _a.sent();
                        return [2 /*return*/, { cookie: cookie, value: value }];
                }
            });
        });
    },
    /**
     * Returns nonce if the provider is configured to use nonce,
     * and clears the container cookie afterwards.
     * An error is thrown if the nonce is missing or invalid.
     * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
     * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
     */
    use: function (cookies, resCookies, options) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, nonce, value;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        provider = options.provider;
                        if (!((_a = provider === null || provider === void 0 ? void 0 : provider.checks) === null || _a === void 0 ? void 0 : _a.includes("nonce")))
                            return [2 /*return*/];
                        nonce = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.nonce.name];
                        if (!nonce)
                            throw new errors_js_1.InvalidCheck("Nonce cookie was missing.");
                        return [4 /*yield*/, (0, jwt_js_1.decode)(__assign(__assign({}, options.jwt), { token: nonce, salt: options.cookies.nonce.name }))];
                    case 1:
                        value = _b.sent();
                        if (!(value === null || value === void 0 ? void 0 : value.value))
                            throw new errors_js_1.InvalidCheck("Nonce value could not be parsed.");
                        // Clear the nonce cookie after use
                        resCookies.push({
                            name: options.cookies.nonce.name,
                            value: "",
                            options: __assign(__assign({}, options.cookies.nonce.options), { maxAge: 0 }),
                        });
                        return [2 /*return*/, value.value];
                }
            });
        });
    },
};
/**
 * When the authorization flow contains a state, we check if it's a redirect proxy
 * and if so, we return the random state and the original redirect URL.
 */
function handleState(query, provider, isOnRedirectProxy) {
    var randomState;
    var proxyRedirect;
    if (provider.redirectProxyUrl && !(query === null || query === void 0 ? void 0 : query.state)) {
        throw new errors_js_1.InvalidCheck("Missing state in query, but required for redirect proxy");
    }
    var state = decodeState(query === null || query === void 0 ? void 0 : query.state);
    randomState = state === null || state === void 0 ? void 0 : state.random;
    if (isOnRedirectProxy) {
        if (!(state === null || state === void 0 ? void 0 : state.origin))
            return { randomState: randomState };
        proxyRedirect = "".concat(state.origin, "?").concat(new URLSearchParams(query));
    }
    return { randomState: randomState, proxyRedirect: proxyRedirect };
}
exports.handleState = handleState;
var WEBAUTHN_CHALLENGE_MAX_AGE = 60 * 15; // 15 minutes in seconds
exports.webauthnChallenge = {
    create: function (options, challenge, registerData) {
        return __awaiter(this, void 0, void 0, function () {
            var maxAge, data, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxAge = WEBAUTHN_CHALLENGE_MAX_AGE;
                        data = { challenge: challenge, registerData: registerData };
                        return [4 /*yield*/, signCookie("webauthnChallenge", JSON.stringify(data), maxAge, options)];
                    case 1:
                        cookie = _a.sent();
                        return [2 /*return*/, { cookie: cookie }];
                }
            });
        });
    },
    /**
     * Returns challenge if present,
     */
    use: function (options, cookies, resCookies) {
        return __awaiter(this, void 0, void 0, function () {
            var challenge, value, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        challenge = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.webauthnChallenge.name];
                        if (!challenge)
                            throw new errors_js_1.InvalidCheck("Challenge cookie missing.");
                        return [4 /*yield*/, (0, jwt_js_1.decode)(__assign(__assign({}, options.jwt), { token: challenge, salt: options.cookies.webauthnChallenge.name }))];
                    case 1:
                        value = _a.sent();
                        if (!(value === null || value === void 0 ? void 0 : value.value))
                            throw new errors_js_1.InvalidCheck("Challenge value could not be parsed.");
                        cookie = {
                            name: options.cookies.webauthnChallenge.name,
                            value: "",
                            options: __assign(__assign({}, options.cookies.webauthnChallenge.options), { maxAge: 0 }),
                        };
                        resCookies.push(cookie);
                        return [2 /*return*/, JSON.parse(value.value)];
                }
            });
        });
    },
};
