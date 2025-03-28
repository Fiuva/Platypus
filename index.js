const Discord = require('discord.js');
const { IntentsBitField, Collection, Client, Partials } = require('discord.js');
const { PRIVATE_CONFIG } = require('./config/constantes');
require('./keep-alive');

const myIntents = new IntentsBitField();
myIntents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.MessageContent
);

const client = new Client({
	partials: [Partials.Reaction, Partials.Message, Partials.User, Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember],
	intents: myIntents
})

client.commands = new Collection();
client.aliases = new Collection();


function requerirhandlers() {
	["command", "events", "distube", "musica"].forEach(handler => {
		try {
			require(`./handlers/${handler}`)(client, Discord)
		} catch (e) {
			console.warn(e);
		}
	})
}
requerirhandlers();
console.log(process.env)

client.login(PRIVATE_CONFIG.TOKEN);