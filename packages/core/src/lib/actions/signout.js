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
exports.signOut = void 0;
var errors_js_1 = require("../../errors.js");
/**
 * Destroys the session.
 * If the session strategy is database,
 * The session is also deleted from the database.
 * In any case, the session cookie is cleared and
 * {@link AuthConfig["events"].signOut} is emitted.
 */
function signOut(cookies, sessionStore, options) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, events, redirect, logger, session, sessionToken, salt, token, session_1, e_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    jwt = options.jwt, events = options.events, redirect = options.callbackUrl, logger = options.logger, session = options.session;
                    sessionToken = sessionStore.value;
                    if (!sessionToken)
                        return [2 /*return*/, { redirect: redirect, cookies: cookies }];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    if (!(session.strategy === "jwt")) return [3 /*break*/, 4];
                    salt = options.cookies.sessionToken.name;
                    return [4 /*yield*/, jwt.decode(__assign(__assign({}, jwt), { token: sessionToken, salt: salt }))];
                case 2:
                    token = _d.sent();
                    return [4 /*yield*/, ((_a = events.signOut) === null || _a === void 0 ? void 0 : _a.call(events, { token: token }))];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, ((_b = options.adapter) === null || _b === void 0 ? void 0 : _b.deleteSession(sessionToken))];
                case 5:
                    session_1 = _d.sent();
                    return [4 /*yield*/, ((_c = events.signOut) === null || _c === void 0 ? void 0 : _c.call(events, { session: session_1 }))];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _d.sent();
                    logger.error(new errors_js_1.SignOutError(e_1));
                    return [3 /*break*/, 9];
                case 9:
                    cookies.push.apply(cookies, sessionStore.clean());
                    return [2 /*return*/, { redirect: redirect, cookies: cookies }];
            }
        });
    });
}
exports.signOut = signOut;
