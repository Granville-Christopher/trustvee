import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServer } from '../server/dist/create-app.js';

/**
 * Single Vercel Serverless Function for the whole Trustvee app
 * (Nest API + React frontend).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getServer();
  return server(req, res);
}
