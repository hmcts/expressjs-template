import type { Express } from 'express';

export async function setupDev(app: Express): Promise<void> {
  const { createServer } = await import('vite');

  const vite = await createServer({
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  app.use(vite.middlewares);
}
