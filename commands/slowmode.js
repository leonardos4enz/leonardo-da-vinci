const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Establece el modo lento en el canal')
    .addIntegerOption(option =>
      option.setName('segundos')
        .setDescription('Segundos entre mensajes (0 para desactivar)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ADMIN_ROLE_ID = '1441944936336588820';
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const seconds = interaction.options.getInteger('segundos');

    try {
      await interaction.channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🐌 Modo Lento')
        .setDescription(seconds === 0
          ? 'Modo lento **desactivado** en este canal.'
          : `Modo lento establecido a **${seconds} segundos**.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Error al cambiar el modo lento.', ephemeral: true });
    }
  },
};
