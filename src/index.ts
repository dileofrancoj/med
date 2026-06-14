import express from 'express';
import { config } from './utils/config';
import potassiumRoutes from './routes/potassium_routes';
import sodiumRoutes from './routes/sodium_routes';
import { corsMiddleware } from './http/cors';

const app = express();

app.use(express.json());

app.use(corsMiddleware)

// Register medical calculation routes
app.use('/api', potassiumRoutes);
app.use('/api', sodiumRoutes);

app.get('/health', (_, res) => {
  res.json({ status: 'UP', env: config.env });
});

let server;
if (!process.env.VERCEL) {
  server = app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
}

export { app, server };
export default app;
