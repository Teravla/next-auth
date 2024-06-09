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
exports.raw = exports.skipCSRFCheck = exports.AuthInternal = void 0;
var errors_js_1 = require("../errors.js");
var cookie_js_1 = require("./utils/cookie.js");
var init_js_1 = require("./init.js");
var index_js_1 = require("./pages/index.js");
var actions = require("./actions/index.js");
var csrf_token_js_1 = require("./actions/callback/oauth/csrf-token.js");
/** @internal */
function AuthInternal(request, authOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var action, providerId, error, method, csrfDisabled, _a, options, cookies, sessionStore, render, _b, csrfTokenVerified, _c;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    action = request.action, providerId = request.providerId, error = request.error, method = request.method;
                    csrfDisabled = authOptions.skipCSRFCheck === exports.skipCSRFCheck;
                    return [4 /*yield*/, (0, init_js_1.init)({
                            authOptions: authOptions,
                            action: action,
                            providerId: providerId,
                            url: request.url,
                            callbackUrl: (_e = (_d = request.body) === null || _d === void 0 ? void 0 : _d.callbackUrl) !== null && _e !== void 0 ? _e : (_f = request.query) === null || _f === void 0 ? void 0 : _f.callbackUrl,
                            csrfToken: (_g = request.body) === null || _g === void 0 ? void 0 : _g.csrfToken,
                            cookies: request.cookies,
                            isPost: method === "POST",
                            csrfDisabled: csrfDisabled,
                        })];
                case 1:
                    _a = _j.sent(), options = _a.options, cookies = _a.cookies;
                    sessionStore = new cookie_js_1.SessionStore(options.cookies.sessionToken, request.cookies, options.logger);
                    if (!(method === "GET")) return [3 /*break*/, 15];
                    render = (0, index_js_1.default)(__assign(__assign({}, options), { query: request.query, cookies: cookies }));
                    _b = action;
                    switch (_b) {
                        case "callback": return [3 /*break*/, 2];
                        case "csrf": return [3 /*break*/, 4];
                        case "error": return [3 /*break*/, 5];
                        case "providers": return [3 /*break*/, 6];
                        case "session": return [3 /*break*/, 7];
                        case "signin": return [3 /*break*/, 9];
                        case "signout": return [3 /*break*/, 10];
                        case "verify-request": return [3 /*break*/, 11];
                        case "webauthn-options": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 14];
                case 2: return [4 /*yield*/, actions.callback(request, options, sessionStore, cookies)];
                case 3: return [2 /*return*/, _j.sent()];
                case 4: return [2 /*return*/, render.csrf(csrfDisabled, options, cookies)];
                case 5: return [2 /*return*/, render.error(error)];
                case 6: return [2 /*return*/, render.providers(options.providers)];
                case 7: return [4 /*yield*/, actions.session(options, sessionStore, cookies)];
                case 8: return [2 /*return*/, _j.sent()];
                case 9: return [2 /*return*/, render.signin(providerId, error)];
                case 10: return [2 /*return*/, render.signout()];
                case 11: return [2 /*return*/, render.verifyRequest()];
                case 12: return [4 /*yield*/, actions.webAuthnOptions(request, options, sessionStore, cookies)];
                case 13: return [2 /*return*/, _j.sent()];
                case 14: return [3 /*break*/, 24];
                case 15:
                    csrfTokenVerified = options.csrfTokenVerified;
                    _c = action;
                    switch (_c) {
                        case "callback": return [3 /*break*/, 16];
                        case "session": return [3 /*break*/, 18];
                        case "signin": return [3 /*break*/, 20];
                        case "signout": return [3 /*break*/, 22];
                    }
                    return [3 /*break*/, 24];
                case 16:
                    if (options.provider.type === "credentials")
                        // Verified CSRF Token required for credentials providers only
                        (0, csrf_token_js_1.validateCSRF)(action, csrfTokenVerified);
                    return [4 /*yield*/, actions.callback(request, options, sessionStore, cookies)];
                case 17: return [2 /*return*/, _j.sent()];
                case 18:
                    (0, csrf_token_js_1.validateCSRF)(action, csrfTokenVerified);
                    return [4 /*yield*/, actions.session(options, sessionStore, cookies, true, (_h = request.body) === null || _h === void 0 ? void 0 : _h.data)];
                case 19: return [2 /*return*/, _j.sent()];
                case 20:
                    (0, csrf_token_js_1.validateCSRF)(action, csrfTokenVerified);
                    return [4 /*yield*/, actions.signIn(request, cookies, options)];
                case 21: return [2 /*return*/, _j.sent()];
                case 22:
                    (0, csrf_token_js_1.validateCSRF)(action, csrfTokenVerified);
                    return [4 /*yield*/, actions.signOut(cookies, sessionStore, options)];
                case 23: return [2 /*return*/, _j.sent()];
                case 24: throw new errors_js_1.UnknownAction("Cannot handle action: ".concat(action));
            }
        });
    });
}
exports.AuthInternal = AuthInternal;
/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js comes with built-in CSRF protection, but
 * if you are implementing a framework that is already protected against CSRF attacks, you can skip this check by
 * passing this value to {@link AuthConfig.skipCSRFCheck}.
 */
exports.skipCSRFCheck = Symbol("skip-csrf-check");
/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js returns a web standard {@link Response} by default, but
 * if you are implementing a framework you might want to get access to the raw internal response
 * by passing this value to {@link AuthConfig.raw}.
 */
exports.raw = Symbol("return-type-raw");
