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
exports.session = void 0;
var errors_js_1 = require("../../errors.js");
var date_js_1 = require("../utils/date.js");
/** Return a session object filtered via `callbacks.session` */
function session(options, sessionStore, cookies, isUpdate, newSession) {
    return __awaiter(this, void 0, void 0, function () {
        var adapter, jwt, events, callbacks, logger, _a, sessionStrategy, sessionMaxAge, response, sessionToken, salt, payload, token, newExpires, session_1, newSession_1, newToken, sessionCookies, e_1, _b, getSessionAndUser, deleteSession, updateSession, userAndSession, user, session_2, sessionUpdateAge, sessionIsDueToBeUpdatedDate, newExpires, sessionPayload, e_2;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    adapter = options.adapter, jwt = options.jwt, events = options.events, callbacks = options.callbacks, logger = options.logger, _a = options.session, sessionStrategy = _a.strategy, sessionMaxAge = _a.maxAge;
                    response = {
                        body: null,
                        headers: { "Content-Type": "application/json" },
                        cookies: cookies,
                    };
                    sessionToken = sessionStore.value;
                    if (!sessionToken)
                        return [2 /*return*/, response];
                    if (!(sessionStrategy === "jwt")) return [3 /*break*/, 11];
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 9, , 10]);
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.decode(__assign(__assign({}, jwt), { token: sessionToken, salt: salt }))];
                case 2:
                    payload = _k.sent();
                    if (!payload)
                        throw new Error("Invalid JWT");
                    return [4 /*yield*/, callbacks.jwt(__assign(__assign({ token: payload }, (isUpdate && { trigger: "update" })), { session: newSession }))];
                case 3:
                    token = _k.sent();
                    newExpires = (0, date_js_1.fromDate)(sessionMaxAge);
                    if (!(token !== null)) return [3 /*break*/, 7];
                    session_1 = {
                        user: { name: token.name, email: token.email, image: token.picture },
                        expires: newExpires.toISOString(),
                    };
                    return [4 /*yield*/, callbacks.session({ session: session_1, token: token })
                        // Return session payload as response
                    ];
                case 4:
                    newSession_1 = _k.sent();
                    // Return session payload as response
                    response.body = newSession_1;
                    return [4 /*yield*/, jwt.encode(__assign(__assign({}, jwt), { token: token, salt: salt }))
                        // Set cookie, to also update expiry date on cookie
                    ];
                case 5:
                    newToken = _k.sent();
                    sessionCookies = sessionStore.chunk(newToken, {
                        expires: newExpires,
                    });
                    (_c = response.cookies) === null || _c === void 0 ? void 0 : _c.push.apply(_c, sessionCookies);
                    return [4 /*yield*/, ((_d = events.session) === null || _d === void 0 ? void 0 : _d.call(events, { session: newSession_1, token: token }))];
                case 6:
                    _k.sent();
                    return [3 /*break*/, 8];
                case 7:
                    (_e = response.cookies) === null || _e === void 0 ? void 0 : _e.push.apply(_e, sessionStore.clean());
                    _k.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _k.sent();
                    logger.error(new errors_js_1.JWTSessionError(e_1));
                    // If the JWT is not verifiable remove the broken session cookie(s).
                    (_f = response.cookies) === null || _f === void 0 ? void 0 : _f.push.apply(_f, sessionStore.clean());
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/, response];
                case 11:
                    _k.trys.push([11, 21, , 22]);
                    _b = adapter, getSessionAndUser = _b.getSessionAndUser, deleteSession = _b.deleteSession, updateSession = _b.updateSession;
                    return [4 /*yield*/, getSessionAndUser(sessionToken)
                        // If session has expired, clean up the database
                    ];
                case 12:
                    userAndSession = _k.sent();
                    if (!(userAndSession &&
                        userAndSession.session.expires.valueOf() < Date.now())) return [3 /*break*/, 14];
                    return [4 /*yield*/, deleteSession(sessionToken)];
                case 13:
                    _k.sent();
                    userAndSession = null;
                    _k.label = 14;
                case 14:
                    if (!userAndSession) return [3 /*break*/, 19];
                    user = userAndSession.user, session_2 = userAndSession.session;
                    sessionUpdateAge = options.session.updateAge;
                    sessionIsDueToBeUpdatedDate = session_2.expires.valueOf() -
                        sessionMaxAge * 1000 +
                        sessionUpdateAge * 1000;
                    newExpires = (0, date_js_1.fromDate)(sessionMaxAge);
                    if (!(sessionIsDueToBeUpdatedDate <= Date.now())) return [3 /*break*/, 16];
                    return [4 /*yield*/, updateSession({
                            sessionToken: sessionToken,
                            expires: newExpires,
                        })];
                case 15:
                    _k.sent();
                    _k.label = 16;
                case 16: return [4 /*yield*/, callbacks.session(__assign({ 
                        // TODO: user already passed below,
                        // remove from session object in https://github.com/nextauthjs/next-auth/pull/9702
                        // @ts-expect-error
                        session: __assign(__assign({}, session_2), { user: user }), user: user, newSession: newSession }, (isUpdate ? { trigger: "update" } : {})))
                    // Return session payload as response
                ];
                case 17:
                    sessionPayload = _k.sent();
                    // Return session payload as response
                    response.body = sessionPayload;
                    // Set cookie again to update expiry
                    (_g = response.cookies) === null || _g === void 0 ? void 0 : _g.push({
                        name: options.cookies.sessionToken.name,
                        value: sessionToken,
                        options: __assign(__assign({}, options.cookies.sessionToken.options), { expires: newExpires }),
                    });
                    // @ts-expect-error
                    return [4 /*yield*/, ((_h = events.session) === null || _h === void 0 ? void 0 : _h.call(events, { session: sessionPayload }))];
                case 18:
                    // @ts-expect-error
                    _k.sent();
                    return [3 /*break*/, 20];
                case 19:
                    if (sessionToken) {
                        // If `sessionToken` was found set but it's not valid for a session then
                        // remove the sessionToken cookie from browser.
                        (_j = response.cookies) === null || _j === void 0 ? void 0 : _j.push.apply(_j, sessionStore.clean());
                    }
                    _k.label = 20;
                case 20: return [3 /*break*/, 22];
                case 21:
                    e_2 = _k.sent();
                    logger.error(new errors_js_1.SessionTokenError(e_2));
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/, response];
            }
        });
    });
}
exports.session = session;
