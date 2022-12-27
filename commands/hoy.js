const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hoy')
		.setDescription('Replies with Hoy ka rin!'),
	async execute(interaction) {
		await interaction.reply('Hoy ka rin!');
	},
};
