const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Muestra información de un rol')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Rol a consultar')
        .setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('rol');

    const permissions = role.permissions.toArray().map(perm =>
      perm.replace(/([A-Z])/g, ' $1').trim()
    ).join(', ') || 'Ninguno';

    const embed = new EmbedBuilder()
      .setColor(role.hexColor || '#99AAB5')
      .setTitle(`🎭 Información del Rol: ${role.name}`)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor || 'Por defecto', inline: true },
        { name: 'Posición', value: `${role.position}`, inline: true },
        { name: 'Mencionable', value: role.mentionable ? 'Sí' : 'No', inline: true },
        { name: 'Mostrar separado', value: role.hoist ? 'Sí' : 'No', inline: true },
        { name: 'Miembros', value: `${role.members.size}`, inline: true },
        { name: 'Creado', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
