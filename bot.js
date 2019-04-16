process.env["NTBA_FIX_319"] = 1;
const telegramBot = require('node-telegram-bot-api');
const fs = require("fs");
const editJsonFile = require("edit-json-file");
const token = '852164574:AAFoFtXH7bvuUjaD5ZVRdh8SIspACxyr1PU';

const first_message = ", что бы попасть в сообщество, ответь всего на 5 вопросов!"

var money_flow = {
        reply_markup: JSON.stringify({
                inline_keyboard: [
                        [{
                                text: 'от 3 000$',
                                callback_data: '3000'
                        }],
                        [{
                                text: 'от 5 000$',
                                callback_data: '5000'
                        }],
                        [{
                                text: 'от 10 000$',
                                callback_data: '10000'
                        }],
                        [{
                                text: 'от 20 000$',
                                callback_data: '20000'
                        }],
                        [{
                                text: 'от 50 000$',
                                callback_data: '50000'
                        }]
                ]
        })
};

var seller_account_question = {
        reply_markup: JSON.stringify({
                inline_keyboard: [
                        [{
                                text: 'Да',
                                callback_data: 'seller_account_yes'
                        }],
                        [{
                                text: 'Нет',
                                callback_data: 'seller_account_no'
                        }]
                ]
        })
};

let amazon_user = {
        chatId: "chat_id",
        name: 'name',
        first_query: "seller_account",
        second_query: "experience",
        third_query: "strategy",
        forth_query: "money_flow",
        fifth_query: "peoples_count"
};

const bot = new telegramBot(token, {
        polling: true
});




bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const chat_json = chatId + ".json";
        amazon_user.name = msg.chat.first_name;
        amazon_user.chatId = chatId;
        if (msg.text == "/start") {
                if (!fs.existsSync(chat_json)) {
                        let data = JSON.stringify(amazon_user)
                        fs.writeFile(chat_json, data, function (err) {
                                console.log('Saved!');
                        });
                }


                bot.sendMessage(chatId, msg.chat.first_name + first_message);
                setTimeout(() => {
                        bot.sendMessage(chatId, "Ты владелец Seller аккаунта?", seller_account_question)
                }, 1000);
                fs.closeSync()
        } else {
                fs.readFile(chat_json, (err, data) => {
                        console.log(JSON.parse(data))
                })
                fs.closeSync()
                bot.sendMessage(chatId, msg.text, money_flow);
        }
        bot.sendMessage(chatId, msg.text);
});

bot.on("polling_error", (msg) => console.log(""));

bot.on('callback_query', function (msg) {
        let chat_json = msg.message.chat.id + ".json";
        let file = editJsonFile(chat_json);

        switch (msg.data) {
                case "seller_account_yes" :
                        file.set("first_query", "yes");
                        break;
                case "seller_account_no" :
                        file.set("first_query", "no");
                        break;
                default:
                        break;
        }
        console.log("chat id : " + msg.message.chat.id)
        console.log(msg.data)
});