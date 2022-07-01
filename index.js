const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "5596707678:AAHlxLxrnU01ZlJ6ZYiBBICIr45KfrqFXhc";

const bot = new TelegramApi(token, { polling: true });

const chat = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9");
  const randomNumber = Math.floor(Math.random() * 10);
  chat[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Готово! Отгадывай!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация о тебе" },
    { command: "/game", description: "Начать игру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/89b/055/89b05531-e12c-36dd-86ab-d7301005406f/4.webp"
      );
      return bot.sendMessage(chatId, "Добро пожаловать!");
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю ))");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chat[chatId]) {
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chat[chatId]}`,
        againOptions
      );
    } else {
      await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chat[chatId]}`,
        againOptions
      );
    }
  });
};

start();
