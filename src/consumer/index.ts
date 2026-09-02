import { Database } from '../config/Database';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { JobRepository } from '../repositories/JobRepository';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from '../services/EmailService';
import { ApplicationConsumer } from './ApplicationConsumer';

async function main(): Promise<void> {
  const database = Database.getInstance();

  const applicationRepository = new ApplicationRepository(database);
  const jobRepository = new JobRepository(database);
  const userRepository = new UserRepository(database);
  const emailService = new EmailService();

  const consumer = new ApplicationConsumer(
    applicationRepository,
    jobRepository,
    userRepository,
    emailService,
  );

  await consumer.start();
}

main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Consumer lamaran gagal berjalan:', error);
  process.exit(1);
});
