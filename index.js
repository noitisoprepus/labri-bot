const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, GuildMember } = require('discord.js');
const { token } = require('./config.json');

// Specific to our own discord server
const bas2sWords = require('./bas2s-words.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Bas2s Police
client.on(Events.MessageCreate, async message => {
	// if (!message.member.moderatable) return;
	try {
		const kabas2san = [];

		// index.js needs to be restarted for changes in bas2sWords to take place
		for (const word in bas2sWords) {
			if (message.content.toLowerCase().includes(word)) {
				kabas2san.push(word);
			}
		}

		// Unnecessary stuff, pangpaganda lang ng output
		if (kabas2san.length == 0) return;
		else if (kabas2san.length > 1) message.reply(bas2sWords['*bastos']);
		else message.reply(bas2sWords[kabas2san[0]]);
	}
	catch (error) {
		console.error(error);
		await message.reply({ content: 'Nag-error ako, pero wag ka bastos!', ephemeral: true });
	}
});

client.login(token);
