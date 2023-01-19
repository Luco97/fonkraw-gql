import { Injectable, Logger } from '@nestjs/common';
// const nodemailer = require('nodemailer');
import { Transporter, createTransport } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transport: Transporter<SentMessageInfo>;
  private readonly _logger = new Logger(MailService.name);

  constructor() {
    this.transport = createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    this.transport.verify((error, success) => {
      if (success) this._logger.log('transport init successfully');
      else if (error) this._logger.error('error on createTransport');
    });
  }

  sendMail(
    email: string,
    subject: string,
    html: string,
    logger?: string,
  ): Promise<SentMessageInfo> {
    this._logger.log(logger);
    return this.transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html: html,
    });
  }
}
