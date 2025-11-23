const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina mensajes del canal')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Número de mensajes a eliminar (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Eliminar solo mensajes de este usuario')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const ADMIN_ROLE_ID = '1441944936336588820';
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('cantidad');
    const user = interaction.options.getUser('usuario');

    await interaction.deferReply({ ephemeral: true });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: amount });

      if (user) {
        messages = messages.filter(msg => msg.author.id === user.id);
      }

      const deleted = await interaction.channel.bulkDelete(messages, true);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🗑️ Mensajes Eliminados')
        .setDescription(`Se eliminaron **${deleted.size}** mensajes${user ? ` de ${user.tag}` : ''}.`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({ content: '❌ Error al eliminar mensajes. Los mensajes mayores a 14 días no pueden ser eliminados en masa.' });
    }
  },
};
