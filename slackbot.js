'use strict';

const Botkit = require('botkit');
const qa = require('./qa-env');
const standalone = require('./standalone-env');

const controller = Botkit.slackbot({
    debug: false
});

controller.spawn({
    token: process.env.SLACK_API_TOKEN || '',
}).startRTM();


controller.hears(['^update qa-master$'], ['direct_message', 'direct_mention', 'mention'], async (bot, message) => {
    qa.main(bot, message); 
}); 

controller.hears(['^update standalone-env$'], ['direct_message', 'direct_mention', 'mention'], async (bot, message) => {
    standalone.main(bot, message);
}); 