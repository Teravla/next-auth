"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionURL = exports.setEnvDefaults = void 0;
var logger_js_1 = require("./logger.js");
/** Set default env variables on the config object */
function setEnvDefaults(envObject, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        var url = envObject.AUTH_URL;
        if (url && !config.basePath)
            config.basePath = new URL(url).pathname;
    }
    catch (_j) {
    }
    finally {
        (_a = config.basePath) !== null && _a !== void 0 ? _a : (config.basePath = "/auth");
    }
    if (!((_b = config.secret) === null || _b === void 0 ? void 0 : _b.length)) {
        config.secret = [];
        var secret = envObject.AUTH_SECRET;
        if (secret)
            config.secret.push(secret);
        for (var _i = 0, _k = [1, 2, 3]; _i < _k.length; _i++) {
            var i = _k[_i];
            var secret_1 = envObject["AUTH_SECRET_".concat(i)];
            if (secret_1)
                config.secret.unshift(secret_1);
        }
    }
    (_c = config.redirectProxyUrl) !== null && _c !== void 0 ? _c : (config.redirectProxyUrl = envObject.AUTH_REDIRECT_PROXY_URL);
    (_d = config.trustHost) !== null && _d !== void 0 ? _d : (config.trustHost = !!((_h = (_g = (_f = (_e = envObject.AUTH_URL) !== null && _e !== void 0 ? _e : envObject.AUTH_TRUST_HOST) !== null && _f !== void 0 ? _f : envObject.VERCEL) !== null && _g !== void 0 ? _g : envObject.CF_PAGES) !== null && _h !== void 0 ? _h : envObject.NODE_ENV !== "production"));
    config.providers = config.providers.map(function (p) {
        var _a, _b, _c, _d;
        var finalProvider = typeof p === "function" ? p({}) : p;
        var ID = finalProvider.id.toUpperCase().replace(/-/g, "_");
        if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
            (_a = finalProvider.clientId) !== null && _a !== void 0 ? _a : (finalProvider.clientId = envObject["AUTH_".concat(ID, "_ID")]);
            (_b = finalProvider.clientSecret) !== null && _b !== void 0 ? _b : (finalProvider.clientSecret = envObject["AUTH_".concat(ID, "_SECRET")]);
            if (finalProvider.type === "oidc") {
                (_c = finalProvider.issuer) !== null && _c !== void 0 ? _c : (finalProvider.issuer = envObject["AUTH_".concat(ID, "_ISSUER")]);
            }
        }
        else if (finalProvider.type === "email") {
            (_d = finalProvider.apiKey) !== null && _d !== void 0 ? _d : (finalProvider.apiKey = envObject["AUTH_".concat(ID, "_KEY")]);
        }
        return finalProvider;
    });
}
exports.setEnvDefaults = setEnvDefaults;
function createActionURL(action, protocol, headers, envObject, basePath) {
    var _a, _b, _c, _d, _e;
    var envUrl = (_a = envObject.AUTH_URL) !== null && _a !== void 0 ? _a : envObject.NEXTAUTH_URL;
    var url;
    if (envUrl) {
        url = new URL(envUrl);
        if (basePath && basePath !== "/" && url.pathname !== "/") {
            logger_js_1.logger.warn(url.pathname === basePath
                ? "env-url-basepath-redundant"
                : "env-url-basepath-mismatch");
            url.pathname = "/";
        }
    }
    else {
        var detectedHost = (_b = headers.get("x-forwarded-host")) !== null && _b !== void 0 ? _b : headers.get("host");
        var detectedProtocol = (_d = (_c = headers.get("x-forwarded-proto")) !== null && _c !== void 0 ? _c : protocol) !== null && _d !== void 0 ? _d : "https";
        var _protocol = detectedProtocol.endsWith(":")
            ? detectedProtocol
            : detectedProtocol + ":";
        url = new URL("".concat(_protocol, "//").concat(detectedHost));
    }
    // remove trailing slash
    var sanitizedUrl = url.toString().replace(/\/$/, "");
    if (basePath) {
        // remove leading and trailing slash
        var sanitizedBasePath = (_e = basePath === null || basePath === void 0 ? void 0 : basePath.replace(/(^\/|\/$)/g, "")) !== null && _e !== void 0 ? _e : "";
        return new URL("".concat(sanitizedUrl, "/").concat(sanitizedBasePath, "/").concat(action));
    }
    return new URL("".concat(sanitizedUrl, "/").concat(action));
}
exports.createActionURL = createActionURL;
