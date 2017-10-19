'use strict';

const Botkit = require('botkit');
const main = require('./main');

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: process.env.SLACK_API_TOKEN || '',
}).startRTM();


controller.hears(['^update qa-master$'], ['direct_message', 'direct_mention', 'mention'], async (bot, message) => {
    main.main(bot, message); 
}); 