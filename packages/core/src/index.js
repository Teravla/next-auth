"use strict";
/**
 *
 * :::warning Experimental
 * `@auth/core` is under active development.
 * :::
 *
 * This is the main entry point to the Auth.js library.
 *
 * Based on the {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Request}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} Web standard APIs.
 * Primarily used to implement [framework](https://authjs.dev/getting-started/integrations)-specific packages,
 * but it can also be used directly.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {...})
 *
 * console.log(response instanceof Response) // true
 * ```
 *
 * ## Resources
 *
 * - [Getting started](https://authjs.dev/getting-started)
 * - [Guides](https://authjs.dev/guides)
 *
 * @module @auth/core
 */
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
exports.Auth = exports.isAuthAction = exports.createActionURL = exports.setEnvDefaults = exports.raw = exports.skipCSRFCheck = void 0;
var assert_js_1 = require("./lib/utils/assert.js");
var errors_js_1 = require("./errors.js");
var index_js_1 = require("./lib/index.js");
Object.defineProperty(exports, "raw", { enumerable: true, get: function () { return index_js_1.raw; } });
Object.defineProperty(exports, "skipCSRFCheck", { enumerable: true, get: function () { return index_js_1.skipCSRFCheck; } });
var env_js_1 = require("./lib/utils/env.js");
Object.defineProperty(exports, "setEnvDefaults", { enumerable: true, get: function () { return env_js_1.setEnvDefaults; } });
Object.defineProperty(exports, "createActionURL", { enumerable: true, get: function () { return env_js_1.createActionURL; } });
var index_js_2 = require("./lib/pages/index.js");
var logger_js_1 = require("./lib/utils/logger.js");
var web_js_1 = require("./lib/utils/web.js");
var actions_js_1 = require("./lib/utils/actions.js");
Object.defineProperty(exports, "isAuthAction", { enumerable: true, get: function () { return actions_js_1.isAuthAction; } });
/**
 * Core functionality provided by Auth.js.
 *
 * Receives a standard {@link Request} and returns a {@link Response}.
 *
 * @example
 * ```ts
 * import Auth from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [Google],
 *   secret: "...",
 *   trustHost: true,
 * })
 *```
 * @see [Documentation](https://authjs.dev)
 */
function Auth(request, config) {
    return __awaiter(this, void 0, void 0, function () {
        var internalRequest, warningsOrError, htmlPages, message, pages, theme, authOnErrorPage, page, isRedirect, isRaw, internalResponse, response, url, e_1, error, isAuthError, isClientSafeErrorType, type, params, pageKind, pagePath, url;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, logger_js_1.setLogger)(config.logger, config.debug);
                    return [4 /*yield*/, (0, web_js_1.toInternalRequest)(request, config)
                        // There was an error parsing the request
                    ];
                case 1:
                    internalRequest = _e.sent();
                    // There was an error parsing the request
                    if (!internalRequest)
                        return [2 /*return*/, Response.json("Bad request.", { status: 400 })];
                    warningsOrError = (0, assert_js_1.assertConfig)(internalRequest, config);
                    if (Array.isArray(warningsOrError)) {
                        warningsOrError.forEach(logger_js_1.logger.warn);
                    }
                    else if (warningsOrError) {
                        // If there's an error in the user config, bail out early
                        logger_js_1.logger.error(warningsOrError);
                        htmlPages = new Set([
                            "signin",
                            "signout",
                            "error",
                            "verify-request",
                        ]);
                        if (!htmlPages.has(internalRequest.action) ||
                            internalRequest.method !== "GET") {
                            message = "There was a problem with the server configuration. Check the server logs for more information.";
                            return [2 /*return*/, Response.json({ message: message }, { status: 500 })];
                        }
                        pages = config.pages, theme = config.theme;
                        authOnErrorPage = (pages === null || pages === void 0 ? void 0 : pages.error) &&
                            ((_a = internalRequest.url.searchParams
                                .get("callbackUrl")) === null || _a === void 0 ? void 0 : _a.startsWith(pages.error));
                        // Either there was no error page configured or the configured one contains infinite redirects
                        if (!(pages === null || pages === void 0 ? void 0 : pages.error) || authOnErrorPage) {
                            if (authOnErrorPage) {
                                logger_js_1.logger.error(new errors_js_1.ErrorPageLoop("The error page ".concat(pages === null || pages === void 0 ? void 0 : pages.error, " should not require authentication")));
                            }
                            page = (0, index_js_2.default)({ theme: theme }).error("Configuration");
                            return [2 /*return*/, (0, web_js_1.toResponse)(page)];
                        }
                        return [2 /*return*/, Response.redirect("".concat(pages.error, "?error=Configuration"))];
                    }
                    isRedirect = (_b = request.headers) === null || _b === void 0 ? void 0 : _b.has("X-Auth-Return-Redirect");
                    isRaw = config.raw === index_js_1.raw;
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, index_js_1.AuthInternal)(internalRequest, config)];
                case 3:
                    internalResponse = _e.sent();
                    if (isRaw)
                        return [2 /*return*/, internalResponse];
                    response = (0, web_js_1.toResponse)(internalResponse);
                    url = response.headers.get("Location");
                    if (!isRedirect || !url)
                        return [2 /*return*/, response];
                    return [2 /*return*/, Response.json({ url: url }, { headers: response.headers })];
                case 4:
                    e_1 = _e.sent();
                    error = e_1;
                    logger_js_1.logger.error(error);
                    isAuthError = error instanceof errors_js_1.AuthError;
                    if (isAuthError && isRaw && !isRedirect)
                        throw error;
                    // If the CSRF check failed for POST/session, return a 400 status code.
                    // We should not redirect to a page as this is an API route
                    if (request.method === "POST" && internalRequest.action === "session")
                        return [2 /*return*/, Response.json(null, { status: 400 })];
                    isClientSafeErrorType = (0, errors_js_1.isClientError)(error);
                    type = isClientSafeErrorType ? error.type : "Configuration";
                    params = new URLSearchParams({ error: type });
                    if (error instanceof errors_js_1.CredentialsSignin)
                        params.set("code", error.code);
                    pageKind = (isAuthError && error.kind) || "error";
                    pagePath = (_d = (_c = config.pages) === null || _c === void 0 ? void 0 : _c[pageKind]) !== null && _d !== void 0 ? _d : "".concat(config.basePath, "/").concat(pageKind.toLowerCase());
                    url = "".concat(internalRequest.url.origin).concat(pagePath, "?").concat(params);
                    if (isRedirect)
                        return [2 /*return*/, Response.json({ url: url })];
                    return [2 /*return*/, Response.redirect(url)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.Auth = Auth;
