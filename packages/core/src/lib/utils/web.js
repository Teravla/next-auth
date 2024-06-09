"use strict";
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
exports.parseActionAndProviderId = exports.randomString = exports.createHash = exports.toResponse = exports.toRequest = exports.toInternalRequest = void 0;
var cookie_1 = require("cookie");
var errors_js_1 = require("../../errors.js");
var logger_js_1 = require("./logger.js");
var actions_js_1 = require("./actions.js");
function getBody(req) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType, params, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("body" in req) || !req.body || req.method !== "POST")
                        return [2 /*return*/];
                    contentType = req.headers.get("content-type");
                    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json"))) return [3 /*break*/, 2];
                    return [4 /*yield*/, req.json()];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/x-www-form-urlencoded"))) return [3 /*break*/, 4];
                    _a = URLSearchParams.bind;
                    return [4 /*yield*/, req.text()];
                case 3:
                    params = new (_a.apply(URLSearchParams, [void 0, _b.sent()]))();
                    return [2 /*return*/, Object.fromEntries(params)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function toInternalRequest(req, config) {
    return __awaiter(this, void 0, void 0, function () {
        var url, _a, action, providerId, _b, e_1;
        var _c;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 4, , 5]);
                    if (req.method !== "GET" && req.method !== "POST")
                        throw new errors_js_1.UnknownAction("Only GET and POST requests are supported.");
                    // Defaults are usually set in the `init` function, but this is needed below
                    (_d = config.basePath) !== null && _d !== void 0 ? _d : (config.basePath = "/auth");
                    url = new URL(req.url);
                    _a = parseActionAndProviderId(url.pathname, config.basePath), action = _a.action, providerId = _a.providerId;
                    _c = {
                        url: url,
                        action: action,
                        providerId: providerId,
                        method: req.method,
                        headers: Object.fromEntries(req.headers)
                    };
                    if (!req.body) return [3 /*break*/, 2];
                    return [4 /*yield*/, getBody(req)];
                case 1:
                    _b = _h.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _b = undefined;
                    _h.label = 3;
                case 3: return [2 /*return*/, (_c.body = _b,
                        _c.cookies = (_f = (0, cookie_1.parse)((_e = req.headers.get("cookie")) !== null && _e !== void 0 ? _e : "")) !== null && _f !== void 0 ? _f : {},
                        _c.error = (_g = url.searchParams.get("error")) !== null && _g !== void 0 ? _g : undefined,
                        _c.query = Object.fromEntries(url.searchParams),
                        _c)];
                case 4:
                    e_1 = _h.sent();
                    logger_js_1.logger.error(e_1);
                    logger_js_1.logger.debug("request", req);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.toInternalRequest = toInternalRequest;
function toRequest(request) {
    var _a;
    return new Request(request.url, {
        headers: request.headers,
        method: request.method,
        body: request.method === "POST"
            ? JSON.stringify((_a = request.body) !== null && _a !== void 0 ? _a : {})
            : undefined,
    });
}
exports.toRequest = toRequest;
function toResponse(res) {
    var _a, _b;
    var headers = new Headers(res.headers);
    (_a = res.cookies) === null || _a === void 0 ? void 0 : _a.forEach(function (cookie) {
        var name = cookie.name, value = cookie.value, options = cookie.options;
        var cookieHeader = (0, cookie_1.serialize)(name, value, options);
        if (headers.has("Set-Cookie"))
            headers.append("Set-Cookie", cookieHeader);
        else
            headers.set("Set-Cookie", cookieHeader);
    });
    var body = res.body;
    if (headers.get("content-type") === "application/json")
        body = JSON.stringify(res.body);
    else if (headers.get("content-type") === "application/x-www-form-urlencoded")
        body = new URLSearchParams(res.body).toString();
    var status = res.redirect ? 302 : (_b = res.status) !== null && _b !== void 0 ? _b : 200;
    var response = new Response(body, { headers: headers, status: status });
    if (res.redirect)
        response.headers.set("Location", res.redirect);
    return response;
}
exports.toResponse = toResponse;
/** Web compatible method to create a hash, using SHA256 */
function createHash(message) {
    return __awaiter(this, void 0, void 0, function () {
        var data, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = new TextEncoder().encode(message);
                    return [4 /*yield*/, crypto.subtle.digest("SHA-256", data)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, Array.from(new Uint8Array(hash))
                            .map(function (b) { return b.toString(16).padStart(2, "0"); })
                            .join("")
                            .toString()];
            }
        });
    });
}
exports.createHash = createHash;
/** Web compatible method to create a random string of a given length */
function randomString(size) {
    var i2hex = function (i) { return ("0" + i.toString(16)).slice(-2); };
    var r = function (a, i) { return a + i2hex(i); };
    var bytes = crypto.getRandomValues(new Uint8Array(size));
    return Array.from(bytes).reduce(r, "");
}
exports.randomString = randomString;
/** @internal Parse the action and provider id from a URL pathname. */
function parseActionAndProviderId(pathname, base) {
    var a = pathname.match(new RegExp("^".concat(base, "(.+)")));
    if (a === null)
        throw new errors_js_1.UnknownAction("Cannot parse action at ".concat(pathname));
    var actionAndProviderId = a.at(-1);
    var b = actionAndProviderId.replace(/^\//, "").split("/").filter(Boolean);
    if (b.length !== 1 && b.length !== 2)
        throw new errors_js_1.UnknownAction("Cannot parse action at ".concat(pathname));
    var action = b[0], providerId = b[1];
    if (!(0, actions_js_1.isAuthAction)(action))
        throw new errors_js_1.UnknownAction("Cannot parse action at ".concat(pathname));
    if (providerId &&
        !["signin", "callback", "webauthn-options"].includes(action))
        throw new errors_js_1.UnknownAction("Cannot parse action at ".concat(pathname));
    return { action: action, providerId: providerId };
}
exports.parseActionAndProviderId = parseActionAndProviderId;
