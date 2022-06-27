import fastify from "fastify";

import { createBot } from "../../bot";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not set");
  process.exit(1);
}

const whBaseUrl = process.env.VERCEL_URL;
if (!whBaseUrl) {
  console.error("VERCEL_URL not set");
  process.exit(1);
}

const port = Number(process.env.PORT) || 3000;

const bot = createBot(botToken);

const app = fastify();

const path = `/telegram/${bot.secretPathComponent()}`;
const url = new URL(path, whBaseUrl).href;

bot.telegram.setWebhook(url).then(() => {
  console.log("Webhook is set!: ", url);
});

app.post(path, (req, rep) => bot.handleUpdate(req.body as any, rep.raw));

app
  .listen({
    host: "0.0.0.0",
    port: port,
  })
  .then(() => {
    console.log("🚀 Listening on port: " + port);
  });
