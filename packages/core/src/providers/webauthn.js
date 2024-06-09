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
exports.DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION = exports.DEFAULT_WEBAUTHN_TIMEOUT = void 0;
var server_1 = require("@simplewebauthn/server");
var errors_js_1 = require("../errors.js");
exports.DEFAULT_WEBAUTHN_TIMEOUT = 5 * 60 * 1000; // 5 minutes
exports.DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION = "v9.0.1";
/**
 * Add WebAuthn login to your page.
 *
 * ### Setup
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import WebAuthn from "@auth/core/providers/webauthn"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [WebAuthn],
 * })
 * ```
 * ### Resources
 *
 * - [SimpleWebAuthn - Server side](https://simplewebauthn.dev/docs/packages/server)
 * - [SimpleWebAuthn - Client side](https://simplewebauthn.dev/docs/packages/client)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/webauthn.ts)
 *
 * :::tip
 *
 * The WebAuthn provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/webauthn.ts).
 * To override the defaults for your use case, check out [customizing the built-in WebAuthn provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
function WebAuthn(config) {
    return __assign(__assign({ id: "webauthn", name: "WebAuthn", enableConditionalUI: true, simpleWebAuthn: {
            generateAuthenticationOptions: server_1.generateAuthenticationOptions,
            generateRegistrationOptions: server_1.generateRegistrationOptions,
            verifyAuthenticationResponse: server_1.verifyAuthenticationResponse,
            verifyRegistrationResponse: server_1.verifyRegistrationResponse,
        }, authenticationOptions: { timeout: exports.DEFAULT_WEBAUTHN_TIMEOUT }, registrationOptions: { timeout: exports.DEFAULT_WEBAUTHN_TIMEOUT }, formFields: {
            email: {
                label: "Email",
                required: true,
                autocomplete: "username webauthn",
            },
        }, simpleWebAuthnBrowserVersion: exports.DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION, getUserInfo: getUserInfo, getRelayingParty: getRelayingParty }, config), { type: "webauthn" });
}
exports.default = WebAuthn;
/**
 * Retrieves user information for the WebAuthn provider.
 *
 * It looks for the "email" query parameter and uses it to look up the user in the database.
 * It also accepts a "name" query parameter to set the user's display name.
 *
 * @param options - The internaloptions object.
 * @param request - The request object containing the query parameters.
 * @returns The existing or new user info.
 * @throws {MissingAdapter} If the adapter is missing.
 * @throws {EmailSignInError} If the email address is not provided.
 */
var getUserInfo = function (options, request) { return __awaiter(void 0, void 0, void 0, function () {
    var adapter, query, body, method, email, existingUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adapter = options.adapter;
                if (!adapter)
                    throw new errors_js_1.MissingAdapter("WebAuthn provider requires a database adapter to be configured.");
                query = request.query, body = request.body, method = request.method;
                email = (method === "POST" ? body === null || body === void 0 ? void 0 : body.email : query === null || query === void 0 ? void 0 : query.email);
                // If email is not provided, return null
                if (!email || typeof email !== "string")
                    return [2 /*return*/, null];
                return [4 /*yield*/, adapter.getUserByEmail(email)];
            case 1:
                existingUser = _a.sent();
                if (existingUser) {
                    return [2 /*return*/, { user: existingUser, exists: true }];
                }
                // If the user does not exist, return a new user info.
                return [2 /*return*/, { user: { email: email }, exists: false }];
        }
    });
}); };
/**
 * Retrieves the relaying party information based on the provided options.
 * If the relaying party information is not provided, it falls back to using the URL information.
 */
function getRelayingParty(
/** The options object containing the provider and URL information. */
options) {
    var provider = options.provider, url = options.url;
    var relayingParty = provider.relayingParty;
    var id = Array.isArray(relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.id)
        ? relayingParty.id[0]
        : relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.id;
    var name = Array.isArray(relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.name)
        ? relayingParty.name[0]
        : relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.name;
    var origin = Array.isArray(relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.origin)
        ? relayingParty.origin[0]
        : relayingParty === null || relayingParty === void 0 ? void 0 : relayingParty.origin;
    return {
        id: id !== null && id !== void 0 ? id : url.hostname,
        name: name !== null && name !== void 0 ? name : url.host,
        origin: origin !== null && origin !== void 0 ? origin : url.origin,
    };
}
