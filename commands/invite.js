const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Obtén el enlace de invitación del servidor'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📨 Invitación al Servidor')
      .setDescription('¡Invita a tus amigos al servidor!')
      .addFields(
        { name: 'Enlace', value: 'https://discord.gg/5BVWeWCk7j', inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
