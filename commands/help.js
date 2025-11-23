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
        { name: '🔧 General', value: '`/ping` `/help`', inline: false },
        { name: '🛡️ Moderación', value: '`/ban` `/kick` `/timeout` `/clear` `/slowmode` `/lock` `/unlock`', inline: false },
        { name: 'ℹ️ Información', value: '`/serverinfo` `/userinfo` `/avatar` `/roleinfo` `/channelinfo`', inline: false },
        { name: '🎮 Entretenimiento', value: '`/8ball` `/coinflip` `/roll` `/choose`', inline: false },
        { name: '🏠 Servidor', value: '`/invite` `/emojis`', inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Solicitado por ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  },
};
