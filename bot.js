const telegramBot       = require('node-telegram-bot-api');
const fs                = require("fs");
const mysql             = require('mysql');
const question          = require("./questions.json");
// const editJsonFile      = require("edit-json-file");

const token             = '852164574:AAFoFtXH7bvuUjaD5ZVRdh8SIspACxyr1PU';
// 813428708 admin

var connection = mysql.createConnection({
        host     : 'boncreab.mysql.tools',
        user     : 'boncreab_db',
        password : 'qBSjCDRD',
        database : 'boncreab_db'
});

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
console.log("bot is running");

var workers_count = {
        reply_markup: JSON.stringify({
                inline_keyboard: [
                        [{
                                text: 'нет сотрудников',
                                callback_data: '0'
                        }],
                        [{
                                text: 'более 1 чел.',
                                callback_data: '1_or_more'
                        }],
                        [{
                                text: 'более 5 чел.',
                                callback_data: '5_or_more'
                        }],
                        [{
                                text: 'более 10 чел.',
                                callback_data: '10_or_more'
                        }],
                        [{
                                text: 'более 15 чел.',
                                callback_data: '15_or_more'
                        }]
                ]
        })
};


var trading_experience = {
        reply_markup: JSON.stringify({
                inline_keyboard: [
                        [{
                                text: 'от 3 месяцев',
                                callback_data: '3_month'
                        }],
                        [{
                                text: 'от 6 месяцев',
                                callback_data: '6_month'
                        }],
                        [{
                                text: 'от 1-го года',
                                callback_data: '1_year'
                        }],
                        [{
                                text: 'от 2-х лет',
                                callback_data: '2_years'
                        }],
                        [{
                                text: 'более 3-х лет',
                                callback_data: 'more_than_3_years'
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

// let amazon_user = {
//         chatId: "chat_id",
//         name: 'name',
//         first_query: "seller_account",
//         second_query: "experience",
//         third_query: "strategy",
//         forth_query: "money_flow",
//         fifth_query: "peoples_count",
//         black_list : false
// };

const bot = new telegramBot(token, {
        polling: true
});


bot.on('message', (msg) => {
        connection.connect();
        const chatId = msg.chat.id;
        const chat_json = "user_data/" + chatId + ".json";
        amazon_user_name = msg.chat.first_name;
        amazon_user_chatId = chatId;
        if (msg.text == "/start") {
                let sql_query = 'INSERT INTO `telegram_bot`(`id`, `name`, `chat_Id`, `first_q`, `second_q`, `third_q`, `fourth_q`, `fifth_q`, `is_banned`) VALUES ("","' + amazon_user_name + '","' + amazon_user_chatId + '","null","null","null","null","null","null")'
                connection.query(sql_query, function (error, results, fields) {
                        console.log('The solution is: ', results);
                });

                bot.sendMessage(chatId, msg.chat.first_name + question.hello_message);
                setTimeout(() => {
                        bot.sendMessage(chatId, question.first_question, seller_account_question)
                }, 1000);
        } else {
                bot.sendMessage(chatId, question.fourth_question, money_flow);
        }
        
        log = "\nchatId : " + chatId + " | user_name : " + msg.chat.first_name + " | message : " + msg.text + " | date : " + Date.now();
        fs.appendFile("log.txt", log, function (err) {
                console.log('Saved!');
        });
        connection.end();
        fs.closeSync()
});

bot.on("polling_error", (msg) => console.log(""));

bot.on('callback_query', function (msg) {
        let chatId = msg.message.chat.id;
        let chat_json = "user_data/" + msg.message.chat.id + ".json";
        let file = editJsonFile(chat_json);
        let is_banned = file.data.black_list; 
        
        if (!is_banned) {
                switch (msg.data) {
                        case "seller_account_yes" :
                                file.set("first_query", "yes");
                                bot.sendMessage(chatId, question.second_question, trading_experience);
                                break;
                                
                        case "seller_account_no" :
                                file.set("first_query", "no");
                                file.set("black_list", true)
                                bot.sendMessage(chatId, question.black_list_message);
                                break;
                        case "3_month" :
                                file.set("second_query", msg.data);
                                bot.sendMessage(chatId, question.third_question);
                                break;
                        case "6_month" :
                                file.set("second_query", msg.data);
                                bot.sendMessage(chatId, question.third_question);
                                break;
                        case "1_year" :
                                file.set("second_query", msg.data);
                                bot.sendMessage(chatId, question.third_question);
                                break;
                        case "2_years" :
                                file.set("second_query", msg.data);
                                bot.sendMessage(chatId, question.third_question);
                                break;
                        case "more_than_3_years" :
                                file.set("second_query", msg.data);
                                bot.sendMessage(chatId, question.third_question);
                                break;
                        case "3000" :
                                file.set("forth_query", msg.data);
                                bot.sendMessage(chatId, question.fifth_question, workers_count);
                                break;
                        case "5000" :
                                file.set("forth_query", msg.data);
                                bot.sendMessage(chatId, question.fifth_question, workers_count);
                                break;
                        case "10000" :
                                file.set("forth_query", msg.data);
                                bot.sendMessage(chatId, question.fifth_question, workers_count);
                                break;
                        case "20000" :
                                file.set("forth_query", msg.data);
                                bot.sendMessage(chatId, question.fifth_question, workers_count);
                                break;
                        case "50000" :
                                file.set("forth_query", msg.data);
                                bot.sendMessage(chatId, question.fifth_question, workers_count);
                                break;
                        case "0" :
                                file.set("fifth_query", msg.data);
                                bot.sendMessage(chatId, question.thanks_message);
                                break;
                        case "1_or_more" :
                                file.set("fifth_query", msg.data);
                                bot.sendMessage(chatId, question.thanks_message);
                                break;
                        case "5_or_more" :
                                file.set("fifth_query", msg.data);
                                bot.sendMessage(chatId, question.thanks_message);
                                break;
                        case "10_or_more" :
                                file.set("fifth_query", msg.data);
                                bot.sendMessage(chatId, question.thanks_message);
                                break;
                        case "15_or_more" :
                                file.set("fifth_query", msg.data);
                                bot.sendMessage(chatId, question.thanks_message);
                                break;
                        default:
                                bot.sendMessage(chatId, "Выбери один из предложеных вариантов");
                                break;
                }
        } else {
                bot.sendMessage(chatId, "тебя забанили, иди нахуй");
        }
        file.save();
        console.log(msg.data);
});