import nodemailer, { type Transporter } from 'nodemailer';
import { envConfig } from '../config/EnvConfig';

interface NewApplicationEmailPayload {
  readonly ownerEmail: string;
  readonly jobTitle: string;
  readonly applicantName: string;
  readonly applicantEmail: string;
  readonly appliedAt: Date;
}

export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envConfig.mailHost,
      port: envConfig.mailPort,
      secure: envConfig.mailPort === 465,
      auth: {
        user: envConfig.mailUser,
        pass: envConfig.mailPassword,
      },
    });
  }

  public async sendNewApplicationNotification(payload: NewApplicationEmailPayload): Promise<void> {
    const appliedAtText = payload.appliedAt.toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await this.transporter.sendMail({
      from: envConfig.mailUser,
      to: payload.ownerEmail,
      subject: `Lamaran baru untuk posisi ${payload.jobTitle}`,
      text: [
        `Anda menerima lamaran baru untuk posisi "${payload.jobTitle}".`,
        '',
        `Nama pelamar : ${payload.applicantName}`,
        `Email pelamar: ${payload.applicantEmail}`,
        `Tanggal lamar: ${appliedAtText}`,
      ].join('\n'),
    });
  }
}
