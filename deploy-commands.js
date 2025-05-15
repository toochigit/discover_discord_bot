require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Charge tes commandes slash depuis le dossier `commands/slash`
const commands = [];
const slashCommandPath = path.join(__dirname, 'commands/slash');
const slashCommandFiles = fs.readdirSync(slashCommandPath).filter(file => file.endsWith('.js'));

// Parcourt chaque fichier de commande et l'ajoute au tableau des commandes
for (const file of slashCommandFiles) {
    const command = require(`./commands/slash/${file}`);
    commands.push(command.data.toJSON());
}

// Configuration REST avec ton Token et Client ID
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Déploiement des commandes slash en cours...');

        // Remplace "CLIENT_ID" par l'ID de ton bot (observable dans le **Portail Discord Dev**)
        // Remplace "GUILD_ID" par l'ID de ton serveur pour des déploiements test uniquement
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), // Pour les commandes globales partout
            { body: commands },
        );

        console.log('✅ Les commandes slash ont été déployées avec succès !');
    } catch (error) {
        console.error('❌ Une erreur est survenue lors du déploiement des commandes :', error);
    }
})();