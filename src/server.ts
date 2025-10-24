import app from './app.js';

const PORT = Number.parseInt(process.env.PORT || '3000', 10);

app.listen({ port: PORT }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
