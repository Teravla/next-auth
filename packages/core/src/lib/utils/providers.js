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
var merge_js_1 = require("./merge.js");
/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
function parseProviders(params) {
    var _a;
    var providerId = params.providerId, options = params.options;
    var url = new URL((_a = options.basePath) !== null && _a !== void 0 ? _a : "/auth", params.url.origin);
    var providers = params.providers.map(function (p) {
        var _a, _b;
        var provider = typeof p === "function" ? p() : p;
        var userOptions = provider.options, defaults = __rest(provider, ["options"]);
        var id = ((_a = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _a !== void 0 ? _a : defaults.id);
        // TODO: Support if properties have different types, e.g. authorization: string or object
        var merged = (0, merge_js_1.merge)(defaults, userOptions, {
            signinUrl: "".concat(url, "/signin/").concat(id),
            callbackUrl: "".concat(url, "/callback/").concat(id),
        });
        if (provider.type === "oauth" || provider.type === "oidc") {
            (_b = merged.redirectProxyUrl) !== null && _b !== void 0 ? _b : (merged.redirectProxyUrl = options.redirectProxyUrl);
            return normalizeOAuth(merged);
        }
        return merged;
    });
    return {
        providers: providers,
        provider: providers.find(function (_a) {
            var id = _a.id;
            return id === providerId;
        }),
    };
}
exports.default = parseProviders;
// TODO: Also add discovery here, if some endpoints/config are missing.
// We should return both a client and authorization server config.
function normalizeOAuth(c) {
    var _a, _b, _c, _d, _e;
    if (c.issuer)
        (_a = c.wellKnown) !== null && _a !== void 0 ? _a : (c.wellKnown = "".concat(c.issuer, "/.well-known/openid-configuration"));
    var authorization = normalizeEndpoint(c.authorization, c.issuer);
    if (authorization && !((_b = authorization.url) === null || _b === void 0 ? void 0 : _b.searchParams.has("scope"))) {
        authorization.url.searchParams.set("scope", "openid profile email");
    }
    var token = normalizeEndpoint(c.token, c.issuer);
    var userinfo = normalizeEndpoint(c.userinfo, c.issuer);
    var checks = (_c = c.checks) !== null && _c !== void 0 ? _c : ["pkce"];
    if (c.redirectProxyUrl) {
        if (!checks.includes("state"))
            checks.push("state");
        c.redirectProxyUrl = "".concat(c.redirectProxyUrl, "/callback/").concat(c.id);
    }
    return __assign(__assign({}, c), { authorization: authorization, token: token, checks: checks, userinfo: userinfo, profile: (_d = c.profile) !== null && _d !== void 0 ? _d : defaultProfile, account: (_e = c.account) !== null && _e !== void 0 ? _e : defaultAccount });
}
/**
 * Returns basic user profile from the userinfo response/`id_token` claims.
 * The returned `id` will become the `account.providerAccountId`. `user.id`
 * and `account.id` are auto-generated UUID's.
 *
 * The result if this function is used to create the `User` in the database.
 * @see https://authjs.dev/reference/core/adapters#user
 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * @see https://openid.net/specs/openid-connect-core-1_0.html#
 */
var defaultProfile = function (profile) {
    var _a, _b, _c, _d;
    return stripUndefined({
        id: (_b = (_a = profile.sub) !== null && _a !== void 0 ? _a : profile.id) !== null && _b !== void 0 ? _b : crypto.randomUUID(),
        name: (_d = (_c = profile.name) !== null && _c !== void 0 ? _c : profile.nickname) !== null && _d !== void 0 ? _d : profile.preferred_username,
        email: profile.email,
        image: profile.picture,
    });
};
/**
 * Returns basic OAuth/OIDC values from the token response.
 * @see https://www.ietf.org/rfc/rfc6749.html#section-5.1
 * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
 * @see https://authjs.dev/reference/core/adapters#account
 */
var defaultAccount = function (account) {
    return stripUndefined({
        access_token: account.access_token,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        scope: account.scope,
        token_type: account.token_type,
        session_state: account.session_state,
    });
};
function stripUndefined(o) {
    var result = {};
    for (var _i = 0, _a = Object.entries(o); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        v !== undefined && (result[k] = v);
    }
    return result;
}
function normalizeEndpoint(e, issuer) {
    var _a;
    if (!e && issuer)
        return;
    if (typeof e === "string") {
        return { url: new URL(e) };
    }
    // If e.url is undefined, it's because the provider config
    // assumes that we will use the issuer endpoint.
    // The existence of either e.url or provider.issuer is checked in
    // assert.ts. We fallback to "https://authjs.dev" to be able to pass around
    // a valid URL even if the user only provided params.
    // NOTE: This need to be checked when constructing the URL
    // for the authorization, token and userinfo endpoints.
    var url = new URL((_a = e === null || e === void 0 ? void 0 : e.url) !== null && _a !== void 0 ? _a : "https://authjs.dev");
    if ((e === null || e === void 0 ? void 0 : e.params) != null) {
        for (var _i = 0, _b = Object.entries(e.params); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            if (key === "claims")
                value = JSON.stringify(value);
            url.searchParams.set(key, String(value));
        }
    }
    return { url: url, request: e === null || e === void 0 ? void 0 : e.request, conform: e === null || e === void 0 ? void 0 : e.conform };
}
