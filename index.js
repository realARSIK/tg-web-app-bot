const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const token = process.env.TOKEN;
const webAppIrl = 'https://stupendous-gaufre-0204bf.netlify.app'
const bot = new TelegramBot(token, {polling: true});


console.log('TOKEN доступа к боту:', process.env.TOKEN);

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Добро Пожаловать!', {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Сделать заказ', web_app: {url: webAppIrl}}]
        ],
      }
    });

    await bot.sendMessage(chatId, 'Ниже появиться кнопка, заполните форму', {
      reply_markup: {
        keyboard: [
          [{text: 'Заполнить форму', web_app: {url: webAppIrl + '/form'}}]
        ]
      }
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)

      await bot.sendMessage(chatId, 'Всю информацию вы получите через несколько секунд')

      setTimeout(async () => {
        await bot.sendMessage(chatId,`
          Спасибо за обратную связь!
          Ваша страна: ${data?.country}
          Ваш город: ${data?.city}
          Ваша операционная система: ${data?.os}
        `)
      }, 2000)
    } catch (e) {
      console.log("Ошибка: ", e);
    }
  }
});