import { Logger } from 'winston';
import { config } from '@notifications/config';
import { winstonLogger, IEmailLocals } from '@diegoareval/jobber-shared';
import { EmailService } from '@notifications/helpers';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmails(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    // email templates
    await EmailService.sendEmail(template, receiver, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmails() method', error);
  }
}

export { sendEmails };
