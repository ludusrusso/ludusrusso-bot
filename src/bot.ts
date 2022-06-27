import { Telegraf } from "telegraf";

export const createBot = (token: string): Telegraf => {
  const bot = new Telegraf(token);

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
  });
  return bot;
};

const parseStats = (msg: string) => {
  return msg
    .split(" ")
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
};
