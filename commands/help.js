const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra todos los comandos disponibles'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📚 Comandos Disponibles')
      .setDescription('Lista de comandos del bot')
      .addFields(
        { name: '/ping', value: 'Muestra la latencia del bot', inline: true },
        { name: '/help', value: 'Muestra esta ayuda', inline: true },
        { name: '/serverinfo', value: 'Información del servidor', inline: true },
        { name: '/userinfo', value: 'Información de un usuario', inline: true },
        { name: '/avatar', value: 'Muestra el avatar de un usuario', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  },
};
