module.exports = {
    name: 'addition',
    description: 'Fait une addition avec les valeurs données',
    execute(message, args) {
        const a = Number(args[0]);
        const b = Number(args[1]);

        if (isNaN(a) || isNaN(b)) {
            return message.reply('Tu dois entrer deux nombres. Exemple : `!addition 4 7`');
        }

        const somme = a + b;
        message.reply(`La somme de ${a} et ${b} est : ${somme}`);
    }
};
