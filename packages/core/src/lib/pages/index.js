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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_render_to_string_1 = require("preact-render-to-string");
var error_js_1 = require("./error.js");
var signin_js_1 = require("./signin.js");
var signout_js_1 = require("./signout.js");
var styles_js_1 = require("./styles.js");
var verify_request_js_1 = require("./verify-request.js");
var errors_js_1 = require("../../errors.js");
function send(_a) {
    var _b;
    var html = _a.html, title = _a.title, status = _a.status, cookies = _a.cookies, theme = _a.theme, headTags = _a.headTags;
    return {
        cookies: cookies,
        status: status,
        headers: { "Content-Type": "text/html" },
        body: "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>".concat(styles_js_1.default, "</style><title>").concat(title, "</title>").concat(headTags !== null && headTags !== void 0 ? headTags : "", "</head><body class=\"__next-auth-theme-").concat((_b = theme === null || theme === void 0 ? void 0 : theme.colorScheme) !== null && _b !== void 0 ? _b : "auto", "\"><div class=\"page\">").concat((0, preact_render_to_string_1.renderToString)(html), "</div></body></html>"),
    };
}
/**
 * Unless the user defines their [own pages](https://authjs.dev/reference/core#pages),
 * we render a set of default ones, using Preact SSR.
 */
function renderPage(params) {
    var url = params.url, theme = params.theme, query = params.query, cookies = params.cookies, pages = params.pages, providers = params.providers;
    return {
        csrf: function (skip, options, cookies) {
            if (!skip) {
                return {
                    headers: { "Content-Type": "application/json" },
                    body: { csrfToken: options.csrfToken },
                    cookies: cookies,
                };
            }
            options.logger.warn("csrf-disabled");
            cookies.push({
                name: options.cookies.csrfToken.name,
                value: "",
                options: __assign(__assign({}, options.cookies.csrfToken.options), { maxAge: 0 }),
            });
            return { status: 404, cookies: cookies };
        },
        providers: function (providers) {
            return {
                headers: { "Content-Type": "application/json" },
                body: providers.reduce(function (acc, _a) {
                    var id = _a.id, name = _a.name, type = _a.type, signinUrl = _a.signinUrl, callbackUrl = _a.callbackUrl;
                    acc[id] = { id: id, name: name, type: type, signinUrl: signinUrl, callbackUrl: callbackUrl };
                    return acc;
                }, {}),
            };
        },
        signin: function (providerId, error) {
            var _a, _b;
            if (providerId)
                throw new errors_js_1.UnknownAction("Unsupported action");
            if (pages === null || pages === void 0 ? void 0 : pages.signIn) {
                var signinUrl = "".concat(pages.signIn).concat(pages.signIn.includes("?") ? "&" : "?").concat(new URLSearchParams({ callbackUrl: (_a = params.callbackUrl) !== null && _a !== void 0 ? _a : "/" }));
                if (error)
                    signinUrl = "".concat(signinUrl, "&").concat(new URLSearchParams({ error: error }));
                return { redirect: signinUrl, cookies: cookies };
            }
            // If we have a webauthn provider with conditional UI and
            // a simpleWebAuthnBrowserScript is defined, we need to
            // render the script in the page.
            var webauthnProvider = providers === null || providers === void 0 ? void 0 : providers.find(function (p) {
                return p.type === "webauthn" &&
                    p.enableConditionalUI &&
                    !!p.simpleWebAuthnBrowserVersion;
            });
            var simpleWebAuthnBrowserScript = "";
            if (webauthnProvider) {
                var simpleWebAuthnBrowserVersion = webauthnProvider.simpleWebAuthnBrowserVersion;
                simpleWebAuthnBrowserScript = "<script src=\"https://unpkg.com/@simplewebauthn/browser@".concat(simpleWebAuthnBrowserVersion, "/dist/bundle/index.umd.min.js\" crossorigin=\"anonymous\"></script>");
            }
            return send({
                cookies: cookies,
                theme: theme,
                html: (0, signin_js_1.default)(__assign({ csrfToken: params.csrfToken, 
                    // We only want to render providers
                    providers: (_b = params.providers) === null || _b === void 0 ? void 0 : _b.filter(function (provider) {
                        // Always render oauth and email type providers
                        return ["email", "oauth", "oidc"].includes(provider.type) ||
                            // Only render credentials type provider if credentials are defined
                            (provider.type === "credentials" && provider.credentials) ||
                            // Only render webauthn type provider if formFields are defined
                            (provider.type === "webauthn" && provider.formFields) ||
                            // Don't render other provider types
                            false;
                    }), callbackUrl: params.callbackUrl, theme: params.theme, error: error }, query)),
                title: "Sign In",
                headTags: simpleWebAuthnBrowserScript,
            });
        },
        signout: function () {
            if (pages === null || pages === void 0 ? void 0 : pages.signOut)
                return { redirect: pages.signOut, cookies: cookies };
            return send({
                cookies: cookies,
                theme: theme,
                html: (0, signout_js_1.default)({ csrfToken: params.csrfToken, url: url, theme: theme }),
                title: "Sign Out",
            });
        },
        verifyRequest: function (props) {
            if (pages === null || pages === void 0 ? void 0 : pages.verifyRequest)
                return { redirect: pages.verifyRequest, cookies: cookies };
            return send({
                cookies: cookies,
                theme: theme,
                html: (0, verify_request_js_1.default)(__assign({ url: url, theme: theme }, props)),
                title: "Verify Request",
            });
        },
        error: function (error) {
            if (pages === null || pages === void 0 ? void 0 : pages.error) {
                return {
                    redirect: "".concat(pages.error).concat(pages.error.includes("?") ? "&" : "?", "error=").concat(error),
                    cookies: cookies,
                };
            }
            return send(__assign(__assign({ cookies: cookies, theme: theme }, (0, error_js_1.default)({ url: url, theme: theme, error: error })), { title: "Error" }));
        },
    };
}
exports.default = renderPage;
