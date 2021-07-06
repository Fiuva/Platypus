const AntiSpam = require('discord-anti-spam');
const antiSpam = () => {
	return new AntiSpam({
		warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
		muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
		kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
		banThreshold: 8, // Amount of messages sent in a row that will cause a ban.
		maxInterval: 2500, // Amount of time (in milliseconds) in which messages are considered spam.
		maxDuplicatesInterval: 2500, 
		warnMessage: '{@user}, Por favor, deja el spam', // Message that will be sent in chat upon warning a user.
		kickMessage: '**{user_tag}** ha sido expulsad@ por spamear.', // Message that will be sent in chat upon kicking a user.
		muteMessage: '**{user_tag}** ha sido mutead@ por spamear.',// Message that will be sent in chat upon muting a user.
		banMessage: '**{user_tag}** ha sido banead@ por spamear.', // Message that will be sent in chat upon banning a user.
		maxDuplicatesWarning: 3, // Amount of duplicate messages that trigger a warning.
		maxDuplicatesKick: 5, // Amount of duplicate messages that trigger a warning.
		maxDuplicatesBan: 7, // Amount of duplicate messages that trigger a warning.
		maxDuplicatesMute: 10, // Ammount of duplicate message that trigger a mute.
		ignoredPermissions: ['ADMINISTRATOR'], // Bypass users with any of these permissions.
		ignoreBots: true, // Ignore bot messages.
		verbose: true, // Extended Logs from module.
		ignoredMembers: [], // Array of User IDs that get ignored.
		muteRoleName: "Muted", // Name of the role that will be given to muted users!
		removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
		modLogsEnabled: true,
		modLogsChannelName: "pruebas"
		// And many more options... See the documentation.
	});
};
module.exports = antiSpam();