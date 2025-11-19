const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información del servidor'),
  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`📊 Información de ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: guild.id, inline: true },
        { name: '👑 Dueño', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Canales', value: `${guild.channels.cache.size}`, inline: true },
        { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
