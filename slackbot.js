'use strict';

const Botkit = require('botkit');
const mvn = require('./lib/mvn');
const git = require('./lib/git');
const tsm = require('./lib/tsm');
const killall = require('./lib/killall');
const rm = require('./lib/rm');
const ssh = require('./lib/ssh');

const controller = Botkit.slackbot({
    debug: false
});

const erroMsg = 'I got a error, please contact some admin to check that.';
let updating = false;

const errorOnCallBack = (bot, message, code) => {
    if (code != 0) {
        bot.reply(message, `<@${message.user}>, ${erroMsg}`);
        updating = false;
        return true;
    }
    return false;
};

controller.spawn({
    token: process.env.SLACK_API_TOKEN || '',
}).startRTM();

controller.hears(['^update qa-master$'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
    try {
        if (updating) {
            bot.reply(message, `<@${message.user}>, I'm doing it exactly now, process still running. Keep calm and drink a water.`);
            return;
        }

        bot.reply(message, `<@${message.user}> Sure.. give me few minutes I'm updating it.`);

        ssh.sshCommand(process.env.SLACK_BOT_SSH_KEY, process.env.SLACK_BOT_SSH_USER, process.env.SLACK_BOT_SSH_SERVER, 'killall java');
        updating = true;

        const { gitResult } = git.clone(process.env.SLACK_BOT_USERNAME, process.env.SLACK_BOT_PASSWORD, process.env.SLACK_BOT_USER_REPO, process.env.SLACK_BOT_PROJECT);
        if (errorOnCallBack(bot, message, gitResult.code)) return;

        const { compileResult } = mvn.run(`${gitCloneResult.folder}/${gitCloneResult.projectName}`, ['clean', 'install', '-DskipTests', '-Dsettings.offline=true']);
        if (errorOnCallBack(bot, message, compileResult.code)) return;

        rm.remove(gitCloneResult.folder);

        const { tsmResult } = tsm.runAction('qa-tag', 'deployall', process.env.SLACK_TSM_PATH);
        if (errorOnCallBack(bot, message, code)) return;

        bot.reply(message, `<@${message.user}> qa-master updated. :)`);
        updating = false;
        return;

    } catch (err) {
        console.log(err);
        updating = false;
    }
});