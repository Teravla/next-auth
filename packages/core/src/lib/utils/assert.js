"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertConfig = void 0;
var cookie_js_1 = require("./cookie.js");
var errors_js_1 = require("../../errors.js");
var warned = false;
function isValidHttpUrl(url, baseUrl) {
    try {
        return /^https?:/.test(new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol);
    }
    catch (_a) {
        return false;
    }
}
function isSemverString(version) {
    return /^v\d+(?:\.\d+){0,2}$/.test(version);
}
var hasCredentials = false;
var hasEmail = false;
var hasWebAuthn = false;
var emailMethods = [
    "createVerificationToken",
    "useVerificationToken",
    "getUserByEmail",
];
var sessionMethods = [
    "createUser",
    "getUser",
    "getUserByEmail",
    "getUserByAccount",
    "updateUser",
    "linkAccount",
    "createSession",
    "getSessionAndUser",
    "updateSession",
    "deleteSession",
];
var webauthnMethods = [
    "createUser",
    "getUser",
    "linkAccount",
    "getAccount",
    "getAuthenticator",
    "createAuthenticator",
    "listAuthenticatorsByUserId",
    "updateAuthenticatorCounter",
];
/**
 * Verify that the user configured Auth.js correctly.
 * Good place to mention deprecations as well.
 *
 * This is invoked before the init method, so default values are not available yet.
 */
function assertConfig(request, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var url = request.url;
    var warnings = [];
    if (!warned && options.debug)
        warnings.push("debug-enabled");
    if (!options.trustHost) {
        return new errors_js_1.UntrustedHost("Host must be trusted. URL was: ".concat(request.url));
    }
    if (!((_a = options.secret) === null || _a === void 0 ? void 0 : _a.length)) {
        return new errors_js_1.MissingSecret("Please define a `secret`.");
    }
    var callbackUrlParam = (_b = request.query) === null || _b === void 0 ? void 0 : _b.callbackUrl;
    if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
        return new errors_js_1.InvalidCallbackUrl("Invalid callback URL. Received: ".concat(callbackUrlParam));
    }
    var defaultCallbackUrl = (0, cookie_js_1.defaultCookies)((_c = options.useSecureCookies) !== null && _c !== void 0 ? _c : url.protocol === "https:").callbackUrl;
    var callbackUrlCookie = (_d = request.cookies) === null || _d === void 0 ? void 0 : _d[(_g = (_f = (_e = options.cookies) === null || _e === void 0 ? void 0 : _e.callbackUrl) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : defaultCallbackUrl.name];
    if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.origin)) {
        return new errors_js_1.InvalidCallbackUrl("Invalid callback URL. Received: ".concat(callbackUrlCookie));
    }
    // Keep track of webauthn providers that use conditional UI
    var hasConditionalUIProvider = false;
    for (var _i = 0, _m = options.providers; _i < _m.length; _i++) {
        var p = _m[_i];
        var provider = typeof p === "function" ? p() : p;
        if ((provider.type === "oauth" || provider.type === "oidc") &&
            !((_h = provider.issuer) !== null && _h !== void 0 ? _h : (_j = provider.options) === null || _j === void 0 ? void 0 : _j.issuer)) {
            var a = provider.authorization, t = provider.token, u = provider.userinfo;
            var key = void 0;
            if (typeof a !== "string" && !(a === null || a === void 0 ? void 0 : a.url))
                key = "authorization";
            else if (typeof t !== "string" && !(t === null || t === void 0 ? void 0 : t.url))
                key = "token";
            else if (typeof u !== "string" && !(u === null || u === void 0 ? void 0 : u.url))
                key = "userinfo";
            if (key) {
                return new errors_js_1.InvalidEndpoints("Provider \"".concat(provider.id, "\" is missing both `issuer` and `").concat(key, "` endpoint config. At least one of them is required."));
            }
        }
        if (provider.type === "credentials")
            hasCredentials = true;
        else if (provider.type === "email")
            hasEmail = true;
        else if (provider.type === "webauthn") {
            hasWebAuthn = true;
            // Validate simpleWebAuthnBrowserVersion
            if (provider.simpleWebAuthnBrowserVersion &&
                !isSemverString(provider.simpleWebAuthnBrowserVersion)) {
                return new errors_js_1.AuthError("Invalid provider config for \"".concat(provider.id, "\": simpleWebAuthnBrowserVersion \"").concat(provider.simpleWebAuthnBrowserVersion, "\" must be a valid semver string."));
            }
            if (provider.enableConditionalUI) {
                // Make sure only one webauthn provider has "enableConditionalUI" set to true
                if (hasConditionalUIProvider) {
                    return new errors_js_1.DuplicateConditionalUI("Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time.");
                }
                hasConditionalUIProvider = true;
                // Make sure at least one formField has "webauthn" in its autocomplete param
                var hasWebauthnFormField = Object.values(provider.formFields).some(function (f) {
                    return f.autocomplete && f.autocomplete.toString().indexOf("webauthn") > -1;
                });
                if (!hasWebauthnFormField) {
                    return new errors_js_1.MissingWebAuthnAutocomplete("Provider \"".concat(provider.id, "\" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param."));
                }
            }
        }
    }
    if (hasCredentials) {
        var dbStrategy = ((_k = options.session) === null || _k === void 0 ? void 0 : _k.strategy) === "database";
        var onlyCredentials = !options.providers.some(function (p) { return (typeof p === "function" ? p() : p).type !== "credentials"; });
        if (dbStrategy && onlyCredentials) {
            return new errors_js_1.UnsupportedStrategy("Signing in with credentials only supported if JWT strategy is enabled");
        }
        var credentialsNoAuthorize = options.providers.some(function (p) {
            var provider = typeof p === "function" ? p() : p;
            return provider.type === "credentials" && !provider.authorize;
        });
        if (credentialsNoAuthorize) {
            return new errors_js_1.MissingAuthorize("Must define an authorize() handler to use credentials authentication provider");
        }
    }
    var adapter = options.adapter, session = options.session;
    var requiredMethods = [];
    if (hasEmail ||
        (session === null || session === void 0 ? void 0 : session.strategy) === "database" ||
        (!(session === null || session === void 0 ? void 0 : session.strategy) && adapter)) {
        if (hasEmail) {
            if (!adapter)
                return new errors_js_1.MissingAdapter("Email login requires an adapter.");
            requiredMethods.push.apply(requiredMethods, emailMethods);
        }
        else {
            if (!adapter)
                return new errors_js_1.MissingAdapter("Database session requires an adapter.");
            requiredMethods.push.apply(requiredMethods, sessionMethods);
        }
    }
    if (hasWebAuthn) {
        // Log experimental warning
        if ((_l = options.experimental) === null || _l === void 0 ? void 0 : _l.enableWebAuthn) {
            warnings.push("experimental-webauthn");
        }
        else {
            return new errors_js_1.ExperimentalFeatureNotEnabled("WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config.");
        }
        if (!adapter)
            return new errors_js_1.MissingAdapter("WebAuthn requires an adapter.");
        requiredMethods.push.apply(requiredMethods, webauthnMethods);
    }
    if (adapter) {
        var missing = requiredMethods.filter(function (m) { return !(m in adapter); });
        if (missing.length) {
            return new errors_js_1.MissingAdapterMethods("Required adapter methods were missing: ".concat(missing.join(", ")));
        }
    }
    if (!warned)
        warned = true;
    return warnings;
}
exports.assertConfig = assertConfig;
