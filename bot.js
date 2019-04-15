const TelegramBot = require('node-telegram-bot-api');

const token = '852164574:AAFoFtXH7bvuUjaD5ZVRdh8SIspACxyr1PU';

var options = {
        reply_markup: JSON.stringify({
                inline_keyboard: [
                        [{
                                text: 'Кнопка 1',
                                callback_data: '1'
                        }],
                        [{
                                text: 'Кнопка 2',
                                callback_data: 'data 2'
                        }],
                        [{
                                text: 'Кнопка 3',
                                callback_data: 'text 3'
                        }]
                ]
        })
};

const bot = new TelegramBot(token, {
        polling: true
});
bot.onText(/\/echo (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const resp = match[1];
        bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        console.log(chatId)

        bot.sendMessage(chatId, msg.text, options);
});