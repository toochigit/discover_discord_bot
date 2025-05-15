require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require('express');

// Configuration du client Discord.js
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration Express pour Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot Discord est en ligne!');
});

app.listen(port, () => {
    console.log(`Serveur web démarré sur le port ${port}`);
});

// Charger les commandes message
client.messageCommands = new Collection();
const msgCommandPath = path.join(__dirname, 'commands/message');
fs.readdirSync(msgCommandPath).forEach(file => {
    const command = require(`./commands/message/${file}`);
    client.messageCommands.set(command.name, command);
});

// Charger les commandes slash
client.slashCommands = new Collection();
const slashCommandPath = path.join(__dirname, 'commands/slash');
fs.readdirSync(slashCommandPath).forEach(file => {
    const command = require(`./commands/slash/${file}`);
    client.slashCommands.set(command.data.name, command);
});

// ⚡ Déployer les commandes slash au démarrage
const commands = [];
fs.readdirSync(slashCommandPath).forEach(file => {
    const command = require(`./commands/slash/${file}`);
    commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);

    try {
        console.log('🔄 Déploiement des commandes slash en cours...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Les commandes slash ont été déployées avec succès.');
    } catch (error) {
        console.error('❌ Une erreur est survenue lors du déploiement des commandes :', error);
    }
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
            await interaction.reply({ content: '❌ Erreur lors de l\'exécution de la commande.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);