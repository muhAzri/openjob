import { RabbitMQConnection } from '../config/RabbitMQConnection';
import { envConfig } from '../config/EnvConfig';

interface ApplicationCreatedMessage {
  readonly application_id: string;
}

export class ApplicationPublisher {
  public static async publishApplicationCreated(applicationId: string): Promise<void> {
    try {
      const channel = await RabbitMQConnection.getChannel();
      const payload: ApplicationCreatedMessage = { application_id: applicationId };
      channel.sendToQueue(envConfig.applicationsQueue, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gagal mengirim pesan lamaran baru ke RabbitMQ:', error);
    }
  }
}
