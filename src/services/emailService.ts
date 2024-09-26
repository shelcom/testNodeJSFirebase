import ApiError from 'errors/ApiError';
import strings from 'strings';
import {injectable} from 'tsyringe';
import Nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@injectable()
class EmailService {
  private transporter: Nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.configure();
  }

  private configure = () => {
    this.transporter = Nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  };

  sendForgetPasswordMail = async (email: string, link: string) => {
    await this.sendMail(
      email,
      strings.mail.forgetPasswordSubject,
      strings.mail.forgetPasswordText(link),
    );
  };

  private sendMail = async (to: string, subject: string, text: string) => {
    let mailOptions = {
      from: process.env.MAIL_LOGIN,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  };
}

export default EmailService;
