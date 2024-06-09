"use strict";
/**
 *
 *
 * This module contains functions and types
 * to encode and decode {@link https://authjs.dev/concepts/session-strategies#jwt-session JWT}s
 * issued and used by Auth.js.
 *
 * The JWT issued by Auth.js is _encrypted by default_, using the _A256CBC-HS512_ algorithm ({@link https://www.rfc-editor.org/rfc/rfc7518.html#section-5.2.5 JWE}).
 * It uses the `AUTH_SECRET` environment variable or the passed `secret` propery to derive a suitable encryption key.
 *
 * :::info Note
 * Auth.js JWTs are meant to be used by the same app that issued them.
 * If you need JWT authentication for your third-party API, you should rely on your Identity Provider instead.
 * :::
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * You can then import this submodule from `@auth/core/jwt`.
 *
 * ## Usage
 *
 * :::warning Warning
 * This module *will* be refactored/changed. We do not recommend relying on it right now.
 * :::
 *
 *
 * ## Resources
 *
 * - [What is a JWT session strategy](https://authjs.dev/concepts/session-strategies#jwt-session)
 * - [RFC7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519)
 *
 * @module jwt
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
exports.getToken = exports.decode = exports.encode = void 0;
var hkdf_1 = require("@panva/hkdf");
var jose_1 = require("jose");
var cookie_js_1 = require("./lib/utils/cookie.js");
var errors_js_1 = require("./errors.js");
var cookie_1 = require("cookie");
var DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
var now = function () { return (Date.now() / 1000) | 0; };
var alg = "dir";
var enc = "A256CBC-HS512";
/** Issues a JWT. By default, the JWT is encrypted using "A256CBC-HS512". */
function encode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, secret, _b, maxAge, salt, secrets, encryptionSecret, thumbprint;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = params.token, token = _a === void 0 ? {} : _a, secret = params.secret, _b = params.maxAge, maxAge = _b === void 0 ? DEFAULT_MAX_AGE : _b, salt = params.salt;
                    secrets = Array.isArray(secret) ? secret : [secret];
                    return [4 /*yield*/, getDerivedEncryptionKey(enc, secrets[0], salt)];
                case 1:
                    encryptionSecret = _c.sent();
                    return [4 /*yield*/, (0, jose_1.calculateJwkThumbprint)({ kty: "oct", k: jose_1.base64url.encode(encryptionSecret) }, "sha".concat(encryptionSecret.byteLength << 3))
                        // @ts-expect-error `jose` allows any object as payload.
                    ];
                case 2:
                    thumbprint = _c.sent();
                    return [4 /*yield*/, new jose_1.EncryptJWT(token)
                            .setProtectedHeader({ alg: alg, enc: enc, kid: thumbprint })
                            .setIssuedAt()
                            .setExpirationTime(now() + maxAge)
                            .setJti(crypto.randomUUID())
                            .encrypt(encryptionSecret)];
                case 3: 
                // @ts-expect-error `jose` allows any object as payload.
                return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.encode = encode;
/** Decodes a Auth.js issued JWT. */
function decode(params) {
    return __awaiter(this, void 0, void 0, function () {
        var token, secret, salt, secrets, payload;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = params.token, secret = params.secret, salt = params.salt;
                    secrets = Array.isArray(secret) ? secret : [secret];
                    if (!token)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, jose_1.jwtDecrypt)(token, function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var _i, secrets_1, secret_1, encryptionSecret, thumbprint;
                            var kid = _b.kid, enc = _b.enc;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _i = 0, secrets_1 = secrets;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < secrets_1.length)) return [3 /*break*/, 5];
                                        secret_1 = secrets_1[_i];
                                        return [4 /*yield*/, getDerivedEncryptionKey(enc, secret_1, salt)];
                                    case 2:
                                        encryptionSecret = _c.sent();
                                        if (kid === undefined)
                                            return [2 /*return*/, encryptionSecret];
                                        return [4 /*yield*/, (0, jose_1.calculateJwkThumbprint)({ kty: "oct", k: jose_1.base64url.encode(encryptionSecret) }, "sha".concat(encryptionSecret.byteLength << 3))];
                                    case 3:
                                        thumbprint = _c.sent();
                                        if (kid === thumbprint)
                                            return [2 /*return*/, encryptionSecret];
                                        _c.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 5: throw new Error("no matching decryption secret");
                                }
                            });
                        }); }, {
                            clockTolerance: 15,
                            keyManagementAlgorithms: [alg],
                            contentEncryptionAlgorithms: [enc, "A256GCM"],
                        })];
                case 1:
                    payload = (_a.sent()).payload;
                    return [2 /*return*/, payload];
            }
        });
    });
}
exports.decode = decode;
function getToken(params) {
    return __awaiter(this, void 0, void 0, function () {
        var secureCookie, _a, cookieName, _b, _decode, _c, salt, secret, _d, logger, raw, req, headers, sessionStore, token, authorizationHeader, urlEncodedToken, _e;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    secureCookie = params.secureCookie, _a = params.cookieName, cookieName = _a === void 0 ? secureCookie
                        ? "__Secure-authjs.session-token"
                        : "authjs.session-token" : _a, _b = params.decode, _decode = _b === void 0 ? decode : _b, _c = params.salt, salt = _c === void 0 ? cookieName : _c, secret = params.secret, _d = params.logger, logger = _d === void 0 ? console : _d, raw = params.raw, req = params.req;
                    if (!req)
                        throw new Error("Must pass `req` to JWT getToken()");
                    if (!secret)
                        throw new errors_js_1.MissingSecret("Must pass `secret` if not set to JWT getToken()");
                    headers = req.headers instanceof Headers ? req.headers : new Headers(req.headers);
                    sessionStore = new cookie_js_1.SessionStore({ name: cookieName, options: { secure: secureCookie } }, (0, cookie_1.parse)((_f = headers.get("cookie")) !== null && _f !== void 0 ? _f : ""), logger);
                    token = sessionStore.value;
                    authorizationHeader = headers.get("authorization");
                    if (!token && (authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ")[0]) === "Bearer") {
                        urlEncodedToken = authorizationHeader.split(" ")[1];
                        token = decodeURIComponent(urlEncodedToken);
                    }
                    if (!token)
                        return [2 /*return*/, null];
                    if (raw)
                        return [2 /*return*/, token];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _decode({ token: token, secret: secret, salt: salt })];
                case 2: return [2 /*return*/, _g.sent()];
                case 3:
                    _e = _g.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getToken = getToken;
function getDerivedEncryptionKey(enc, keyMaterial, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var length;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    switch (enc) {
                        case "A256CBC-HS512":
                            length = 64;
                            break;
                        case "A256GCM":
                            length = 32;
                            break;
                        default:
                            throw new Error("Unsupported JWT Content Encryption Algorithm");
                    }
                    return [4 /*yield*/, (0, hkdf_1.hkdf)("sha256", keyMaterial, salt, "Auth.js Generated Encryption Key (".concat(salt, ")"), length)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
