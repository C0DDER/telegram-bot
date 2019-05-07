const TelegramBot = require('node-telegram-bot-api');
const question = require("./questions.json");
const mysql = require('mysql');
const token = '852164574:AAFoFtXH7bvuUjaD5ZVRdh8SIspACxyr1PU';

var admin_chat = 211086118;

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
function accept_user (id) {
        var admin_btn = {
                reply_markup: JSON.stringify({
                        inline_keyboard: [
                                [{
                                        text: 'Разрешить доступ',
                                        callback_data: `accept_user_${id}`
                                }],
                                [{
                                        text: 'Заблокировать',
                                        callback_data: `ban_user_${id}`
                                }]
                        ]
                })
        };
        return admin_btn;
}

var connection = mysql.createConnection({
        host: 'boncreab.mysql.tools',
        user: 'boncreab_db',
        password: 'qBSjCDRD',
        database: 'boncreab_db'
});

const bot = new TelegramBot(token, {
        polling: true
});

var chat_fn = function (chatId, name, msg) {
        if (msg.text == "/start") {
                let count_query = "SELECT COUNT(*) FROM `telegram_bot` WHERE `chat_Id` = \"" + chatId + "\"";

                connection.query(count_query, function (error, results, fields) {
                        if (results[0]["COUNT(*)"] == 0) {
                                let sql_query = 'INSERT INTO `telegram_bot`(`id`, `name`, `chat_Id`, `first_q`, `second_q`, `third_q`, `fourth_q`, `fifth_q`, `is_banned`, `user_name`) VALUES ("","' + name + '","' + chatId + '","null","null","null","null","null","no", "' + msg.chat.username + '")'

                                connection.query(sql_query, function (error, results, fields) {
                                        if (error) throw error;
                                });
                        }
                })
                bot.sendMessage(chatId, name + question.hello_message);
                setTimeout(() => {
                        bot.sendMessage(chatId, question.first_question, seller_account_question)
                }, 1000);
        } else {
                var sql_query = 'UPDATE `telegram_bot` SET `third_q`= "' + msg.text + '" WHERE `chat_Id` = "' + chatId + '"'
                connection.query(sql_query, function (error, results, fields) {
                        if (error) throw error;
                });
                bot.sendMessage(chatId, question.fourth_question, money_flow);
        }
}

bot.on('message', (msg) => {
        let chatId = msg.chat.id;
        let name = msg.chat.first_name;
        let message = msg;

        var white_list = 'SELECT COUNT(*) FROM `telegram_bot` WHERE `user_name` =  "' + msg.chat.username + '" AND `is_banned` = "ban"';
        console.log(white_list);

        connection.query(white_list, function (error, results, fields) {
                if (results[0]['COUNT(*)'] != 0) {
                        bot.sendMessage(chatId, question.black_list_message);
                } else {
                        chat_fn(chatId, name, message);
                }

        })



});

bot.on("new_chat_members", function (msg) {
        console.log(msg)
})

bot.on("polling_error", function (error) {
        console.log(error)
})

bot.on('callback_query', function (msg) {
        let chatId = msg.message.chat.id;
        var is_banned_query = 'SELECT * FROM `telegram_bot` WHERE `chat_Id` = "' + chatId + '"';
        connection.query(is_banned_query, function (error, results, fields) {
                var name = results[0]['name'];
                var user_name = results[0]['user_name'];
                var exp = results[0]['second_q'];
                var strategy = results[0]['third_q'];
                var money = results[0]['fourth_q'];
                var people = results[0]['fifth_q'];
                var message = "Ура! Новая заявка на вступление в Amazon Seller Kharkov. Прочтите внимательно ответы! Спасибо) \nИмя: " + name + ": " + user_name + " \n1. Вопрос \nОтвет: Да  \n2. Вопрос \nОтвет: " + exp + " \n3.  Вопрос \nОтвет: " + strategy + " \n4. Вопрос \nОтвет: " + money + " \n5. Вопрос \nОтвет: " + people;
                if (results[0]["is_banned"] != "ban") {
                        var msg_text = msg.data.split("_");
                        id_chat = msg_text[2];
                        msg_text = `${msg_text[0]}_${msg_text[1]}`;
                        console.log(msg.data)

                        switch (msg_text) {
                                case "ban_user":
                                        if (id_chat == 437217260 || id_chat == 813428708 || id_chat == 211086118) { 
                                                var query = "SELECT COUNT(*) FROM `telegram_bot`";
                                                bot.sendMessage(chatId, "это админы"); 
                                        } else {
                                                var query = 'UPDATE `telegram_bot` SET `is_banned` = "ban" WHERE `chat_Id` = "' + id_chat + '"';  
                                                bot.sendMessage(chatId, "Пользователь заблокирован");
                                        }   
                                        console.log(query) 
                                        break;
                                case "accept_user":
                                        var query = 'UPDATE `telegram_bot` SET `is_banned` = "acess_true" WHERE `chat_Id` = "' + id_chat + '"';
                                        bot.sendMessage(chatId, "Пользователь получил приглашение");  
                                        bot.sendMessage(id_chat, "test link")  
                                        break;
                                default:
                                        switch (msg.data) {
                                                case "seller_account_yes":
                                                        var query = 'UPDATE `telegram_bot` SET `first_q`= "yes" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.second_question, trading_experience);
                                                        break;
                
                                                case "seller_account_no":
                                                        var query = 'UPDATE `telegram_bot` SET `first_q`= "no", `is_banned` = "ban" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.black_list_message);
                                                        break;
                                                case "3_month":
                                                        var query = 'UPDATE `telegram_bot` SET `second_q`= "3 месяца" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.third_question);
                                                        break;
                                                case "6_month":
                                                        var query = 'UPDATE `telegram_bot` SET `second_q`= "6 месяцев" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.third_question);
                                                        break;
                                                case "1_year":
                                                        var query = 'UPDATE `telegram_bot` SET `second_q`= "1 год" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.third_question);
                                                        break;
                                                case "2_years":
                                                        var query = 'UPDATE `telegram_bot` SET `second_q`= "2 года" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.third_question);
                                                        break;
                                                case "more_than_3_years":
                                                        var query = 'UPDATE `telegram_bot` SET `second_q`= "3 года" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.third_question);
                                                        break;
                                                case "3000":
                                                        var query = 'UPDATE `telegram_bot` SET `fourth_q`= "3000" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.fifth_question, workers_count);
                                                        break;
                                                case "5000":
                                                        var query = 'UPDATE `telegram_bot` SET `fourth_q`= "5000" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.fifth_question, workers_count);
                                                        break;
                                                case "10000":
                                                        var query = 'UPDATE `telegram_bot` SET `fourth_q`= "10000" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.fifth_question, workers_count);
                                                        break;
                                                case "20000":
                                                        var query = 'UPDATE `telegram_bot` SET `fourth_q`= "20000" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.fifth_question, workers_count);
                                                        break;
                                                case "50000":
                                                        var query = 'UPDATE `telegram_bot` SET `fourth_q`= "50000" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(chatId, question.fifth_question, workers_count);
                                                        break;
                                                case "0":
                                                        var query = 'UPDATE `telegram_bot` SET `fifth_q`= "0" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(admin_chat, message, accept_user(results[0]['chat_Id']));
                                                        ////
                                                        bot.sendMessage(chatId, question.thanks_message);
                                                        break;
                                                case "1_or_more":
                                                        var query = 'UPDATE `telegram_bot` SET `fifth_q`= "1" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(admin_chat, message);
                                                        ////
                                                        bot.sendMessage(chatId, question.thanks_message);
                                                        break;
                                                case "5_or_more":
                                                        var query = 'UPDATE `telegram_bot` SET `fifth_q`= "5" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(admin_chat, message);
                                                        ////
                                                        bot.sendMessage(chatId, question.thanks_message);
                                                        break;
                                                case "10_or_more":
                                                        var query = 'UPDATE `telegram_bot` SET `fifth_q`= "10" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(admin_chat, message);
                                                        ////
                                                        bot.sendMessage(chatId, question.thanks_message);
                                                        break;
                                                case "15_or_more":
                                                        var query = 'UPDATE `telegram_bot` SET `fifth_q`= "15" WHERE `chat_Id` = "' + chatId + '"';
                                                        bot.sendMessage(admin_chat, message);
                                                        ////
                                                        bot.sendMessage(chatId, question.thanks_message);
                                                        break;
                                                default:
                                                        bot.sendMessage(chatId, "Выбери один из предложеных вариантов");
                                                        break;
                                        }
                                        break;
                        }
                        
                        connection.query(query, function (error, results, fields) {
                                if (error) throw error;
                        });
                        console.log(query)
                } else {
                        bot.sendMessage(chatId, question.black_list_message);
                }
        });
});
