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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
require("express-async-errors");
const jobber_shared_1 = require("@diegoareval/jobber-shared");
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const elasticsearch_1 = require("./elasticsearch");
const queues_1 = require("./queues");
const SERVER_PORT = 4001;
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');
function start(app) {
    startServer(app);
    app.use(routes_1.healthRoutes);
    startQueues();
    startElasticSearch();
}
exports.start = start;
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = yield (0, queues_1.createConnection)();
        yield (0, queues_1.consumeAuthEmailMessage)(channel);
        yield (0, queues_1.consumeOrderEmailMessage)(channel);
    });
}
function startElasticSearch() {
    (0, elasticsearch_1.checkConnection)();
}
function startServer(app) {
    try {
        const httpServer = new http_1.default.Server(app);
        log.info(`worker with process id of ${process.pid} on notification service has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification service running on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        log.log('error', 'NotificationService startServer() method', error);
    }
}
//# sourceMappingURL=server.js.map