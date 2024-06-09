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
exports.sendToken = void 0;
var web_js_1 = require("../../utils/web.js");
var errors_js_1 = require("../../../errors.js");
/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter).
 * At the end, it returns a redirect to the `verify-request` page.
 */
function sendToken(request, options) {
    return __awaiter(this, void 0, void 0, function () {
        var body, provider, callbacks, adapter, normalizer, email, defaultUser, user, account, authorized, e_1, callbackUrl, theme, token, ONE_DAY_IN_SECONDS, expires, secret, baseUrl, sendRequest, createToken, _a, _b, _c, _d;
        var _e, _f;
        var _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    body = request.body;
                    provider = options.provider, callbacks = options.callbacks, adapter = options.adapter;
                    normalizer = (_g = provider.normalizeIdentifier) !== null && _g !== void 0 ? _g : defaultNormalizer;
                    email = normalizer(body === null || body === void 0 ? void 0 : body.email);
                    defaultUser = { id: crypto.randomUUID(), email: email, emailVerified: null };
                    return [4 /*yield*/, adapter.getUserByEmail(email)];
                case 1:
                    user = (_h = (_q.sent())) !== null && _h !== void 0 ? _h : defaultUser;
                    account = {
                        providerAccountId: email,
                        userId: user.id,
                        type: "email",
                        provider: provider.id,
                    };
                    _q.label = 2;
                case 2:
                    _q.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, callbacks.signIn({
                            user: user,
                            account: account,
                            email: { verificationRequest: true },
                        })];
                case 3:
                    authorized = _q.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _q.sent();
                    throw new errors_js_1.AccessDenied(e_1);
                case 5:
                    if (!authorized)
                        throw new errors_js_1.AccessDenied("AccessDenied");
                    if (!(typeof authorized === "string")) return [3 /*break*/, 7];
                    _e = {};
                    return [4 /*yield*/, callbacks.redirect({
                            url: authorized,
                            baseUrl: options.url.origin,
                        })];
                case 6: return [2 /*return*/, (_e.redirect = _q.sent(),
                        _e)];
                case 7:
                    callbackUrl = options.callbackUrl, theme = options.theme;
                    return [4 /*yield*/, ((_j = provider.generateVerificationToken) === null || _j === void 0 ? void 0 : _j.call(provider))];
                case 8:
                    token = (_k = (_q.sent())) !== null && _k !== void 0 ? _k : (0, web_js_1.randomString)(32);
                    ONE_DAY_IN_SECONDS = 86400;
                    expires = new Date(Date.now() + ((_l = provider.maxAge) !== null && _l !== void 0 ? _l : ONE_DAY_IN_SECONDS) * 1000);
                    secret = (_m = provider.secret) !== null && _m !== void 0 ? _m : options.secret;
                    baseUrl = new URL(options.basePath, options.url.origin);
                    sendRequest = provider.sendVerificationRequest({
                        identifier: email,
                        token: token,
                        expires: expires,
                        url: "".concat(baseUrl, "/callback/").concat(provider.id, "?").concat(new URLSearchParams({
                            callbackUrl: callbackUrl,
                            token: token,
                            email: email,
                        })),
                        provider: provider,
                        theme: theme,
                        request: (0, web_js_1.toRequest)(request),
                    });
                    if (!((_p = (_o = adapter).createVerificationToken) === null || _p === void 0)) return [3 /*break*/, 9];
                    _a = void 0;
                    return [3 /*break*/, 11];
                case 9:
                    _c = (_b = _p).call;
                    _d = [_o];
                    _f = {
                        identifier: email
                    };
                    return [4 /*yield*/, (0, web_js_1.createHash)("".concat(token).concat(secret))];
                case 10:
                    _a = _c.apply(_b, _d.concat([(_f.token = _q.sent(),
                            _f.expires = expires,
                            _f)]));
                    _q.label = 11;
                case 11:
                    createToken = _a;
                    return [4 /*yield*/, Promise.all([sendRequest, createToken])];
                case 12:
                    _q.sent();
                    return [2 /*return*/, {
                            redirect: "".concat(baseUrl, "/verify-request?").concat(new URLSearchParams({
                                provider: provider.id,
                                type: provider.type,
                            })),
                        }];
            }
        });
    });
}
exports.sendToken = sendToken;
function defaultNormalizer(email) {
    if (!email)
        throw new Error("Missing email from request body.");
    // Get the first two elements only,
    // separated by `@` from user input.
    var _a = email.toLowerCase().trim().split("@"), local = _a[0], domain = _a[1];
    // The part before "@" can contain a ","
    // but we remove it on the domain part
    domain = domain.split(",")[0];
    return "".concat(local, "@").concat(domain);
}
