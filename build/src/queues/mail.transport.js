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
exports.sendEmails = void 0;
const config_1 = require("../config");
const jobber_shared_1 = require("@diegoareval/jobber-shared");
const helpers_1 = require("../helpers");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');
function sendEmails(template, receiver, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // email templates
            yield helpers_1.EmailService.sendEmail(template, receiver, locals);
            log.info('Email sent successfully.');
        }
        catch (error) {
            log.log('error', 'NotificationService MailTransport sendEmails() method', error);
        }
    });
}
exports.sendEmails = sendEmails;
//# sourceMappingURL=mail.transport.js.map