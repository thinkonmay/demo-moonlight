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
exports.ConfigureDaemon = exports.CloseSession = exports.StartMoonlight = exports.StartThinkmay = exports.GetRequest = exports.WS_PORT = void 0;
var http_1 = require("@tauri-apps/api/http");
var shell_1 = require("@tauri-apps/api/shell");
// TODO /log & /info
// TODO log moonlight
// TODO api call status
// TODO loading
exports.WS_PORT = 60000;
var map = new Map();
function GetRequest(uuid) {
    return map.get(uuid).req;
}
exports.GetRequest = GetRequest;
function StartThinkmay(computer) {
    return __awaiter(this, void 0, void 0, function () {
        var client, address, turn, webrtc_config, thinkmay, display, id, req, resp, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, http_1.getClient)()];
                case 1:
                    client = _a.sent();
                    address = computer.address;
                    turn = {
                        minPort: exports.WS_PORT,
                        maxPort: 65535,
                        port: getRandomInt(exports.WS_PORT, 65535),
                        username: crypto.randomUUID(),
                        password: crypto.randomUUID(),
                    };
                    webrtc_config = {
                        iceServers: [
                            {
                                urls: "stun:".concat(address, ":").concat(turn.port)
                            }, {
                                urls: "turn:".concat(address, ":").concat(turn.port),
                                username: turn.username,
                                credential: turn.password,
                            }
                        ]
                    };
                    thinkmay = {
                        authConfig: '',
                        webrtcConfig: JSON.stringify(webrtc_config)
                    };
                    display = {
                        ScreenWidth: 1920,
                        ScreenHeight: 1080,
                    };
                    id = getRandomInt(0, 100);
                    req = {
                        id: id,
                        timestamp: new Date().toISOString(),
                        thinkmay: thinkmay,
                        turn: turn,
                        display: display
                    };
                    return [4 /*yield*/, client.post("http://".concat(address, ":").concat(exports.WS_PORT, "/new"), http_1.Body.json(req), {
                            responseType: http_1.ResponseType.Text
                        })];
                case 2:
                    resp = _a.sent();
                    if (!resp.ok)
                        throw new Error(resp.data);
                    else
                        console.log('/new request return ' + resp.data);
                    ret = crypto.randomUUID();
                    computer.rtc_config = webrtc_config;
                    map.set(ret, { req: __assign(__assign({}, req), { computer: computer }) });
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.StartThinkmay = StartThinkmay;
;
function StartMoonlight(computer, options, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var address, client, PORT, sunshine, display, id, req, resp, username, password, cmds, command, child, ret;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    address = computer.address;
                    return [4 /*yield*/, (0, http_1.getClient)()];
                case 1:
                    client = _d.sent();
                    PORT = getRandomInt(60000, 65530);
                    sunshine = {
                        username: getRandomInt(0, 9999).toString(),
                        password: getRandomInt(0, 9999).toString(),
                        port: PORT.toString()
                    };
                    display = {
                        ScreenWidth: 1920,
                        ScreenHeight: 1080,
                    };
                    id = getRandomInt(0, 100);
                    req = {
                        id: id,
                        timestamp: new Date().toISOString(),
                        sunshine: sunshine,
                        display: display
                    };
                    return [4 /*yield*/, client.post("http://".concat(address, ":").concat(exports.WS_PORT, "/new"), http_1.Body.json(req), {
                            responseType: http_1.ResponseType.Text
                        })];
                case 2:
                    resp = _d.sent();
                    if (!resp.ok)
                        throw new Error(resp.data);
                    else
                        console.log('/new request return ' + resp.data);
                    username = sunshine.username, password = sunshine.password;
                    cmds = [
                        '--address',
                        address,
                        '--port',
                        "".concat(PORT),
                        '--width',
                        "".concat((_a = options === null || options === void 0 ? void 0 : options.width) !== null && _a !== void 0 ? _a : 1920),
                        '--height',
                        "".concat((_b = options === null || options === void 0 ? void 0 : options.height) !== null && _b !== void 0 ? _b : 1080),
                        '--bitrate',
                        "".concat((_c = options === null || options === void 0 ? void 0 : options.bitrate) !== null && _c !== void 0 ? _c : 6000),
                        '--username',
                        username,
                        '--password',
                        password
                    ];
                    console.log("starting moonlight with ".concat(cmds));
                    command = new shell_1.Command('Moonlight', cmds);
                    command.stderr.addListener('data', function (data) { return callback != undefined ? callback('stderr', data) : console.log(data); });
                    command.stdout.addListener('data', function (data) { return callback != undefined ? callback('stdout', data) : console.log(data); });
                    return [4 /*yield*/, command.spawn()];
                case 3:
                    child = _d.sent();
                    ret = crypto.randomUUID();
                    map.set(ret, { child: child, req: __assign(__assign({}, req), { computer: computer }) });
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.StartMoonlight = StartMoonlight;
;
function CloseSession(uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var client, child;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, http_1.getClient)()];
                case 1:
                    client = _b.sent();
                    child = map.get(uuid);
                    if (child == undefined)
                        return [2 /*return*/, new Error('invalid uuid')];
                    return [4 /*yield*/, ((_a = child.child) === null || _a === void 0 ? void 0 : _a.kill())];
                case 2:
                    _b.sent();
                    console.log('/close request ' + child.req.id);
                    return [4 /*yield*/, client.post("http://".concat(child.req.computer.address, ":").concat(exports.WS_PORT, "/closed"), http_1.Body.json({
                            id: child.req.id
                        }), { responseType: http_1.ResponseType.Text })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, 'SUCCESS'];
            }
        });
    });
}
exports.CloseSession = CloseSession;
function ConfigureDaemon(address, reset) {
    return __awaiter(this, void 0, void 0, function () {
        var computer, client, _a, sessions, index, element;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    computer = {
                        address: address
                    };
                    console.log("configuring daemon");
                    return [4 /*yield*/, (0, http_1.getClient)()];
                case 1:
                    client = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client.post("http://".concat(address, ":").concat(exports.WS_PORT, "/initialize"), http_1.Body.json(computer), {
                            responseType: http_1.ResponseType.JSON
                        })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, client.get("http://".concat(address, ":").concat(exports.WS_PORT, "/sessions"))];
                case 6:
                    sessions = (_b.sent()).data;
                    if (!reset)
                        return [2 /*return*/, computer];
                    console.log("running sessions : ".concat(sessions.map(function (x) { return x.id; })));
                    index = 0;
                    _b.label = 7;
                case 7:
                    if (!(index < sessions.length)) return [3 /*break*/, 10];
                    element = sessions[index];
                    console.log('/close request ' + element.id);
                    return [4 /*yield*/, client.post("http://".concat(address, ":").concat(exports.WS_PORT, "/closed"), http_1.Body.json(element), { responseType: http_1.ResponseType.Text })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    index++;
                    return [3 /*break*/, 7];
                case 10: return [2 /*return*/, computer];
            }
        });
    });
}
exports.ConfigureDaemon = ConfigureDaemon;
function getRandomInt(min, max) {
    var minCeiled = Math.ceil(min);
    var maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
function JoinZeroTier(network_id) {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new shell_1.Command('ZeroTier', ['leave', network_id]).execute()];
                case 1:
                    command = _a.sent();
                    return [2 /*return*/, command.stdout + '\n' + command.stderr];
            }
        });
    });
}
function LeaveZeroTier(network_id) {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new shell_1.Command('ZeroTier', ['join', network_id]).execute()];
                case 1:
                    command = _a.sent();
                    return [2 /*return*/, command.stdout + '\n' + command.stderr];
            }
        });
    });
}
function DiscordRichPresence(app_id) {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new shell_1.Command('Daemon', ['discord', app_id]).execute()];
                case 1:
                    command = _a.sent();
                    return [2 /*return*/, command.stdout + '\n' + command.stderr];
            }
        });
    });
}
