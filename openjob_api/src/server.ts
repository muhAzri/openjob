import { App } from './app/App';
import { RedisClient } from './config/RedisClient';

async function bootstrap(): Promise<void> {
  await RedisClient.connect().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Gagal terhubung ke Redis:', error);
  });

  const app = new App();
  app.listen();
}

void bootstrap();
