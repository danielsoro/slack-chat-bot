'use strict';

const Botkit = require('botkit');
const compileObject = require('./compile');
const gitObject = require('./git');
const tsm = require('./tsm');
const killall = require('./killall');

const controller = Botkit.slackbot({
    debug: false
});

const erroMsg = 'I got a error, please contact some admin to check that.';
let updating = false;

controller.spawn({
    token: process.env.SLACK_API_TOKEN || '',
}).startRTM();

controller.hears(['^update qa-master$'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {

    if (updating) {
        bot.reply(message, `<@${message.user}>, I'm doing it exactly now, process still running. Keep calm and drink a water.`)
        return;
    }

    bot.reply(message, `<@${message.user}> Sure.. give me few minutes I'm updating it.`);
    
    killall.kill('java');
    updating = true;

    let gitCloneResult = gitObject.clone('danielsoro', 'dynamic-inject');

    gitCloneResult.gitResult.on('exit', (code, signal) => {
        if (code != 0) {
            bot.reply(message, `<@${message.user}>, ${erroMsg}`);
            updating = false;
            return;
        }

        let compileResult = compileObject.compile(`${gitCloneResult.folder}/${gitCloneResult.projectName}`, ['clean', 'install', '-DskipTests', '-Dsettings.offline=true']);
        
        compileResult.on('exit', (code, signal) => {
            if (code != 0) {
                bot.reply(message, `<@${message.user}>, ${erroMsg}`);
                updating = false;
                return;
            }

            bot.reply(message, `<@${message.user}> qa-master updated. :)`);
            updating = false;
            return;
        });
    });
});