const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addition')
        .setDescription('Fait une addition entre deux nombres')
        .addNumberOption(option => option.setName('nombre1').setDescription('Premier nombre').setRequired(true))
        .addNumberOption(option => option.setName('nombre2').setDescription('Deuxieme nombre').setRequired(true)),

    async execute(interaction) {
        const a = interaction.options.getNumber('nombre1');
        const b = interaction.options.getNumber('nombre2');
        const somme = a + b;

        await interaction.reply(`La somme de ${a} et ${b} est : ${somme}`);
    }
};