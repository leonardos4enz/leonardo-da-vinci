const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Muestra información de un canal')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal a consultar (por defecto el actual)')
        .setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;

    const channelTypes = {
      [ChannelType.GuildText]: 'Texto',
      [ChannelType.GuildVoice]: 'Voz',
      [ChannelType.GuildCategory]: 'Categoría',
      [ChannelType.GuildAnnouncement]: 'Anuncios',
      [ChannelType.GuildStageVoice]: 'Escenario',
      [ChannelType.GuildForum]: 'Foro',
    };

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`📺 Información del Canal: #${channel.name}`)
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Tipo', value: channelTypes[channel.type] || 'Desconocido', inline: true },
        { name: 'Posición', value: `${channel.position}`, inline: true },
        { name: 'Creado', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'NSFW', value: channel.nsfw ? 'Sí' : 'No', inline: true },
        { name: 'Categoría', value: channel.parent?.name || 'Ninguna', inline: true }
      )
      .setTimestamp();

    if (channel.topic) {
      embed.addFields({ name: 'Tema', value: channel.topic, inline: false });
    }

    if (channel.rateLimitPerUser) {
      embed.addFields({ name: 'Modo lento', value: `${channel.rateLimitPerUser}s`, inline: true });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
