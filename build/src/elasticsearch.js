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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const jobber_shared_1 = require("@diegoareval/jobber-shared");
const config_1 = require("./config");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');
const elasticsearchClient = new elasticsearch_1.Client({ node: `${config_1.config.ELASTIC_SEARCH_URL}` });
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let isConnected = false;
        while (!isConnected) {
            const health = yield elasticsearchClient.cluster.health({});
            log.info(`NotificationService health status - ${health.status}`);
            isConnected = true;
            try {
            }
            catch (error) {
                log.error('Connection to elasticsearch failed retrying...');
                log.log('error', 'NotificationService checkConnection() method', error);
            }
        }
    });
}
exports.checkConnection = checkConnection;
//# sourceMappingURL=elasticsearch.js.map