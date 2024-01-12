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
exports.consumeOrderEmailMessage = exports.consumeAuthEmailMessage = void 0;
const config_1 = require("../config");
const jobber_shared_1 = require("@diegoareval/jobber-shared");
const queues_1 = require("../queues");
const log = (0, jobber_shared_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');
function consumeAuthEmailMessage(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, queues_1.createConnection)());
            }
            const exchangeName = 'jobber-email-notification';
            const routingKey = 'auth-email';
            const queueName = 'auth-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log('msg', JSON.parse(msg.content.toString()));
                const { template, receiverEmail, username, verifyLink, resetLink } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/pj6NFyS/2124215-essential-app-email-arrow-left-icon.png',
                    username,
                    verifyLink,
                    resetLink
                };
                yield (0, queues_1.sendEmails)(template, receiverEmail, locals);
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessage() method', error);
        }
    });
}
exports.consumeAuthEmailMessage = consumeAuthEmailMessage;
function consumeOrderEmailMessage(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, queues_1.createConnection)());
            }
            const exchangeName = 'jobber-order-notification';
            const routingKey = 'order-email';
            const queueName = 'order-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log('msg', JSON.parse(msg.content.toString()));
                const { receiverEmail, username, template, sender, offerLink, amount, buyerUsername, sellerUsername, title, description, deliveryDays, orderId, orderDue, requirements, orderUrl, originalDate, newDate, reason, subject, header, type, message, serviceFee, total } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/pj6NFyS/2124215-essential-app-email-arrow-left-icon.png',
                    username,
                    sender,
                    offerLink,
                    amount,
                    buyerUsername,
                    sellerUsername,
                    title,
                    description,
                    deliveryDays,
                    orderId,
                    orderDue,
                    requirements,
                    orderUrl,
                    originalDate,
                    newDate,
                    reason,
                    subject,
                    header,
                    type,
                    message,
                    serviceFee,
                    total
                };
                if (template === 'orderPlaced') {
                    yield (0, queues_1.sendEmails)('orderPlaced', receiverEmail, locals);
                    yield (0, queues_1.sendEmails)('orderReceipt', receiverEmail, locals);
                }
                else {
                    yield (0, queues_1.sendEmails)(template, receiverEmail, locals);
                }
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessage() method', error);
        }
    });
}
exports.consumeOrderEmailMessage = consumeOrderEmailMessage;
//# sourceMappingURL=email.consumer.js.map