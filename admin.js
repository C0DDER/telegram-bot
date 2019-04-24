const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql');
const token = '891088156:AAHBfA6Lig56LHT_Doof0S3VHfF9fZwgHdY';

const bot = new TelegramBot(token, {
        polling: true
});

var connection = mysql.createConnection({
        host: 'boncreab.mysql.tools',
        user: 'boncreab_db',
        password: 'qBSjCDRD',
        database: 'boncreab_db'
});

bot.on("new_chat_members", function (msg) {
        var username = msg.new_chat_members[0]["username"];
        var white_list = 'SELECT COUNT(*) FROM `telegram_bot` WHERE `user_name` =  "' + username + '" AND `is_banned` = "acess_true"';
        console.log(white_list);
        
        connection.query(white_list, function (error, results, fields) {

                console.log(results[0]['COUNT(*)']);
                if (results[0]['COUNT(*)'] == 0) {
                        bot.kickChatMember(msg.chat.id, msg.new_chat_member.id)
                }        
                
        })
})

bot.on("polling_error", function (error) {
        console.log(error)
})