import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@diegoareval/jobber-shared';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');
const elasticsearchClient = new Client({ node: `${config.ELASTIC_SEARCH_URL}` });

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    const health: ClusterHealthHealthResponseBody = await elasticsearchClient.cluster.health({});
    log.info(`NotificationService health status - ${health.status}`);
    isConnected = true;
    try {
    } catch (error) {
      log.error('Connection to elasticsearch failed retrying...');
      log.log('error', 'NotificationService checkConnection() method', error);
    }
  }
}
