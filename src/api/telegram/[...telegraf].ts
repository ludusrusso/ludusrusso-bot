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

const bot = createBot(botToken);

const path = `/telegram/${bot.secretPathComponent()}`;
const url = new URL(path, whBaseUrl).href;

bot.telegram.setWebhook(url).then(() => {
  console.log("Webhook is set!: ", url);
});

export default function handler(req: any, rep: any) {
  bot.handleUpdate(req.body as any, rep.raw);
}
