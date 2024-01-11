import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import { consumeAuthEmailMessage } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@diegoareval/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessage method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeAuthEmailMessage(connectionChannel!);
    });
  });
});
