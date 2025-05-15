module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles',
    execute(message, args) {
        const commands = message.client.messageCommands;

        if (args.length) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName)

            if (!command) {
                return message.reply("Cette commande n'existe pas !");
            }

            let helpText = `**!${command.name}** : ${command.description || 'Aucune description disponible'}\n`;

            if (command.usage) {
                helpText += `\nUtilisation : \`${command.name} ${command.usage}\``;
            }

            return message.channel.send(helpText);
        }

        const helpEmbed = {
            color: 0x0099ff,
            title: 'Liste des commandes',
            description: 'Voici la liste des commandes disponibles : ',
            fields: []
        };

        commands.forEach(command => {
            helpEmbed.fields.push({
                name: `!${command.name}`,
                value: command.description || 'Aucune description disponible',
                inlign: true
            });
        });

        helpEmbed.footer = {
            text: 'Pour plus d\'informations, utilisez !help <nom de la commande>'
        };

        message.channel.send({ embeds: [helpEmbed] });
    }
}