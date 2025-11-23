const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razón')
        .setDescription('Razón del ban')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('días')
        .setDescription('Días de mensajes a eliminar (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const ADMIN_ROLE_ID = '1441944936336588820';
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razón') || 'No especificada';
    const days = interaction.options.getInteger('días') || 0;
    const member = interaction.guild.members.cache.get(user.id);

    if (member) {
      if (!member.bannable) {
        return interaction.reply({ content: '❌ No puedo banear a este usuario.', ephemeral: true });
      }
      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: '❌ No puedes banear a alguien con un rol igual o superior al tuyo.', ephemeral: true });
      }
    }

    try {
      await interaction.guild.members.ban(user, { deleteMessageDays: days, reason: `${reason} | Baneado por: ${interaction.user.tag}` });

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔨 Usuario Baneado')
        .addFields(
          { name: 'Usuario', value: `${user.tag}`, inline: true },
          { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
          { name: 'Razón', value: reason, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Error al banear al usuario.', ephemeral: true });
    }
  },
};
