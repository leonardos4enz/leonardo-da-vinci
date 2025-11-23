const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Silencia temporalmente a un usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a silenciar')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duración')
        .setDescription('Duración en minutos')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320))
    .addStringOption(option =>
      option.setName('razón')
        .setDescription('Razón del timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const ADMIN_ROLE_ID = '1441944936336588820';
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const duration = interaction.options.getInteger('duración');
    const reason = interaction.options.getString('razón') || 'No especificada';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: '❌ Usuario no encontrado en el servidor.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ No puedo silenciar a este usuario.', ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: '❌ No puedes silenciar a alguien con un rol igual o superior al tuyo.', ephemeral: true });
    }

    try {
      await member.timeout(duration * 60 * 1000, `${reason} | Por: ${interaction.user.tag}`);

      const embed = new EmbedBuilder()
        .setColor('#ffff00')
        .setTitle('🔇 Usuario Silenciado')
        .addFields(
          { name: 'Usuario', value: `${user.tag}`, inline: true },
          { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
          { name: 'Duración', value: `${duration} minutos`, inline: true },
          { name: 'Razón', value: reason, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: '❌ Error al silenciar al usuario.', ephemeral: true });
    }
  },
};
