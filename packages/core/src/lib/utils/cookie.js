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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SessionStore_instances, _SessionStore_chunks, _SessionStore_option, _SessionStore_logger, _SessionStore_chunk, _SessionStore_clean;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = exports.defaultCookies = void 0;
// Uncomment to recalculate the estimated size
// of an empty session cookie
// import { serialize } from "cookie"
// console.log(
//   "Cookie estimated to be ",
//   serialize(`__Secure.authjs.session-token.0`, "", {
//     expires: new Date(),
//     httpOnly: true,
//     maxAge: Number.MAX_SAFE_INTEGER,
//     path: "/",
//     sameSite: "strict",
//     secure: true,
//     domain: "example.com",
//   }).length,
//   " bytes"
// )
var ALLOWED_COOKIE_SIZE = 4096;
// Based on commented out section above
var ESTIMATED_EMPTY_COOKIE_SIZE = 160;
var CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
/**
 * Use secure cookies if the site uses HTTPS
 * This being conditional allows cookies to work non-HTTPS development URLs
 * Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
 * prefix, but enable them by default if the site URL is HTTPS; but not for
 * non-HTTPS URLs like http://localhost which are used in development).
 * For more on prefixes see https://googlechrome.github.io/samples/cookie-prefixes/
 *
 * @TODO Review cookie settings (names, options)
 */
function defaultCookies(useSecureCookies) {
    var cookiePrefix = useSecureCookies ? "__Secure-" : "";
    return {
        // default cookie options
        sessionToken: {
            name: "".concat(cookiePrefix, "authjs.session-token"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        callbackUrl: {
            name: "".concat(cookiePrefix, "authjs.callback-url"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        csrfToken: {
            // Default to __Host- for CSRF token for additional protection if using useSecureCookies
            // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
            name: "".concat(useSecureCookies ? "__Host-" : "", "authjs.csrf-token"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        pkceCodeVerifier: {
            name: "".concat(cookiePrefix, "authjs.pkce.code_verifier"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15, // 15 minutes in seconds
            },
        },
        state: {
            name: "".concat(cookiePrefix, "authjs.state"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15, // 15 minutes in seconds
            },
        },
        nonce: {
            name: "".concat(cookiePrefix, "authjs.nonce"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        webauthnChallenge: {
            name: "".concat(cookiePrefix, "authjs.challenge"),
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15, // 15 minutes in seconds
            },
        },
    };
}
exports.defaultCookies = defaultCookies;
var SessionStore = /** @class */ (function () {
    function SessionStore(option, cookies, logger) {
        _SessionStore_instances.add(this);
        _SessionStore_chunks.set(this, {});
        _SessionStore_option.set(this, void 0);
        _SessionStore_logger.set(this, void 0);
        __classPrivateFieldSet(this, _SessionStore_logger, logger, "f");
        __classPrivateFieldSet(this, _SessionStore_option, option, "f");
        if (!cookies)
            return;
        var sessionCookiePrefix = option.name;
        for (var _i = 0, _a = Object.entries(cookies); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], value = _b[1];
            if (!name_1.startsWith(sessionCookiePrefix) || !value)
                continue;
            __classPrivateFieldGet(this, _SessionStore_chunks, "f")[name_1] = value;
        }
    }
    Object.defineProperty(SessionStore.prototype, "value", {
        /**
         * The JWT Session or database Session ID
         * constructed from the cookie chunks.
         */
        get: function () {
            var _this = this;
            // Sort the chunks by their keys before joining
            var sortedKeys = Object.keys(__classPrivateFieldGet(this, _SessionStore_chunks, "f")).sort(function (a, b) {
                var aSuffix = parseInt(a.split(".").pop() || "0");
                var bSuffix = parseInt(b.split(".").pop() || "0");
                return aSuffix - bSuffix;
            });
            // Use the sorted keys to join the chunks in the correct order
            return sortedKeys.map(function (key) { return __classPrivateFieldGet(_this, _SessionStore_chunks, "f")[key]; }).join("");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Given a cookie value, return new cookies, chunked, to fit the allowed cookie size.
     * If the cookie has changed from chunked to unchunked or vice versa,
     * it deletes the old cookies as well.
     */
    SessionStore.prototype.chunk = function (value, options) {
        // Assume all cookies should be cleaned by default
        var cookies = __classPrivateFieldGet(this, _SessionStore_instances, "m", _SessionStore_clean).call(this);
        // Calculate new chunks
        var chunked = __classPrivateFieldGet(this, _SessionStore_instances, "m", _SessionStore_chunk).call(this, {
            name: __classPrivateFieldGet(this, _SessionStore_option, "f").name,
            value: value,
            options: __assign(__assign({}, __classPrivateFieldGet(this, _SessionStore_option, "f").options), options),
        });
        // Update stored chunks / cookies
        for (var _i = 0, chunked_1 = chunked; _i < chunked_1.length; _i++) {
            var chunk = chunked_1[_i];
            cookies[chunk.name] = chunk;
        }
        return Object.values(cookies);
    };
    /** Returns a list of cookies that should be cleaned. */
    SessionStore.prototype.clean = function () {
        return Object.values(__classPrivateFieldGet(this, _SessionStore_instances, "m", _SessionStore_clean).call(this));
    };
    return SessionStore;
}());
exports.SessionStore = SessionStore;
_SessionStore_chunks = new WeakMap(), _SessionStore_option = new WeakMap(), _SessionStore_logger = new WeakMap(), _SessionStore_instances = new WeakSet(), _SessionStore_chunk = function _SessionStore_chunk(cookie) {
    var chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
    if (chunkCount === 1) {
        __classPrivateFieldGet(this, _SessionStore_chunks, "f")[cookie.name] = cookie.value;
        return [cookie];
    }
    var cookies = [];
    for (var i = 0; i < chunkCount; i++) {
        var name_2 = "".concat(cookie.name, ".").concat(i);
        var value = cookie.value.substr(i * CHUNK_SIZE, CHUNK_SIZE);
        cookies.push(__assign(__assign({}, cookie), { name: name_2, value: value }));
        __classPrivateFieldGet(this, _SessionStore_chunks, "f")[name_2] = value;
    }
    __classPrivateFieldGet(this, _SessionStore_logger, "f").debug("CHUNKING_SESSION_COOKIE", {
        message: "Session cookie exceeds allowed ".concat(ALLOWED_COOKIE_SIZE, " bytes."),
        emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
        valueSize: cookie.value.length,
        chunks: cookies.map(function (c) { return c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE; }),
    });
    return cookies;
}, _SessionStore_clean = function _SessionStore_clean() {
    var _a;
    var cleanedChunks = {};
    for (var name_3 in __classPrivateFieldGet(this, _SessionStore_chunks, "f")) {
        (_a = __classPrivateFieldGet(this, _SessionStore_chunks, "f")) === null || _a === void 0 ? true : delete _a[name_3];
        cleanedChunks[name_3] = {
            name: name_3,
            value: "",
            options: __assign(__assign({}, __classPrivateFieldGet(this, _SessionStore_option, "f").options), { maxAge: 0 }),
        };
    }
    return cleanedChunks;
};
