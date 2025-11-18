import dotenv from "dotenv";
import { buildApp } from "./app.js";

dotenv.config();

const app = buildApp();
const port = Number(process.env.PORT) || 3000;

try {
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`Server listening at http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
