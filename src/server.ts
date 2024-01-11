import 'express-async-errors';
import { winstonLogger } from '@diegoareval/jobber-shared';
import { Application } from 'express';
import http from 'http';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection, consumeAuthEmailMessage, consumeOrderEmailMessage } from '@notifications/queues';
import { Channel } from 'amqplib';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use(healthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const channel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessage(channel);
  await consumeOrderEmailMessage(channel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`worker with process id of ${process.pid} on notification service has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method', error);
  }
}
