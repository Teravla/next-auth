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
var nodemailer_1 = require("nodemailer");
var email_js_1 = require("../lib/utils/email.js");
var errors_js_1 = require("../errors.js");
function Nodemailer(config) {
    if (!config.server)
        throw new errors_js_1.AuthError("Nodemailer requires a `server` configuration");
    return {
        id: "nodemailer",
        type: "email",
        name: "Nodemailer",
        server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
        from: "Auth.js <no-reply@authjs.dev>",
        maxAge: 24 * 60 * 60,
        sendVerificationRequest: function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var identifier, url, provider, theme, host, transport, result, failed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            identifier = params.identifier, url = params.url, provider = params.provider, theme = params.theme;
                            host = new URL(url).host;
                            transport = (0, nodemailer_1.createTransport)(provider.server);
                            return [4 /*yield*/, transport.sendMail({
                                    to: identifier,
                                    from: provider.from,
                                    subject: "Sign in to ".concat(host),
                                    text: (0, email_js_1.text)({ url: url, host: host }),
                                    html: (0, email_js_1.html)({ url: url, host: host, theme: theme }),
                                })];
                        case 1:
                            result = _a.sent();
                            failed = result.rejected.concat(result.pending).filter(Boolean);
                            if (failed.length) {
                                throw new Error("Email (".concat(failed.join(", "), ") could not be sent"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        options: config,
    };
}
exports.default = Nodemailer;
