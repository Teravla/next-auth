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
exports.init = exports.defaultCallbacks = void 0;
var jwt = require("../jwt.js");
var callback_url_js_1 = require("./utils/callback-url.js");
var cookie = require("./utils/cookie.js");
var csrf_token_js_1 = require("./actions/callback/oauth/csrf-token.js");
var errors_js_1 = require("../errors.js");
var providers_js_1 = require("./utils/providers.js");
var logger_js_1 = require("./utils/logger.js");
var merge_js_1 = require("./utils/merge.js");
exports.defaultCallbacks = {
    signIn: function () {
        return true;
    },
    redirect: function (_a) {
        var url = _a.url, baseUrl = _a.baseUrl;
        if (url.startsWith("/"))
            return "".concat(baseUrl).concat(url);
        else if (new URL(url).origin === baseUrl)
            return url;
        return baseUrl;
    },
    session: function (_a) {
        var _b, _c, _d, _e, _f, _g;
        var session = _a.session;
        return {
            user: {
                name: (_b = session.user) === null || _b === void 0 ? void 0 : _b.name,
                email: (_c = session.user) === null || _c === void 0 ? void 0 : _c.email,
                image: (_d = session.user) === null || _d === void 0 ? void 0 : _d.image,
            },
            expires: (_g = (_f = (_e = session.expires) === null || _e === void 0 ? void 0 : _e.toISOString) === null || _f === void 0 ? void 0 : _f.call(_e)) !== null && _g !== void 0 ? _g : session.expires,
        };
    },
    jwt: function (_a) {
        var token = _a.token;
        return token;
    },
};
/** Initialize all internal options and cookies. */
function init(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, providers, provider, maxAge, isOnRedirectProxy, options, cookies, _d, csrfToken, csrfCookie, csrfTokenVerified, _e, callbackUrl, callbackUrlCookie;
        var _f, _g, _h, _j;
        var authOptions = _b.authOptions, providerId = _b.providerId, action = _b.action, url = _b.url, reqCookies = _b.cookies, reqCallbackUrl = _b.callbackUrl, reqCsrfToken = _b.csrfToken, csrfDisabled = _b.csrfDisabled, isPost = _b.isPost;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _c = (0, providers_js_1.default)({
                        providers: authOptions.providers,
                        url: url,
                        providerId: providerId,
                        options: authOptions,
                    }), providers = _c.providers, provider = _c.provider;
                    maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default
                    ;
                    isOnRedirectProxy = false;
                    if (((provider === null || provider === void 0 ? void 0 : provider.type) === "oauth" || (provider === null || provider === void 0 ? void 0 : provider.type) === "oidc") &&
                        provider.redirectProxyUrl) {
                        try {
                            isOnRedirectProxy =
                                new URL(provider.redirectProxyUrl).origin === url.origin;
                        }
                        catch (_l) {
                            throw new TypeError("redirectProxyUrl must be a valid URL. Received: ".concat(provider.redirectProxyUrl));
                        }
                    }
                    options = __assign(__assign({ debug: false, pages: {}, theme: {
                            colorScheme: "auto",
                            logo: "",
                            brandColor: "",
                            buttonText: "",
                        } }, authOptions), { 
                        // These computed settings can have values in userOptions but we override them
                        // and are request-specific.
                        url: url, action: action, 
                        // @ts-expect-errors
                        provider: provider, cookies: (0, merge_js_1.merge)(cookie.defaultCookies((_f = authOptions.useSecureCookies) !== null && _f !== void 0 ? _f : url.protocol === "https:"), authOptions.cookies), providers: providers, 
                        // Session options
                        session: __assign({ 
                            // If no adapter specified, force use of JSON Web Tokens (stateless)
                            strategy: authOptions.adapter ? "database" : "jwt", maxAge: maxAge, updateAge: 24 * 60 * 60, generateSessionToken: function () { return crypto.randomUUID(); } }, authOptions.session), 
                        // JWT options
                        jwt: __assign({ secret: authOptions.secret, maxAge: (_h = (_g = authOptions.session) === null || _g === void 0 ? void 0 : _g.maxAge) !== null && _h !== void 0 ? _h : maxAge, encode: jwt.encode, decode: jwt.decode }, authOptions.jwt), 
                        // Event messages
                        events: eventsErrorHandler((_j = authOptions.events) !== null && _j !== void 0 ? _j : {}, logger_js_1.logger), adapter: adapterErrorHandler(authOptions.adapter, logger_js_1.logger), 
                        // Callback functions
                        callbacks: __assign(__assign({}, exports.defaultCallbacks), authOptions.callbacks), logger: logger_js_1.logger, callbackUrl: url.origin, isOnRedirectProxy: isOnRedirectProxy, experimental: __assign({}, authOptions.experimental) });
                    cookies = [];
                    if (!csrfDisabled) return [3 /*break*/, 1];
                    options.csrfTokenVerified = true;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, csrf_token_js_1.createCSRFToken)({
                        options: options,
                        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.csrfToken.name],
                        isPost: isPost,
                        bodyValue: reqCsrfToken,
                    })];
                case 2:
                    _d = _k.sent(), csrfToken = _d.csrfToken, csrfCookie = _d.cookie, csrfTokenVerified = _d.csrfTokenVerified;
                    options.csrfToken = csrfToken;
                    options.csrfTokenVerified = csrfTokenVerified;
                    if (csrfCookie) {
                        cookies.push({
                            name: options.cookies.csrfToken.name,
                            value: csrfCookie,
                            options: options.cookies.csrfToken.options,
                        });
                    }
                    _k.label = 3;
                case 3: return [4 /*yield*/, (0, callback_url_js_1.createCallbackUrl)({
                        options: options,
                        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.callbackUrl.name],
                        paramValue: reqCallbackUrl,
                    })];
                case 4:
                    _e = _k.sent(), callbackUrl = _e.callbackUrl, callbackUrlCookie = _e.callbackUrlCookie;
                    options.callbackUrl = callbackUrl;
                    if (callbackUrlCookie) {
                        cookies.push({
                            name: options.cookies.callbackUrl.name,
                            value: callbackUrlCookie,
                            options: options.cookies.callbackUrl.options,
                        });
                    }
                    return [2 /*return*/, { options: options, cookies: cookies }];
            }
        });
    });
}
exports.init = init;
/** Wraps an object of methods and adds error handling. */
function eventsErrorHandler(methods, logger) {
    var _this = this;
    return Object.keys(methods).reduce(function (acc, name) {
        acc[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var method, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            method = methods[name];
                            return [4 /*yield*/, method.apply(void 0, args)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            e_1 = _a.sent();
                            logger.error(new errors_js_1.EventError(e_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return acc;
    }, {});
}
/** Handles adapter induced errors. */
function adapterErrorHandler(adapter, logger) {
    var _this = this;
    if (!adapter)
        return;
    return Object.keys(adapter).reduce(function (acc, name) {
        acc[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var method, e_2, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            logger.debug("adapter_".concat(name), { args: args });
                            method = adapter[name];
                            return [4 /*yield*/, method.apply(void 0, args)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            e_2 = _a.sent();
                            error = new errors_js_1.AdapterError(e_2);
                            logger.error(error);
                            throw error;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return acc;
    }, {});
}
