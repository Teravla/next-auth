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
exports.handleLoginOrRegister = void 0;
var errors_js_1 = require("../../../errors.js");
var date_js_1 = require("../../utils/date.js");
/**
 * This function handles the complex flow of signing users in, and either creating,
 * linking (or not linking) accounts depending on if the user is currently logged
 * in, if they have account already and the authentication mechanism they are using.
 *
 * It prevents insecure behaviour, such as linking OAuth accounts unless a user is
 * signed in and authenticated with an existing valid account.
 *
 * All verification (e.g. OAuth flows or email address verification flows) are
 * done prior to this handler being called to avoid additional complexity in this
 * handler.
 */
function handleLoginOrRegister(sessionToken, _profile, _account, options) {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, jwt, events, _a, sessionStrategy, generateSessionToken, profile, account, createUser, updateUser, getUser, getUserByAccount, getUserByEmail, linkAccount, createSession, getSessionAndUser, deleteSession, session, user, isNewUser, useJwtSession, salt, _b, userAndSession, userByEmail, _c, userByAccount_1, currentAccount_1, _d, currentAccount, currentAccount_2, userByEmail, _e, _f, currentAccount, userByAccount, _g, p, type, provider, providerAccountId, userId, tokenSet, defaults, userByEmail, _h, provider_1, _j;
        var _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    // Input validation
                    if (!(_account === null || _account === void 0 ? void 0 : _account.providerAccountId) || !_account.type)
                        throw new Error("Missing or invalid provider account");
                    if (!["email", "oauth", "oidc", "webauthn"].includes(_account.type))
                        throw new Error("Provider not supported");
                    adapter = options.adapter, jwt = options.jwt, events = options.events, _a = options.session, sessionStrategy = _a.strategy, generateSessionToken = _a.generateSessionToken;
                    // If no adapter is configured then we don't have a database and cannot
                    // persist data; in this mode we just return a dummy session object.
                    if (!adapter) {
                        return [2 /*return*/, { user: _profile, account: _account }];
                    }
                    profile = _profile;
                    account = _account;
                    createUser = adapter.createUser, updateUser = adapter.updateUser, getUser = adapter.getUser, getUserByAccount = adapter.getUserByAccount, getUserByEmail = adapter.getUserByEmail, linkAccount = adapter.linkAccount, createSession = adapter.createSession, getSessionAndUser = adapter.getSessionAndUser, deleteSession = adapter.deleteSession;
                    session = null;
                    user = null;
                    isNewUser = false;
                    useJwtSession = sessionStrategy === "jwt";
                    if (!sessionToken) return [3 /*break*/, 9];
                    if (!useJwtSession) return [3 /*break*/, 7];
                    _u.label = 1;
                case 1:
                    _u.trys.push([1, 5, , 6]);
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.decode(__assign(__assign({}, jwt), { token: sessionToken, salt: salt }))];
                case 2:
                    session = _u.sent();
                    if (!(session && "sub" in session && session.sub)) return [3 /*break*/, 4];
                    return [4 /*yield*/, getUser(session.sub)];
                case 3:
                    user = _u.sent();
                    _u.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    _b = _u.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, getSessionAndUser(sessionToken)];
                case 8:
                    userAndSession = _u.sent();
                    if (userAndSession) {
                        session = userAndSession.session;
                        user = userAndSession.user;
                    }
                    _u.label = 9;
                case 9:
                    if (!(account.type === "email")) return [3 /*break*/, 22];
                    return [4 /*yield*/, getUserByEmail(profile.email)];
                case 10:
                    userByEmail = _u.sent();
                    if (!userByEmail) return [3 /*break*/, 15];
                    if (!((user === null || user === void 0 ? void 0 : user.id) !== userByEmail.id && !useJwtSession && sessionToken)) return [3 /*break*/, 12];
                    // Delete existing session if they are currently signed in as another user.
                    // This will switch user accounts for the session in cases where the user was
                    // already logged in with a different account.
                    return [4 /*yield*/, deleteSession(sessionToken)];
                case 11:
                    // Delete existing session if they are currently signed in as another user.
                    // This will switch user accounts for the session in cases where the user was
                    // already logged in with a different account.
                    _u.sent();
                    _u.label = 12;
                case 12: return [4 /*yield*/, updateUser({
                        id: userByEmail.id,
                        emailVerified: new Date(),
                    })];
                case 13:
                    // Update emailVerified property on the user object
                    user = _u.sent();
                    return [4 /*yield*/, ((_k = events.updateUser) === null || _k === void 0 ? void 0 : _k.call(events, { user: user }))];
                case 14:
                    _u.sent();
                    return [3 /*break*/, 18];
                case 15: return [4 /*yield*/, createUser(__assign(__assign({}, profile), { emailVerified: new Date() }))];
                case 16:
                    // Create user account if there isn't one for the email address already
                    user = _u.sent();
                    return [4 /*yield*/, ((_l = events.createUser) === null || _l === void 0 ? void 0 : _l.call(events, { user: user }))];
                case 17:
                    _u.sent();
                    isNewUser = true;
                    _u.label = 18;
                case 18:
                    if (!useJwtSession) return [3 /*break*/, 19];
                    _c = {};
                    return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, createSession({
                        sessionToken: generateSessionToken(),
                        userId: user.id,
                        expires: (0, date_js_1.fromDate)(options.session.maxAge),
                    })];
                case 20:
                    _c = _u.sent();
                    _u.label = 21;
                case 21:
                    // Create new session
                    session = _c;
                    return [2 /*return*/, { session: session, user: user, isNewUser: isNewUser }];
                case 22:
                    if (!(account.type === "webauthn")) return [3 /*break*/, 43];
                    return [4 /*yield*/, getUserByAccount({
                            providerAccountId: account.providerAccountId,
                            provider: account.provider,
                        })];
                case 23:
                    userByAccount_1 = _u.sent();
                    if (!userByAccount_1) return [3 /*break*/, 27];
                    if (user) {
                        // If the user is already signed in with this account, we don't need to do anything
                        if (userByAccount_1.id === user.id) {
                            currentAccount_1 = __assign(__assign({}, account), { userId: user.id });
                            return [2 /*return*/, { session: session, user: user, isNewUser: isNewUser, account: currentAccount_1 }];
                        }
                        // If the user is currently signed in, but the new account they are signing in
                        // with is already associated with another user, then we cannot link them
                        // and need to return an error.
                        throw new errors_js_1.AccountNotLinked("The account is already associated with another user", { provider: account.provider });
                    }
                    if (!useJwtSession) return [3 /*break*/, 24];
                    _d = {};
                    return [3 /*break*/, 26];
                case 24: return [4 /*yield*/, createSession({
                        sessionToken: generateSessionToken(),
                        userId: userByAccount_1.id,
                        expires: (0, date_js_1.fromDate)(options.session.maxAge),
                    })];
                case 25:
                    _d = _u.sent();
                    _u.label = 26;
                case 26:
                    // If there is no active session, but the account being signed in with is already
                    // associated with a valid user then create session to sign the user in.
                    session = _d;
                    currentAccount = __assign(__assign({}, account), { userId: userByAccount_1.id });
                    return [2 /*return*/, {
                            session: session,
                            user: userByAccount_1,
                            isNewUser: isNewUser,
                            account: currentAccount,
                        }];
                case 27:
                    if (!user) return [3 /*break*/, 30];
                    // If the user is already signed in and the account isn't already associated
                    // with another user account then we can go ahead and link the accounts safely.
                    return [4 /*yield*/, linkAccount(__assign(__assign({}, account), { userId: user.id }))];
                case 28:
                    // If the user is already signed in and the account isn't already associated
                    // with another user account then we can go ahead and link the accounts safely.
                    _u.sent();
                    return [4 /*yield*/, ((_m = events.linkAccount) === null || _m === void 0 ? void 0 : _m.call(events, { user: user, account: account, profile: profile }))
                        // As they are already signed in, we don't need to do anything after linking them
                    ];
                case 29:
                    _u.sent();
                    currentAccount_2 = __assign(__assign({}, account), { userId: user.id });
                    return [2 /*return*/, { session: session, user: user, isNewUser: isNewUser, account: currentAccount_2 }];
                case 30:
                    if (!profile.email) return [3 /*break*/, 32];
                    return [4 /*yield*/, getUserByEmail(profile.email)];
                case 31:
                    _e = _u.sent();
                    return [3 /*break*/, 33];
                case 32:
                    _e = null;
                    _u.label = 33;
                case 33:
                    userByEmail = _e;
                    if (!userByEmail) return [3 /*break*/, 34];
                    // We don't trust user-provided email addresses, so we don't want to link accounts
                    // if the email address associated with the new account is already associated with
                    // an existing account.
                    throw new errors_js_1.AccountNotLinked("Another account already exists with the same e-mail address", { provider: account.provider });
                case 34: return [4 /*yield*/, createUser(__assign({}, profile))];
                case 35:
                    // If the current user is not logged in and the profile isn't linked to any user
                    // accounts (by email or provider account id)...
                    //
                    // If no account matching the same [provider].id or .email exists, we can
                    // create a new account for the user, link it to the OAuth account and
                    // create a new session for them so they are signed in with it.
                    user = _u.sent();
                    _u.label = 36;
                case 36: return [4 /*yield*/, ((_o = events.createUser) === null || _o === void 0 ? void 0 : _o.call(events, { user: user }))];
                case 37:
                    _u.sent();
                    return [4 /*yield*/, linkAccount(__assign(__assign({}, account), { userId: user.id }))];
                case 38:
                    _u.sent();
                    return [4 /*yield*/, ((_p = events.linkAccount) === null || _p === void 0 ? void 0 : _p.call(events, { user: user, account: account, profile: profile }))];
                case 39:
                    _u.sent();
                    if (!useJwtSession) return [3 /*break*/, 40];
                    _f = {};
                    return [3 /*break*/, 42];
                case 40: return [4 /*yield*/, createSession({
                        sessionToken: generateSessionToken(),
                        userId: user.id,
                        expires: (0, date_js_1.fromDate)(options.session.maxAge),
                    })];
                case 41:
                    _f = _u.sent();
                    _u.label = 42;
                case 42:
                    session = _f;
                    currentAccount = __assign(__assign({}, account), { userId: user.id });
                    return [2 /*return*/, { session: session, user: user, isNewUser: true, account: currentAccount }];
                case 43: return [4 /*yield*/, getUserByAccount({
                        providerAccountId: account.providerAccountId,
                        provider: account.provider,
                    })];
                case 44:
                    userByAccount = _u.sent();
                    if (!userByAccount) return [3 /*break*/, 48];
                    if (user) {
                        // If the user is already signed in with this account, we don't need to do anything
                        if (userByAccount.id === user.id) {
                            return [2 /*return*/, { session: session, user: user, isNewUser: isNewUser }];
                        }
                        // If the user is currently signed in, but the new account they are signing in
                        // with is already associated with another user, then we cannot link them
                        // and need to return an error.
                        throw new errors_js_1.OAuthAccountNotLinked("The account is already associated with another user", { provider: account.provider });
                    }
                    if (!useJwtSession) return [3 /*break*/, 45];
                    _g = {};
                    return [3 /*break*/, 47];
                case 45: return [4 /*yield*/, createSession({
                        sessionToken: generateSessionToken(),
                        userId: userByAccount.id,
                        expires: (0, date_js_1.fromDate)(options.session.maxAge),
                    })];
                case 46:
                    _g = _u.sent();
                    _u.label = 47;
                case 47:
                    // If there is no active session, but the account being signed in with is already
                    // associated with a valid user then create session to sign the user in.
                    session = _g;
                    return [2 /*return*/, { session: session, user: userByAccount, isNewUser: isNewUser }];
                case 48:
                    p = options.provider;
                    type = account.type, provider = account.provider, providerAccountId = account.providerAccountId, userId = account.userId, tokenSet = __rest(account, ["type", "provider", "providerAccountId", "userId"]);
                    defaults = { providerAccountId: providerAccountId, provider: provider, type: type, userId: userId };
                    account = Object.assign((_q = p.account(tokenSet)) !== null && _q !== void 0 ? _q : {}, defaults);
                    if (!user) return [3 /*break*/, 51];
                    // If the user is already signed in and the OAuth account isn't already associated
                    // with another user account then we can go ahead and link the accounts safely.
                    return [4 /*yield*/, linkAccount(__assign(__assign({}, account), { userId: user.id }))];
                case 49:
                    // If the user is already signed in and the OAuth account isn't already associated
                    // with another user account then we can go ahead and link the accounts safely.
                    _u.sent();
                    return [4 /*yield*/, ((_r = events.linkAccount) === null || _r === void 0 ? void 0 : _r.call(events, { user: user, account: account, profile: profile }))
                        // As they are already signed in, we don't need to do anything after linking them
                    ];
                case 50:
                    _u.sent();
                    // As they are already signed in, we don't need to do anything after linking them
                    return [2 /*return*/, { session: session, user: user, isNewUser: isNewUser }];
                case 51:
                    if (!profile.email) return [3 /*break*/, 53];
                    return [4 /*yield*/, getUserByEmail(profile.email)];
                case 52:
                    _h = _u.sent();
                    return [3 /*break*/, 54];
                case 53:
                    _h = null;
                    _u.label = 54;
                case 54:
                    userByEmail = _h;
                    if (!userByEmail) return [3 /*break*/, 55];
                    provider_1 = options.provider;
                    if (provider_1 === null || provider_1 === void 0 ? void 0 : provider_1.allowDangerousEmailAccountLinking) {
                        // If you trust the oauth provider to correctly verify email addresses, you can opt-in to
                        // account linking even when the user is not signed-in.
                        user = userByEmail;
                    }
                    else {
                        // We end up here when we don't have an account with the same [provider].id *BUT*
                        // we do already have an account with the same email address as the one in the
                        // OAuth profile the user has just tried to sign in with.
                        //
                        // We don't want to have two accounts with the same email address, and we don't
                        // want to link them in case it's not safe to do so, so instead we prompt the user
                        // to sign in via email to verify their identity and then link the accounts.
                        throw new errors_js_1.OAuthAccountNotLinked("Another account already exists with the same e-mail address", { provider: account.provider });
                    }
                    return [3 /*break*/, 57];
                case 55: return [4 /*yield*/, createUser(__assign(__assign({}, profile), { emailVerified: null }))];
                case 56:
                    // If the current user is not logged in and the profile isn't linked to any user
                    // accounts (by email or provider account id)...
                    //
                    // If no account matching the same [provider].id or .email exists, we can
                    // create a new account for the user, link it to the OAuth account and
                    // create a new session for them so they are signed in with it.
                    user = _u.sent();
                    _u.label = 57;
                case 57: return [4 /*yield*/, ((_s = events.createUser) === null || _s === void 0 ? void 0 : _s.call(events, { user: user }))];
                case 58:
                    _u.sent();
                    return [4 /*yield*/, linkAccount(__assign(__assign({}, account), { userId: user.id }))];
                case 59:
                    _u.sent();
                    return [4 /*yield*/, ((_t = events.linkAccount) === null || _t === void 0 ? void 0 : _t.call(events, { user: user, account: account, profile: profile }))];
                case 60:
                    _u.sent();
                    if (!useJwtSession) return [3 /*break*/, 61];
                    _j = {};
                    return [3 /*break*/, 63];
                case 61: return [4 /*yield*/, createSession({
                        sessionToken: generateSessionToken(),
                        userId: user.id,
                        expires: (0, date_js_1.fromDate)(options.session.maxAge),
                    })];
                case 62:
                    _j = _u.sent();
                    _u.label = 63;
                case 63:
                    session = _j;
                    return [2 /*return*/, { session: session, user: user, isNewUser: true }];
            }
        });
    });
}
exports.handleLoginOrRegister = handleLoginOrRegister;
