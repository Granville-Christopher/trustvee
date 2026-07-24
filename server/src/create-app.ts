import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

let cachedServer: Express | null = null;

function clientDistPath() {
  // Prefer bundled public/ (Vercel + production build)
  const publicPath = join(__dirname, '..', 'public');
  if (existsSync(join(publicPath, 'index.html'))) return publicPath;

  // Local monorepo fallback: ../web/dist
  const webDist = join(__dirname, '..', '..', 'web', 'dist');
  if (existsSync(join(webDist, 'index.html'))) return webDist;

  return publicPath;
}

export async function createApp(): Promise<Express> {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
    { bodyParser: true },
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const clientPath = clientDistPath();
  if (existsSync(join(clientPath, 'index.html'))) {
    app.useStaticAssets(clientPath, { index: false });

    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      // Let real files (JS/CSS/images) 404 into next; static middleware handles them first
      if (req.path.includes('.')) return next();
      return res.sendFile(join(clientPath, 'index.html'));
    });
  }

  await app.init();
  return expressApp;
}

export async function getServer(): Promise<Express> {
  if (!cachedServer) {
    cachedServer = await createApp();
  }
  return cachedServer;
}
