module.exports = {
    name: 'ping',
    description: 'Répond "Pong!" en message texte',
    execute(message, args) {
        message.reply('Pong!');
    }
};
