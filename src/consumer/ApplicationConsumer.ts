import type { ConsumeMessage } from 'amqplib';
import { RabbitMQConnection } from '../config/RabbitMQConnection';
import { envConfig } from '../config/EnvConfig';
import type { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { JobRepository } from '../repositories/JobRepository';
import type { UserRepository } from '../repositories/UserRepository';
import type { EmailService } from '../services/EmailService';

interface ApplicationCreatedMessage {
  readonly application_id: string;
}

export class ApplicationConsumer {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  public async start(): Promise<void> {
    const channel = await RabbitMQConnection.getChannel();
    await channel.prefetch(1);

    // eslint-disable-next-line no-console
    console.log(`Menunggu pesan pada queue "${envConfig.applicationsQueue}"...`);

    await channel.consume(envConfig.applicationsQueue, (message) => {
      if (message === null) {
        return;
      }
      this.handleMessage(message)
        .then(() => {
          channel.ack(message);
        })
        .catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.error('Gagal memproses pesan lamaran:', error);
          channel.nack(message, false, false);
        });
    });
  }

  private async handleMessage(message: ConsumeMessage): Promise<void> {
    const payload = JSON.parse(message.content.toString('utf-8')) as ApplicationCreatedMessage;

    const application = await this.applicationRepository.findById(payload.application_id);
    const job = await this.jobRepository.findById(application.job_id);
    const jobOwner = await this.userRepository.findById(job.posted_by);
    const applicant = await this.userRepository.findById(application.user_id);

    await this.emailService.sendNewApplicationNotification({
      ownerEmail: jobOwner.email,
      jobTitle: job.title,
      applicantName: applicant.name,
      applicantEmail: applicant.email,
      appliedAt: application.created_at,
    });

    // eslint-disable-next-line no-console
    console.log(
      `Email notifikasi lamaran ${application.id} terkirim ke pemilik job ${jobOwner.email}`,
    );
  }
}
