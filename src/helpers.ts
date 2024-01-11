import { winstonLogger, IEmailLocals } from '@diegoareval/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

class LoggerSingleton {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');
    }
    return LoggerSingleton.instance;
  }
}

class EmailTransportFactory {
  public static createTransporter(): Transporter {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });
  }
}

class EmailService {
  private static readonly log: Logger = LoggerSingleton.getInstance();

  public static async sendEmail(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
    try {
      const smtpTransport: Transporter = EmailTransportFactory.createTransporter();

      const email: Email = new Email({
        message: {
          from: `Jobber app <${config.SENDER_EMAIL}>`
        },
        send: true,
        preview: false,
        transport: smtpTransport,
        views: {
          options: {
            extension: 'ejs'
          }
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.join(__dirname, '../build')
          }
        }
      });

      await email.send({
        template: path.join(__dirname, '..', 'src/emails', template),
        message: {
          to: receiver
        },
        locals
      });
    } catch (error) {
      EmailService.log.error('NotificationService MailTransport sendEmail() method', error);
    }
  }
}

export { EmailService };
