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

const errorOnCallBack = (bot, message, code, func = () => {}) => {
    func();
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

    if (updating) {
        bot.reply(message, `<@${message.user}>, I'm doing it exactly now, process still running. Keep calm and drink a water.`);
        return;
    }

    bot.reply(message, `<@${message.user}> Sure.. give me few minutes I'm updating it.`);
    
    killall.kill('java');
    ssh.sshCommand(process.env.SLACK_BOT_SSH_KEY, process.env.SLACK_BOT_SSH_USER, process.env.SLACK_BOT_SSH_SERVER, 'killall java');
    updating = true;

    let gitCloneResult = git.clone(process.env.SLACK_BOT_USERNAME, process.env.SLACK_BOT_PASSWORD, process.env.SLACK_BOT_USER_REPO, process.env.SLACK_BOT_PROJECT);

    gitCloneResult.gitResult.on('exit', (code, signal) => {
        if (errorOnCallBack(bot, message, code)) return;

        let compileResult = mvn.run(`${gitCloneResult.folder}/${gitCloneResult.projectName}`, ['clean', 'install', '-DskipTests', '-Dsettings.offline=true']);
        
        compileResult.on('exit', (code, signal) => {
            if (errorOnCallBack(bot, message, code, rm.remove(gitCloneResult.folder))) return;

            bot.reply(message, `<@${message.user}> qa-master updated. :)`);
            updating = false;
            return;

            let tsmResult = tsm.runAction('qa-tag', 'deployAll', process.env.SLACK_TSM_PATH);
            tsmResult.on('exit', (code, signal) => {
                if (errorOnCallBack(bot, message, code)) return;
            });
        });
    });
});