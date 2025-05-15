require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration du serveur Express pour éviter la déconnexion sur Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot Discord est en ligne!');
});

app.listen(port, () => {
    console.log(`Serveur web démarré sur le port ${port}`);
});

// Commandes texte classiques (!ping)
client.messageCommands = new Collection();
const msgCommandPath = path.join(__dirname, 'commands/message');
fs.readdirSync(msgCommandPath).forEach(file => {
    const command = require(`./commands/message/${file}`);
    client.messageCommands.set(command.name, command);
});

// Commandes slash (/ping)
client.slashCommands = new Collection();
const slashCommandPath = path.join(__dirname, 'commands/slash');
fs.readdirSync(slashCommandPath).forEach(file => {
    const command = require(`./commands/slash/${file}`);
    client.slashCommands.set(command.data.name, command);
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);


    function keepAlive() {
        console.log("Bot ping de maintenance - " + new Date().toISOString());
    }

    // Exécuter la fonction keepAlive toutes les 5 minutes
    setInterval(keepAlive, 300000);
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith('!') || message.author.bot) return;
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.messageCommands.get(commandName);
    if (command) command.execute(message, args);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Erreur lors de l’exécution de la commande.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);