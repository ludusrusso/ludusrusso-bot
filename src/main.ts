import { Telegraf } from "telegraf";
import fastify from "fastify";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not set");
  process.exit(1);
}
const bot = new Telegraf(botToken);

bot.start((ctx) => {
  ctx.reply("Bevenuto! Io sono @ludusrusso_bot!");
});

bot.help((ctx) => {
  ctx.reply("Sono @ludusrusso_bot, ma al momento non so fare quasi nulla!");
});

bot.command("ciao", (ctx) => {
  console.log(ctx.message);
  ctx.reply(`Ciao! ${ctx.message.from.first_name}`);
});

bot.command(["stats", "stat", "st"], (ctx) => {
  const numbers = parseStats(ctx.message.text);
  if (numbers.length === 0) {
    ctx.reply("Non mi hai passato nessun numero!");
    return;
  }
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  ctx.reply("La media è: " + mean);
  ctx.reply("La somma è: " + sum);
});

bot.on("text", (ctx) => {
  const msg = ctx.message;
  ctx.reply(`Ciao ${msg.from.first_name}, sono un bot molto stupido!`);
  ctx.reply(`Ho ricevuto questo: ${msg.text}!`);
  console.log(msg);
});

const parseStats = (msg: string) => {
  return msg
    .split(" ")
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
};

const whBaseUrl = process.env.WEBHOOK_BASE_URL;
if (whBaseUrl) {
  runWithWebhook(whBaseUrl); // dobbiamo creare questa funzione
} else {
  bot.launch();
}

function runWithWebhook(whBaseUrl: string) {
  const port = 3000;
  const app = fastify();

  const path = `/telegraf/${bot.secretPathComponent()}`;
  const url = new URL(path, whBaseUrl).href;

  bot.telegram.setWebhook(url).then(() => {
    console.log("Webhook is set!: ", url);
  });

  app.post(path, (req, rep) => bot.handleUpdate(req.body as any, rep.raw));

  app
    .listen({
      host: "0.0.0.0",
      port: 3000,
    })
    .then(() => {
      console.log("🚀 Listening on port: " + port);
    });
}
