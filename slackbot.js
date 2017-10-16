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

const errorOnCallBack = (bot, message, err) => {
    if (err) {
        console.log(`[ERROR] ${JSON.stringify(err, null, 2)}`);
        bot.reply(message, `<@${message.user}>, ${erroMsg}`);
        updating = false;
        return true;
    }
    return false;
};

const gitClone = git => new Promise(cb => {
    let gitCloneResult = git.clone(process.env.SLACK_BOT_USERNAME, process.env.SLACK_BOT_PASSWORD, process.env.SLACK_BOT_USER_REPO, process.env.SLACK_BOT_PROJECT);
    
    gitCloneResult.gitResult.on('exit', (code, signal) => {
        return cb({gitCloneResult, code, signal});
    });

    gitCloneResult.gitResult.on('error', (err) => {
        return cb({err});
    });
});

const mvnBuild = (mvn, gitCloneResult) => new Promise(cb => {
    let mvnResult = mvn.run(`${gitCloneResult.folder}/${gitCloneResult.projectName}`, ['clean', 'install', '-DskipTests', '-Dsettings.offline=true'])

    mvnResult.on('exit', (code, signal) => {
        return cb({mvnResult, code, signal});
    });

    mvnResult.on('error', (err) => {
        return cb({err});
    });
});

const tsmAction = tsm => new Promise(cb => {
    let tsmResult = tsm.runAction('qa-tag', 'deployall', process.env.SLACK_TSM_PATH);

    tsmResult.on('exit', (code, signal) => {
        return cb({tsmResult, code, signal});
    });

    tsmResult.on('error', (err) => {
        return cb({err});
    });
});

controller.spawn({
    token: process.env.SLACK_API_TOKEN || '',
}).startRTM();

controller.hears(['^update qa-master$'], ['direct_message', 'direct_mention', 'mention'], async (bot, message) => {
    try {
        if (updating) {
            bot.reply(message, `<@${message.user}>, I'm doing it exactly now, process still running. Keep calm and drink a water.`);
            return;
        }

        bot.reply(message, `<@${message.user}> Sure.. give me few minutes I'm updating it.`);
        updating = true;

        const {gitCloneResult, err:errGit} = await gitClone(git);
        if (errorOnCallBack(bot, message, errGit)) return;

        const {compileResult, err:errMvn} = await mvnBuild(mvn, gitCloneResult);
        if (errorOnCallBack(bot, message, errMvn)) return;
        
        rm.remove(gitCloneResult.folder);
        ssh.sshCommand(process.env.SLACK_BOT_SSH_KEY, process.env.SLACK_BOT_SSH_USER, process.env.SLACK_BOT_SSH_SERVER, 'killall java');

        const {tsmResult, err:errTsm} = await tsmAction(tsm);
        if (errorOnCallBack(bot, message, errTsm)) return;

        bot.reply(message, `<@${message.user}> qa-master updated. :)`);
        updating = false;
    } catch (err) {
        console.log(`[ERROR] ${JSON.stringify(err, null, 2)}`);
        updating = false;
    }
}); 