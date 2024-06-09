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
exports.getAuthorizationUrl = void 0;
var checks = require("../callback/oauth/checks.js");
var o = require("oauth4webapi");
/**
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/)
 */
function getAuthorizationUrl(query, options) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, provider, url, as, issuer, discoveryResponse, as_1, authParams, redirect_uri, data, params, k, cookies, state, _a, value, cookie, nonce;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    logger = options.logger, provider = options.provider;
                    url = (_b = provider.authorization) === null || _b === void 0 ? void 0 : _b.url;
                    if (!(!url || url.host === "authjs.dev")) return [3 /*break*/, 3];
                    issuer = new URL(provider.issuer);
                    return [4 /*yield*/, o.discoveryRequest(issuer)];
                case 1:
                    discoveryResponse = _h.sent();
                    return [4 /*yield*/, o.processDiscoveryResponse(issuer, discoveryResponse)];
                case 2:
                    as_1 = _h.sent();
                    if (!as_1.authorization_endpoint) {
                        throw new TypeError("Authorization server did not provide an authorization endpoint.");
                    }
                    url = new URL(as_1.authorization_endpoint);
                    _h.label = 3;
                case 3:
                    authParams = url.searchParams;
                    redirect_uri = provider.callbackUrl;
                    if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
                        redirect_uri = provider.redirectProxyUrl;
                        data = { origin: provider.callbackUrl };
                        logger.debug("using redirect proxy", { redirect_uri: redirect_uri, data: data });
                    }
                    params = Object.assign(__assign({ response_type: "code", 
                        // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
                        client_id: provider.clientId, redirect_uri: redirect_uri }, (_c = provider.authorization) === null || _c === void 0 ? void 0 : _c.params), Object.fromEntries((_e = (_d = provider.authorization) === null || _d === void 0 ? void 0 : _d.url.searchParams) !== null && _e !== void 0 ? _e : []), query);
                    for (k in params)
                        authParams.set(k, params[k]);
                    cookies = [];
                    return [4 /*yield*/, checks.state.create(options, data)];
                case 4:
                    state = _h.sent();
                    if (state) {
                        authParams.set("state", state.value);
                        cookies.push(state.cookie);
                    }
                    if (!((_f = provider.checks) === null || _f === void 0 ? void 0 : _f.includes("pkce"))) return [3 /*break*/, 7];
                    if (!(as && !((_g = as.code_challenge_methods_supported) === null || _g === void 0 ? void 0 : _g.includes("S256")))) return [3 /*break*/, 5];
                    // We assume S256 PKCE support, if the server does not advertise that,
                    // a random `nonce` must be used for CSRF protection.
                    if (provider.type === "oidc")
                        provider.checks = ["nonce"];
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, checks.pkce.create(options)];
                case 6:
                    _a = _h.sent(), value = _a.value, cookie = _a.cookie;
                    authParams.set("code_challenge", value);
                    authParams.set("code_challenge_method", "S256");
                    cookies.push(cookie);
                    _h.label = 7;
                case 7: return [4 /*yield*/, checks.nonce.create(options)];
                case 8:
                    nonce = _h.sent();
                    if (nonce) {
                        authParams.set("nonce", nonce.value);
                        cookies.push(nonce.cookie);
                    }
                    // TODO: This does not work in normalizeOAuth because authorization endpoint can come from discovery
                    // Need to make normalizeOAuth async
                    if (provider.type === "oidc" && !url.searchParams.has("scope")) {
                        url.searchParams.set("scope", "openid profile email");
                    }
                    logger.debug("authorization url is ready", { url: url, cookies: cookies, provider: provider });
                    return [2 /*return*/, { redirect: url.toString(), cookies: cookies }];
            }
        });
    });
}
exports.getAuthorizationUrl = getAuthorizationUrl;
