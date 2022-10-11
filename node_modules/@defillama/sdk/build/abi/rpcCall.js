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
        while (_) try {
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
exports.call = void 0;
var events_1 = require("events");
var DEBUG_MODE_ENABLED = !!process.env.LLAMA_DEBUG_MODE;
var maxParallelCalls = !!process.env.LLAMA_SDK_MAX_PARALLEL ? +process.env.LLAMA_SDK_MAX_PARALLEL : 100;
var COUNTERS = {};
var emitter = new events_1.EventEmitter();
emitter.setMaxListeners(500000);
function call(provider, data, block, chain) {
    return __awaiter(this, void 0, void 0, function () {
        function onComplete() {
            counter.activeWorkers--;
            if (counter.queue.length) {
                var nextRequestId = counter.pickFromTop ? counter.queue.shift() : counter.queue.pop();
                counter.pickFromTop = !counter.pickFromTop;
                emitter.emit(nextRequestId);
            }
        }
        var counter, currentId, eventId, showEveryX, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!chain)
                        chain = 'noChain';
                    counter = getChainCounter(chain);
                    currentId = counter.requestCount++;
                    eventId = chain + "-" + currentId;
                    if (!(counter.activeWorkers > maxParallelCalls)) return [3 /*break*/, 2];
                    counter.queue.push(eventId);
                    return [4 /*yield*/, events_1.once(emitter, eventId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    counter.activeWorkers++;
                    if (DEBUG_MODE_ENABLED) {
                        showEveryX = counter.queue.length > 100 ? 50 : 10 // show log fewer times if lot more are queued up
                        ;
                        if (currentId % showEveryX === 0)
                            console.log("chain: " + chain + " request #: " + currentId + " queue: " + counter.queue.length + " active requests: " + counter.activeWorkers);
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, provider.call(data, block)];
                case 4:
                    response = _a.sent();
                    onComplete();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    onComplete();
                    throw e_1;
                case 6: return [2 /*return*/, response];
            }
        });
    });
}
exports.call = call;
function getChainCounter(chain) {
    if (!COUNTERS[chain])
        COUNTERS[chain] = {
            activeWorkers: 0,
            queue: [],
            requestCount: 0,
            pickFromTop: true,
        };
    return COUNTERS[chain];
}
