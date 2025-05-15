const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function registerGlobalCommands(clientId, token) {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands/slash');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/slash/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        await rest.put(
            Routes.applicationCommands(clientId), // 🔥 GLOBAL
            { body: commands }
        );
        console.log('Slash commands enregistrées globalement (visible dans tous les serveurs dans ~1h)');
    } catch (error) {
        console.error('Erreur en enregistrant les commandes globales :', error);
    }
}

module.exports = { registerGlobalCommands };
