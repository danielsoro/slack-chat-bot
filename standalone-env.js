const exec = require('./lib/exec');
const ssh = require('./lib/ssh');

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

const execCommand = exec => new Promise(cb => {
    let execCommandResult = exec.run('./ec2EnvBuilder-snaptshot.sh', ['all'], process.env.SLACK_BOT_STANDALONE_PATH);
    return cb(execCommandResult);
});

module.exports.main = async (bot, message) => {
    try {
        if (updating) {
            bot.reply(message, `<@${message.user}>, I'm doing it exactly now, process still running. Keep calm and drink a water.`);
            return;
        }

        bot.reply(message, `<@${message.user}> Sure.. give me few minutes I'm updating it.`);
        updating = true;

        ssh.sshCommand(process.env.SLACK_BOT_SSH_KEY,
            process.env.SLACK_BOT_SSH_USER,
            process.env.SLACK_BOT_STANDALONE_SERVER,
            'killall java');

        const execCommandResult = await execCommand(exec);
        if (errorOnCallBack(bot, message, execCommandResult.err)) return;

        bot.reply(message, `<@${message.user}> standalone env updated. :)`);
        updating = false;
    } catch (err) {
        console.log(`[ERROR] ${JSON.stringify(err, null, 2)}`);
        updating = false;
    }
}