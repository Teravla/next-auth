"use strict";
// TODO: Make this file smaller
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
exports.callback = void 0;
var errors_js_1 = require("../../../errors.js");
var handle_login_js_1 = require("./handle-login.js");
var callback_js_1 = require("./oauth/callback.js");
var checks_js_1 = require("./oauth/checks.js");
var web_js_1 = require("../../utils/web.js");
var webauthn_utils_js_1 = require("../../utils/webauthn-utils.js");
/** Handle callbacks from login services */
function callback(request, options, sessionStore, cookies) {
    return __awaiter(this, void 0, void 0, function () {
        var query, body, method, headers, provider, adapter, url, callbackUrl, pages, jwt, events, callbacks, _a, sessionStrategy, sessionMaxAge, logger, useJwtSession, _b, proxyRedirect, randomState, authorizationResult, userFromProvider, account, OAuthProfile, userByAccount, getUserByAccount, redirect, _c, user, session, isNewUser, defaultToken, token, salt, newToken, cookieExpires, sessionCookies, token, identifier, e, secret, invite, _d, _e, hasInvite, expired, invalidInvite, user, account, redirect, _f, loggedInUser, session, isNewUser, defaultToken, token_1, salt, newToken, cookieExpires, sessionCookies, credentials, userFromAuthorize, user, account, redirect, defaultToken, token, salt, newToken, cookieExpires, sessionCookies, action, localOptions, user, account, authenticator, _g, verified, verified, _h, loggedInUser, isNewUser, session, currentAccount, defaultToken, token, salt, newToken, cookieExpires, sessionCookies, e_1, error;
        var _j;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    if (!options.provider)
                        throw new errors_js_1.InvalidProvider("Callback route called without provider");
                    query = request.query, body = request.body, method = request.method, headers = request.headers;
                    provider = options.provider, adapter = options.adapter, url = options.url, callbackUrl = options.callbackUrl, pages = options.pages, jwt = options.jwt, events = options.events, callbacks = options.callbacks, _a = options.session, sessionStrategy = _a.strategy, sessionMaxAge = _a.maxAge, logger = options.logger;
                    useJwtSession = sessionStrategy === "jwt";
                    _x.label = 1;
                case 1:
                    _x.trys.push([1, 53, , 54]);
                    if (!(provider.type === "oauth" || provider.type === "oidc")) return [3 /*break*/, 14];
                    _b = (0, checks_js_1.handleState)(query, provider, options.isOnRedirectProxy), proxyRedirect = _b.proxyRedirect, randomState = _b.randomState;
                    if (proxyRedirect) {
                        logger.debug("proxy redirect", { proxyRedirect: proxyRedirect, randomState: randomState });
                        return [2 /*return*/, { redirect: proxyRedirect }];
                    }
                    return [4 /*yield*/, (0, callback_js_1.handleOAuth)(query, request.cookies, options, randomState)];
                case 2:
                    authorizationResult = _x.sent();
                    if (authorizationResult.cookies.length) {
                        cookies.push.apply(cookies, authorizationResult.cookies);
                    }
                    logger.debug("authorization result", authorizationResult);
                    userFromProvider = authorizationResult.user, account = authorizationResult.account, OAuthProfile = authorizationResult.profile;
                    // If we don't have a profile object then either something went wrong
                    // or the user cancelled signing in. We don't know which, so we just
                    // direct the user to the signin page for now. We could do something
                    // else in future.
                    // TODO: Handle user cancelling signin
                    if (!userFromProvider || !account || !OAuthProfile) {
                        return [2 /*return*/, { redirect: "".concat(url, "/signin"), cookies: cookies }];
                    }
                    userByAccount = void 0;
                    if (!adapter) return [3 /*break*/, 4];
                    getUserByAccount = adapter.getUserByAccount;
                    return [4 /*yield*/, getUserByAccount({
                            providerAccountId: account.providerAccountId,
                            provider: provider.id,
                        })];
                case 3:
                    userByAccount = _x.sent();
                    _x.label = 4;
                case 4: return [4 /*yield*/, handleAuthorized({
                        user: userByAccount !== null && userByAccount !== void 0 ? userByAccount : userFromProvider,
                        account: account,
                        profile: OAuthProfile,
                    }, options)];
                case 5:
                    redirect = _x.sent();
                    if (redirect)
                        return [2 /*return*/, { redirect: redirect, cookies: cookies }];
                    return [4 /*yield*/, (0, handle_login_js_1.handleLoginOrRegister)(sessionStore.value, userFromProvider, account, options)];
                case 6:
                    _c = _x.sent(), user = _c.user, session = _c.session, isNewUser = _c.isNewUser;
                    if (!useJwtSession) return [3 /*break*/, 11];
                    defaultToken = {
                        name: user.name,
                        email: user.email,
                        picture: user.image,
                        sub: (_k = user.id) === null || _k === void 0 ? void 0 : _k.toString(),
                    };
                    return [4 /*yield*/, callbacks.jwt({
                            token: defaultToken,
                            user: user,
                            account: account,
                            profile: OAuthProfile,
                            isNewUser: isNewUser,
                            trigger: isNewUser ? "signUp" : "signIn",
                        })
                        // Clear cookies if token is null
                    ];
                case 7:
                    token = _x.sent();
                    if (!(token === null)) return [3 /*break*/, 8];
                    cookies.push.apply(cookies, sessionStore.clean());
                    return [3 /*break*/, 10];
                case 8:
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.encode(__assign(__assign({}, jwt), { token: token, salt: salt }))
                        // Set cookie expiry date
                    ];
                case 9:
                    newToken = _x.sent();
                    cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires,
                    });
                    cookies.push.apply(cookies, sessionCookies);
                    _x.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    // Save Session Token in cookie
                    cookies.push({
                        name: options.cookies.sessionToken.name,
                        value: session.sessionToken,
                        options: __assign(__assign({}, options.cookies.sessionToken.options), { expires: session.expires }),
                    });
                    _x.label = 12;
                case 12: return [4 /*yield*/, ((_l = events.signIn) === null || _l === void 0 ? void 0 : _l.call(events, {
                        user: user,
                        account: account,
                        profile: OAuthProfile,
                        isNewUser: isNewUser,
                    }))
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                ];
                case 13:
                    _x.sent();
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                    if (isNewUser && pages.newUser) {
                        return [2 /*return*/, {
                                redirect: "".concat(pages.newUser).concat(pages.newUser.includes("?") ? "&" : "?").concat(new URLSearchParams({ callbackUrl: callbackUrl })),
                                cookies: cookies,
                            }];
                    }
                    return [2 /*return*/, { redirect: callbackUrl, cookies: cookies }];
                case 14:
                    if (!(provider.type === "email")) return [3 /*break*/, 27];
                    token = query === null || query === void 0 ? void 0 : query.token;
                    identifier = query === null || query === void 0 ? void 0 : query.email;
                    if (!token || !identifier) {
                        e = new TypeError("Missing token or email. The sign-in URL was manually opened without token/identifier or the link was not sent correctly in the email.", { cause: { hasToken: !!token, hasEmail: !!identifier } });
                        e.name = "Configuration";
                        throw e;
                    }
                    secret = (_m = provider.secret) !== null && _m !== void 0 ? _m : options.secret;
                    _e = (_d = adapter).useVerificationToken;
                    _j = {
                        identifier: identifier
                    };
                    return [4 /*yield*/, (0, web_js_1.createHash)("".concat(token).concat(secret))];
                case 15: return [4 /*yield*/, _e.apply(_d, [(_j.token = _x.sent(),
                            _j)])];
                case 16:
                    invite = _x.sent();
                    hasInvite = !!invite;
                    expired = invite ? invite.expires.valueOf() < Date.now() : undefined;
                    invalidInvite = !hasInvite || expired;
                    if (invalidInvite)
                        throw new errors_js_1.Verification({ hasInvite: hasInvite, expired: expired });
                    return [4 /*yield*/, adapter.getUserByEmail(identifier)];
                case 17:
                    user = (_o = (_x.sent())) !== null && _o !== void 0 ? _o : {
                        id: crypto.randomUUID(),
                        email: identifier,
                        emailVerified: null,
                    };
                    account = {
                        providerAccountId: user.email,
                        userId: user.id,
                        type: "email",
                        provider: provider.id,
                    };
                    return [4 /*yield*/, handleAuthorized({ user: user, account: account }, options)];
                case 18:
                    redirect = _x.sent();
                    if (redirect)
                        return [2 /*return*/, { redirect: redirect, cookies: cookies }
                            // Sign user in
                        ];
                    return [4 /*yield*/, (0, handle_login_js_1.handleLoginOrRegister)(sessionStore.value, user, account, options)];
                case 19:
                    _f = _x.sent(), loggedInUser = _f.user, session = _f.session, isNewUser = _f.isNewUser;
                    if (!useJwtSession) return [3 /*break*/, 24];
                    defaultToken = {
                        name: loggedInUser.name,
                        email: loggedInUser.email,
                        picture: loggedInUser.image,
                        sub: (_p = loggedInUser.id) === null || _p === void 0 ? void 0 : _p.toString(),
                    };
                    return [4 /*yield*/, callbacks.jwt({
                            token: defaultToken,
                            user: loggedInUser,
                            account: account,
                            isNewUser: isNewUser,
                            trigger: isNewUser ? "signUp" : "signIn",
                        })
                        // Clear cookies if token is null
                    ];
                case 20:
                    token_1 = _x.sent();
                    if (!(token_1 === null)) return [3 /*break*/, 21];
                    cookies.push.apply(cookies, sessionStore.clean());
                    return [3 /*break*/, 23];
                case 21:
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.encode(__assign(__assign({}, jwt), { token: token_1, salt: salt }))
                        // Set cookie expiry date
                    ];
                case 22:
                    newToken = _x.sent();
                    cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires,
                    });
                    cookies.push.apply(cookies, sessionCookies);
                    _x.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    // Save Session Token in cookie
                    cookies.push({
                        name: options.cookies.sessionToken.name,
                        value: session.sessionToken,
                        options: __assign(__assign({}, options.cookies.sessionToken.options), { expires: session.expires }),
                    });
                    _x.label = 25;
                case 25: return [4 /*yield*/, ((_q = events.signIn) === null || _q === void 0 ? void 0 : _q.call(events, { user: loggedInUser, account: account, isNewUser: isNewUser }))
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                ];
                case 26:
                    _x.sent();
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                    if (isNewUser && pages.newUser) {
                        return [2 /*return*/, {
                                redirect: "".concat(pages.newUser).concat(pages.newUser.includes("?") ? "&" : "?").concat(new URLSearchParams({ callbackUrl: callbackUrl })),
                                cookies: cookies,
                            }];
                    }
                    // Callback URL is already verified at this point, so safe to use if specified
                    return [2 /*return*/, { redirect: callbackUrl, cookies: cookies }];
                case 27:
                    if (!(provider.type === "credentials" && method === "POST")) return [3 /*break*/, 35];
                    credentials = body !== null && body !== void 0 ? body : {};
                    // TODO: Forward the original request as is, instead of reconstructing it
                    Object.entries(query !== null && query !== void 0 ? query : {}).forEach(function (_a) {
                        var k = _a[0], v = _a[1];
                        return url.searchParams.set(k, v);
                    });
                    return [4 /*yield*/, provider.authorize(credentials, 
                        // prettier-ignore
                        new Request(url, { headers: headers, method: method, body: JSON.stringify(body) }))];
                case 28:
                    userFromAuthorize = _x.sent();
                    user = userFromAuthorize;
                    if (!user) {
                        console.error("Read more at https://errors.authjs.dev/#credentialssignin");
                        throw new errors_js_1.CredentialsSignin();
                    }
                    else
                        user.id = (_s = (_r = user.id) === null || _r === void 0 ? void 0 : _r.toString()) !== null && _s !== void 0 ? _s : crypto.randomUUID();
                    account = {
                        providerAccountId: user.id,
                        type: "credentials",
                        provider: provider.id,
                    };
                    return [4 /*yield*/, handleAuthorized({ user: user, account: account, credentials: credentials }, options)];
                case 29:
                    redirect = _x.sent();
                    if (redirect)
                        return [2 /*return*/, { redirect: redirect, cookies: cookies }];
                    defaultToken = {
                        name: user.name,
                        email: user.email,
                        picture: user.image,
                        sub: user.id,
                    };
                    return [4 /*yield*/, callbacks.jwt({
                            token: defaultToken,
                            user: user,
                            account: account,
                            isNewUser: false,
                            trigger: "signIn",
                        })
                        // Clear cookies if token is null
                    ];
                case 30:
                    token = _x.sent();
                    if (!(token === null)) return [3 /*break*/, 31];
                    cookies.push.apply(cookies, sessionStore.clean());
                    return [3 /*break*/, 33];
                case 31:
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.encode(__assign(__assign({}, jwt), { token: token, salt: salt }))
                        // Set cookie expiry date
                    ];
                case 32:
                    newToken = _x.sent();
                    cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires,
                    });
                    cookies.push.apply(cookies, sessionCookies);
                    _x.label = 33;
                case 33: return [4 /*yield*/, ((_t = events.signIn) === null || _t === void 0 ? void 0 : _t.call(events, { user: user, account: account }))];
                case 34:
                    _x.sent();
                    return [2 /*return*/, { redirect: callbackUrl, cookies: cookies }];
                case 35:
                    if (!(provider.type === "webauthn" && method === "POST")) return [3 /*break*/, 52];
                    action = (_u = request.body) === null || _u === void 0 ? void 0 : _u.action;
                    if (typeof action !== "string" ||
                        (action !== "authenticate" && action !== "register")) {
                        throw new errors_js_1.AuthError("Invalid action parameter");
                    }
                    localOptions = (0, webauthn_utils_js_1.assertInternalOptionsWebAuthn)(options);
                    user = void 0;
                    account = void 0;
                    authenticator = void 0;
                    _g = action;
                    switch (_g) {
                        case "authenticate": return [3 /*break*/, 36];
                        case "register": return [3 /*break*/, 38];
                    }
                    return [3 /*break*/, 40];
                case 36: return [4 /*yield*/, (0, webauthn_utils_js_1.verifyAuthenticate)(localOptions, request, cookies)];
                case 37:
                    verified = _x.sent();
                    user = verified.user;
                    account = verified.account;
                    return [3 /*break*/, 40];
                case 38: return [4 /*yield*/, (0, webauthn_utils_js_1.verifyRegister)(options, request, cookies)];
                case 39:
                    verified = _x.sent();
                    user = verified.user;
                    account = verified.account;
                    authenticator = verified.authenticator;
                    return [3 /*break*/, 40];
                case 40: 
                // Check if user is allowed to sign in
                return [4 /*yield*/, handleAuthorized({ user: user, account: account }, options)
                    // Sign user in, creating them and their account if needed
                ];
                case 41:
                    // Check if user is allowed to sign in
                    _x.sent();
                    return [4 /*yield*/, (0, handle_login_js_1.handleLoginOrRegister)(sessionStore.value, user, account, options)];
                case 42:
                    _h = _x.sent(), loggedInUser = _h.user, isNewUser = _h.isNewUser, session = _h.session, currentAccount = _h.account;
                    if (!currentAccount) {
                        // This is mostly for type checking. It should never actually happen.
                        throw new errors_js_1.AuthError("Error creating or finding account");
                    }
                    if (!(authenticator && loggedInUser.id)) return [3 /*break*/, 44];
                    return [4 /*yield*/, localOptions.adapter.createAuthenticator(__assign(__assign({}, authenticator), { userId: loggedInUser.id }))];
                case 43:
                    _x.sent();
                    _x.label = 44;
                case 44:
                    if (!useJwtSession) return [3 /*break*/, 49];
                    defaultToken = {
                        name: loggedInUser.name,
                        email: loggedInUser.email,
                        picture: loggedInUser.image,
                        sub: (_v = loggedInUser.id) === null || _v === void 0 ? void 0 : _v.toString(),
                    };
                    return [4 /*yield*/, callbacks.jwt({
                            token: defaultToken,
                            user: loggedInUser,
                            account: currentAccount,
                            isNewUser: isNewUser,
                            trigger: isNewUser ? "signUp" : "signIn",
                        })
                        // Clear cookies if token is null
                    ];
                case 45:
                    token = _x.sent();
                    if (!(token === null)) return [3 /*break*/, 46];
                    cookies.push.apply(cookies, sessionStore.clean());
                    return [3 /*break*/, 48];
                case 46:
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.encode(__assign(__assign({}, jwt), { token: token, salt: salt }))
                        // Set cookie expiry date
                    ];
                case 47:
                    newToken = _x.sent();
                    cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires,
                    });
                    cookies.push.apply(cookies, sessionCookies);
                    _x.label = 48;
                case 48: return [3 /*break*/, 50];
                case 49:
                    // Save Session Token in cookie
                    cookies.push({
                        name: options.cookies.sessionToken.name,
                        value: session.sessionToken,
                        options: __assign(__assign({}, options.cookies.sessionToken.options), { expires: session.expires }),
                    });
                    _x.label = 50;
                case 50: return [4 /*yield*/, ((_w = events.signIn) === null || _w === void 0 ? void 0 : _w.call(events, {
                        user: loggedInUser,
                        account: currentAccount,
                        isNewUser: isNewUser,
                    }))
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                ];
                case 51:
                    _x.sent();
                    // Handle first logins on new accounts
                    // e.g. option to send users to a new account landing page on initial login
                    // Note that the callback URL is preserved, so the journey can still be resumed
                    if (isNewUser && pages.newUser) {
                        return [2 /*return*/, {
                                redirect: "".concat(pages.newUser).concat(pages.newUser.includes("?") ? "&" : "?").concat(new URLSearchParams({ callbackUrl: callbackUrl })),
                                cookies: cookies,
                            }];
                    }
                    // Callback URL is already verified at this point, so safe to use if specified
                    return [2 /*return*/, { redirect: callbackUrl, cookies: cookies }];
                case 52: throw new errors_js_1.InvalidProvider("Callback for provider type (".concat(provider.type, ") is not supported"));
                case 53:
                    e_1 = _x.sent();
                    if (e_1 instanceof errors_js_1.AuthError)
                        throw e_1;
                    error = new errors_js_1.CallbackRouteError(e_1, { provider: provider.id });
                    logger.debug("callback route error details", { method: method, query: query, body: body });
                    throw error;
                case 54: return [2 /*return*/];
            }
        });
    });
}
exports.callback = callback;
function handleAuthorized(params, config) {
    return __awaiter(this, void 0, void 0, function () {
        var authorized, _a, signIn, redirect, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = config.callbacks, signIn = _a.signIn, redirect = _a.redirect;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, signIn(params)];
                case 2:
                    authorized = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _b.sent();
                    if (e_2 instanceof errors_js_1.AuthError)
                        throw e_2;
                    throw new errors_js_1.AccessDenied(e_2);
                case 4:
                    if (!authorized)
                        throw new errors_js_1.AccessDenied("AccessDenied");
                    if (typeof authorized !== "string")
                        return [2 /*return*/];
                    return [4 /*yield*/, redirect({ url: authorized, baseUrl: config.url.origin })];
                case 5: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
