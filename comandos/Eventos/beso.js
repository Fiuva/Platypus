const { ROL, PRIVATE_CONFIG, CANAL_VOZ } = require("../../config/constantes");
const { random } = require("../../handlers/funciones");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

const command_data = {
    name: "beso",
    description: `😳 Comando de evento`
}

const tipos = [
    '',
    'en el pie',
    'en el dedo',
    'en la mano',
    'en la mejilla',
    'en el riñón',
    'en la frente',
    'en la oreja',
    'en el ojo 👁️',
    'en la boca 😘',
    'en el morro 🐽',
    'en la cola 🦫',
    'en el pelo',
    'en el cuello',
    'a distancia',
    'en el tobillo',
    'en la pata',
    'sutilmente',
    'en los labios 😳',
    'a la vez que a su novia 😤'
]

const talkedRecently = new Set();
const delay = 30; //min

module.exports = {
    ...command_data,
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        if (talkedRecently.has(interaction.member.id))
            return interaction.reply({ content: `No puedes besar tan rápido, relájate! \`hay ${delay} min de delay\` entre comandos`, ephemeral: true });

        talkedRecently.add(interaction.member.id);
        setTimeout(() => {
            talkedRecently.delete(interaction.member.id);
        }, delay*60*1000);
        let user = (await interaction.guild.members.fetch()).random();

        const aceptar_button = new ButtonBuilder()
            .setLabel('Damelo 😳')
            .setCustomId(`evento_beso_aceptar_${user.id}_${interaction.user.id}`)
            .setStyle('Success')
            .setEmoji('✅')
        const rechazar_button = new ButtonBuilder()
            .setLabel('Que asco 🤢')
            .setCustomId(`evento_beso_rechazar_${user.id}_${interaction.user.id}`)
            .setStyle('Danger')
            .setEmoji('❌')
        const row = new ActionRowBuilder()
            .addComponents(rechazar_button, aceptar_button)

        const embed = new EmbedBuilder()
            .setDescription('Hoy es el **día internacional del beso**')
            .setColor('#F759F0')
            .setFooter({ text: '13/04/2023' })
        interaction.reply({
            content:
                `${interaction.member} quiere besar a ${user} ${random(tipos)}`,
            embeds: [embed],
            components: [row]
        });
    }
}