const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestra información de un usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario del que quieres ver la información')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle(`👤 Información de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📛 Apodo', value: member.nickname || 'Ninguno', inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Sí' : 'No', inline: true },
        { name: '📅 Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: false },
        { name: '📥 Unido al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
        { name: '🎨 Roles', value: member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(', ') || 'Ninguno', inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
