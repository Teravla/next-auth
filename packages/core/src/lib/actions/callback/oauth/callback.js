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
exports.getUserAndAccount = exports.handleOAuth = void 0;
var checks = require("./checks.js");
var o = require("oauth4webapi");
var errors_js_1 = require("../../../../errors.js");
/**
 * Handles the following OAuth steps.
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3
 * https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
 *
 * @note Although requesting userinfo is not required by the OAuth2.0 spec,
 * we fetch it anyway. This is because we always want a user profile.
 */
function handleOAuth(query, cookies, options, randomState) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, provider, as, token, userinfo, issuer, discoveryResponse, discoveredAs, client, resCookies, state, codeGrantParams, cause, codeVerifier, redirect_uri, codeGrantResponse, challenges, _i, challenges_1, challenge, profile, tokens, nonce, result, _profile, userinfoResponse, profileResult;
        var _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    logger = options.logger, provider = options.provider;
                    token = provider.token, userinfo = provider.userinfo;
                    if (!((!(token === null || token === void 0 ? void 0 : token.url) || token.url.host === "authjs.dev") &&
                        (!(userinfo === null || userinfo === void 0 ? void 0 : userinfo.url) || userinfo.url.host === "authjs.dev"))) return [3 /*break*/, 3];
                    issuer = new URL(provider.issuer);
                    return [4 /*yield*/, o.discoveryRequest(issuer)];
                case 1:
                    discoveryResponse = _e.sent();
                    return [4 /*yield*/, o.processDiscoveryResponse(issuer, discoveryResponse)];
                case 2:
                    discoveredAs = _e.sent();
                    if (!discoveredAs.token_endpoint)
                        throw new TypeError("TODO: Authorization server did not provide a token endpoint.");
                    if (!discoveredAs.userinfo_endpoint)
                        throw new TypeError("TODO: Authorization server did not provide a userinfo endpoint.");
                    as = discoveredAs;
                    return [3 /*break*/, 4];
                case 3:
                    as = {
                        issuer: (_b = provider.issuer) !== null && _b !== void 0 ? _b : "https://authjs.dev", // TODO: review fallback issuer
                        token_endpoint: token === null || token === void 0 ? void 0 : token.url.toString(),
                        userinfo_endpoint: userinfo === null || userinfo === void 0 ? void 0 : userinfo.url.toString(),
                    };
                    _e.label = 4;
                case 4:
                    client = __assign({ client_id: provider.clientId, client_secret: provider.clientSecret }, provider.client);
                    resCookies = [];
                    return [4 /*yield*/, checks.state.use(cookies, resCookies, options, randomState)];
                case 5:
                    state = _e.sent();
                    codeGrantParams = o.validateAuthResponse(as, client, new URLSearchParams(query), provider.checks.includes("state") ? state : o.skipStateCheck);
                    /** https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1 */
                    if (o.isOAuth2Error(codeGrantParams)) {
                        cause = __assign({ providerId: provider.id }, codeGrantParams);
                        logger.debug("OAuthCallbackError", cause);
                        throw new errors_js_1.OAuthCallbackError("OAuth Provider returned an error", cause);
                    }
                    return [4 /*yield*/, checks.pkce.use(cookies, resCookies, options)];
                case 6:
                    codeVerifier = _e.sent();
                    redirect_uri = provider.callbackUrl;
                    if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
                        redirect_uri = provider.redirectProxyUrl;
                    }
                    return [4 /*yield*/, o.authorizationCodeGrantRequest(as, client, codeGrantParams, redirect_uri, codeVerifier !== null && codeVerifier !== void 0 ? codeVerifier : "auth", (_a = {},
                            _a[o.customFetch] = function () {
                                var _a;
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                if (!provider.checks.includes("pkce") &&
                                    ((_a = args[1]) === null || _a === void 0 ? void 0 : _a.body) instanceof URLSearchParams) {
                                    args[1].body.delete("code_verifier");
                                }
                                return fetch.apply(void 0, args);
                            },
                            _a))];
                case 7:
                    codeGrantResponse = _e.sent();
                    if (!((_c = provider.token) === null || _c === void 0 ? void 0 : _c.conform)) return [3 /*break*/, 9];
                    return [4 /*yield*/, provider.token.conform(codeGrantResponse.clone())];
                case 8:
                    codeGrantResponse =
                        (_d = (_e.sent())) !== null && _d !== void 0 ? _d : codeGrantResponse;
                    _e.label = 9;
                case 9:
                    if ((challenges = o.parseWwwAuthenticateChallenges(codeGrantResponse))) {
                        for (_i = 0, challenges_1 = challenges; _i < challenges_1.length; _i++) {
                            challenge = challenges_1[_i];
                            console.log("challenge", challenge);
                        }
                        throw new Error("TODO: Handle www-authenticate challenges as needed");
                    }
                    profile = {};
                    if (!(provider.type === "oidc")) return [3 /*break*/, 12];
                    return [4 /*yield*/, checks.nonce.use(cookies, resCookies, options)];
                case 10:
                    nonce = _e.sent();
                    return [4 /*yield*/, o.processAuthorizationCodeOpenIDResponse(as, client, codeGrantResponse, nonce !== null && nonce !== void 0 ? nonce : o.expectNoNonce)];
                case 11:
                    result = _e.sent();
                    if (o.isOAuth2Error(result)) {
                        console.log("error", result);
                        throw new Error("TODO: Handle OIDC response body error");
                    }
                    profile = o.getValidatedIdTokenClaims(result);
                    tokens = result;
                    return [3 /*break*/, 19];
                case 12: return [4 /*yield*/, o.processAuthorizationCodeOAuth2Response(as, client, codeGrantResponse)];
                case 13:
                    tokens = _e.sent();
                    if (o.isOAuth2Error(tokens)) {
                        console.log("error", tokens);
                        throw new Error("TODO: Handle OAuth 2.0 response body error");
                    }
                    if (!(userinfo === null || userinfo === void 0 ? void 0 : userinfo.request)) return [3 /*break*/, 15];
                    return [4 /*yield*/, userinfo.request({ tokens: tokens, provider: provider })];
                case 14:
                    _profile = _e.sent();
                    if (_profile instanceof Object)
                        profile = _profile;
                    return [3 /*break*/, 19];
                case 15:
                    if (!(userinfo === null || userinfo === void 0 ? void 0 : userinfo.url)) return [3 /*break*/, 18];
                    return [4 /*yield*/, o.userInfoRequest(as, client, tokens.access_token)];
                case 16:
                    userinfoResponse = _e.sent();
                    return [4 /*yield*/, userinfoResponse.json()];
                case 17:
                    profile = _e.sent();
                    return [3 /*break*/, 19];
                case 18: throw new TypeError("No userinfo endpoint configured");
                case 19:
                    if (tokens.expires_in) {
                        tokens.expires_at =
                            Math.floor(Date.now() / 1000) + Number(tokens.expires_in);
                    }
                    return [4 /*yield*/, getUserAndAccount(profile, provider, tokens, logger)];
                case 20:
                    profileResult = _e.sent();
                    return [2 /*return*/, __assign(__assign({}, profileResult), { profile: profile, cookies: resCookies })];
            }
        });
    });
}
exports.handleOAuth = handleOAuth;
/**
 * Returns the user and account that is going to be created in the database.
 * @internal
 */
function getUserAndAccount(OAuthProfile, provider, tokens, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var userFromProfile, user, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, provider.profile(OAuthProfile, tokens)];
                case 1:
                    userFromProfile = _c.sent();
                    user = __assign(__assign({}, userFromProfile), { id: crypto.randomUUID(), email: (_a = userFromProfile.email) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
                    return [2 /*return*/, {
                            user: user,
                            account: __assign(__assign({}, tokens), { provider: provider.id, type: provider.type, providerAccountId: (_b = userFromProfile.id) !== null && _b !== void 0 ? _b : crypto.randomUUID() }),
                        }];
                case 2:
                    e_1 = _c.sent();
                    // If we didn't get a response either there was a problem with the provider
                    // response *or* the user cancelled the action with the provider.
                    //
                    // Unfortunately, we can't tell which - at least not in a way that works for
                    // all providers, so we return an empty object; the user should then be
                    // redirected back to the sign up page. We log the error to help developers
                    // who might be trying to debug this when configuring a new provider.
                    logger.debug("getProfile error details", OAuthProfile);
                    logger.error(new errors_js_1.OAuthProfileParseError(e_1, { provider: provider.id }));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUserAndAccount = getUserAndAccount;
