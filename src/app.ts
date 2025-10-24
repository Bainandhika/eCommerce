import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({
  logger: true,
});

app.get('/', async (request, reply) => {
  return { message: 'Hello World' };
});

export default app;
