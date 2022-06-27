import { createBot } from "./bot";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not set");
  process.exit(1);
}

const bot = createBot(botToken);
bot.launch().then(() => console.log("🚀 Bot launched!"));
