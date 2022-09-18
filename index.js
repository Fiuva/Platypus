const Discord = require('discord.js');
const { PRIVATE_CONFIG } = require('./config/constantes');
const client = new Discord.Client({
	partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	]
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


function requerirhandlers() {
	["command", "events", "distube"].forEach(handler => {
		try {
			require(`./handlers/${handler}`)(client, Discord)
		} catch (e) {
			console.warn(e);
		}
	})
}
requerirhandlers();

client.login(PRIVATE_CONFIG.TOKEN);