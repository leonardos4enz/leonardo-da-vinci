const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bloquea el canal actual')
    .addStringOption(option =>
      option.setName('razón')
        .setDescription('Razón del bloqueo')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ADMIN_ROLE_ID = '1441944936336588820';
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const reason = interaction.options.getString('razón') || 'No especificada';

    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false
      });

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔒 Canal Bloqueado')
        .addFields(
          { name: 'Moderador', value: interaction.user.tag, inline: true },
          { name: 'Razón', value: reason, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Error al bloquear el canal.', ephemeral: true });
    }
  },
};
