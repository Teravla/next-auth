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
exports.validateCSRF = exports.createCSRFToken = void 0;
var web_js_1 = require("../../../utils/web.js");
var errors_js_1 = require("../../../../errors.js");
/**
 * Ensure CSRF Token cookie is set for any subsequent requests.
 * Used as part of the strategy for mitigation for CSRF tokens.
 *
 * Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
 * where 'token' is the CSRF token and 'hash' is a hash made of the token and
 * the secret, and the two values are joined by a pipe '|'. By storing the
 * value and the hash of the value (with the secret used as a salt) we can
 * verify the cookie was set by the server and not by a malicious attacker.
 *
 * For more details, see the following OWASP links:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 * https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */
function createCSRFToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, csrfToken_1, csrfTokenHash_1, expectedCsrfTokenHash, csrfTokenVerified, csrfToken, csrfTokenHash, cookie;
        var options = _b.options, cookieValue = _b.cookieValue, isPost = _b.isPost, bodyValue = _b.bodyValue;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!cookieValue) return [3 /*break*/, 2];
                    _c = cookieValue.split("|"), csrfToken_1 = _c[0], csrfTokenHash_1 = _c[1];
                    return [4 /*yield*/, (0, web_js_1.createHash)("".concat(csrfToken_1).concat(options.secret))];
                case 1:
                    expectedCsrfTokenHash = _d.sent();
                    if (csrfTokenHash_1 === expectedCsrfTokenHash) {
                        csrfTokenVerified = isPost && csrfToken_1 === bodyValue;
                        return [2 /*return*/, { csrfTokenVerified: csrfTokenVerified, csrfToken: csrfToken_1 }];
                    }
                    _d.label = 2;
                case 2:
                    csrfToken = (0, web_js_1.randomString)(32);
                    return [4 /*yield*/, (0, web_js_1.createHash)("".concat(csrfToken).concat(options.secret))];
                case 3:
                    csrfTokenHash = _d.sent();
                    cookie = "".concat(csrfToken, "|").concat(csrfTokenHash);
                    return [2 /*return*/, { cookie: cookie, csrfToken: csrfToken }];
            }
        });
    });
}
exports.createCSRFToken = createCSRFToken;
function validateCSRF(action, verified) {
    if (verified)
        return;
    throw new errors_js_1.MissingCSRF("CSRF token was missing during an action ".concat(action));
}
exports.validateCSRF = validateCSRF;
