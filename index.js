const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const token = process.env.TOKEN;
const webAppIrl = 'https://stupendous-gaufre-0204bf.netlify.app'
const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())



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




app.post('/web-data', async (req, res) => {
  const { queryId, products, totalPrice } = req.body

  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка!',
      input_message_content: {
        message_text: 
        `Поздавляю с покупкой, вы приобрели товар на сумму ${totalPrice},
        ${products.map(item => item.title).join(', ')}
        `
      }
    })
    return res.status(200).json({})
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не удалось приобрести товар',
      input_message_content: {message_text: 'Не удалось приобрести товар'}
    })
    return res.status(500).json({})
  }
})

const PORT = 8000

app.listen(PORT, () => console.log('server started on PORT ' + PORT))