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
  try {
    if (request.query.secret === bot.secretPathComponent()) {
      return await bot.handleUpdate(request.body, response);
    }
  } catch (e) {
    console.error(e);
    response.status(500).send("Internal error");
  }
  return response.status(404).send("Not found");
}
