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
var dotenv_1 = require("dotenv"); // Importer la bibliothèque dotenv
var index_1 = require("../src/index");
var adapter_1 = require("../../utils/adapter");
var pocketbase_1 = require("pocketbase");
// Charger les variables d'environnement à partir du fichier .env
(0, dotenv_1.config)();
var pb = new pocketbase_1.default('http://127.0.0.1:8090');
var adapter = (0, index_1.pocketbaseAdapter)();
// Fonction pour supprimer toutes les données d'une table
function DeleteAllData(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var records, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, pb.collection(tableName).getList()];
                case 1:
                    records = _a.sent();
                    // Supprimer chaque enregistrement individuellement
                    return [4 /*yield*/, Promise.all(records.items.map(function (record) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, pb.collection(tableName).delete(record.id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    // Supprimer chaque enregistrement individuellement
                    _a.sent();
                    console.log("Toutes les donn\u00E9es ont \u00E9t\u00E9 supprim\u00E9es de la table '".concat(tableName, "'."));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Erreur lors de la suppression des donn\u00E9es de la table '".concat(tableName, "':"), error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function CreateCollections() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    // Créer la collection "users"
                    return [4 /*yield*/, pb.collections.create({
                            name: 'users',
                            type: 'base',
                            schema: [
                                { name: 'Id', type: 'text', required: true },
                                { name: 'username', type: 'text', required: true },
                                { name: 'name', type: 'text', required: false },
                                { name: 'email', type: 'text', required: true },
                                { name: 'avatar', type: 'text', required: false },
                                { name: 'created', type: 'text', required: true },
                                { name: 'updated', type: 'text', required: true }
                            ]
                        })];
                case 1:
                    // Créer la collection "users"
                    _a.sent();
                    // Créer la collection "accounts"
                    return [4 /*yield*/, pb.collections.create({
                            name: 'accounts',
                            type: 'base',
                            schema: [
                                { name: 'Id', type: 'text', required: true },
                                { name: 'userId', type: 'text', required: true },
                                { name: 'provider', type: 'text', required: true },
                                { name: 'providerAccountId', type: 'text', required: true },
                                { name: 'refresh_token', type: 'text', required: true },
                                { name: 'access_token', type: 'text', required: true },
                                { name: 'expires_at', type: 'text', required: true },
                                { name: 'created', type: 'text', required: true },
                                { name: 'updated', type: 'text', required: true },
                                { name: 'type', type: 'text', required: true }
                            ]
                        })];
                case 2:
                    // Créer la collection "accounts"
                    _a.sent();
                    // Créer la collection "session"
                    return [4 /*yield*/, pb.collections.create({
                            name: 'session',
                            type: 'base',
                            schema: [
                                { name: 'Id', type: 'text', required: true },
                                { name: 'userId', type: 'text', required: true },
                                { name: 'expires', type: 'text', required: true },
                                { name: 'sessionToken', type: 'text', required: true },
                                { name: 'created', type: 'text', required: true },
                                { name: 'updated', type: 'text', required: true }
                            ]
                        })];
                case 3:
                    // Créer la collection "session"
                    _a.sent();
                    // Créer la collection "token"
                    return [4 /*yield*/, pb.collections.create({
                            name: 'token',
                            type: 'base',
                            schema: [
                                { name: 'Id', type: 'text', required: true },
                                { name: 'identifier', type: 'text', required: true },
                                { name: 'token', type: 'text', required: true },
                                { name: 'expires', type: 'text', required: true },
                                { name: 'created', type: 'text', required: true },
                                { name: 'updated', type: 'text', required: true }
                            ]
                        })];
                case 4:
                    // Créer la collection "token"
                    _a.sent();
                    console.log("Collections created successfully.");
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("Error creating collections:", error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(0, adapter_1.runBasicTests)({
    adapter: (0, index_1.pocketbaseAdapter)(),
    testWebAuthnMethods: false,
    db: {
        id: function () {
            return Math.random().toString(15).substring(7);
        },
        connect: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            CreateCollections(),
                            DeleteAllData('users'),
                            DeleteAllData('accounts'),
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        disconnect: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            DeleteAllData('users'),
                            DeleteAllData('accounts'),
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        user: function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(adapter && adapter.getUser)) return [3 /*break*/, 2];
                        return [4 /*yield*/, adapter.getUser(id)];
                    case 1:
                        user = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.error("pocketbaseAdapter or adapter.getUser is not defined.");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        account: function (provider_providerAccountId) { return __awaiter(void 0, void 0, void 0, function () {
            var accountId, record, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        accountId = provider_providerAccountId.providerAccountId;
                        return [4 /*yield*/, pb.collection('accounts').getOne(accountId)];
                    case 1:
                        record = _a.sent();
                        // Retourner le record récupéré
                        return [2 /*return*/, record];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error fetching account:", error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        session: function (sessionToken) { return __awaiter(void 0, void 0, void 0, function () {
            var record, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pb.collection('session').getOne(sessionToken)];
                    case 1:
                        record = _a.sent();
                        // Retourner le record récupéré
                        return [2 /*return*/, record];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error fetching session:", error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        verificationToken: function (params) { return __awaiter(void 0, void 0, void 0, function () {
            var identifier, token, record, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identifier = params.identifier, token = params.token;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pb.collection('verificationTokens').getOne(identifier)];
                    case 2:
                        record = _a.sent();
                        // Vérifier si le record correspond au token donné
                        if (record && record.token === token) {
                            // Retourner le record récupéré
                            return [2 /*return*/, record];
                        }
                        else {
                            console.error("Verification token not found or token mismatch.");
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error fetching verification token:", error_5);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        authenticator: function (credentialID) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Code pour récupérer un authenticator
                try {
                    // Utiliser l'ID d'authentification pour récupérer l'authentificateur dans la base de données
                    return [2 /*return*/, null];
                }
                catch (error) {
                    console.error("Error fetching authenticator:", error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        }); },
    },
});
