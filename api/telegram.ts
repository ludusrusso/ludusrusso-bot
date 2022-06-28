import { createBot } from "../src/bot";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

const bot = createBot(botToken);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  console.log("called", request.query);
  if (request.query.setWebhook) {
    const path = `/api/telegram/?secret_hash=${bot.secretPathComponent()}`;
    const url = new URL(path, "https://" + whBaseUrl).href;

    bot.telegram.setWebhook(url).then(() => {
      console.log("Webhook is set!: ", url);
    });
    response.send({ status: "ok" });
  }
  if (request.query.secret_hash === bot.secretPathComponent()) {
    await bot.handleUpdate(request.body, response);
    return;
  }
}
