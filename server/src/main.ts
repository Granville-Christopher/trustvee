import { getServer } from './create-app';

async function bootstrap() {
  const server = await getServer();
  const port = Number(process.env.PORT ?? 3000);

  server.listen(port, () => {
    console.log(`Trustvee running on http://localhost:${port}`);
    console.log(`API: http://localhost:${port}/api`);
  });
}

bootstrap();
