const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiids')
    .setDescription('Muestra los IDs de todos los emojis del servidor'),
  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;

    if (emojis.size === 0) {
      return interaction.reply({ content: 'Este servidor no tiene emojis personalizados.', ephemeral: true });
    }

    const emojiList = emojis.map(e => {
      const format = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
      return `${e} \`${format}\``;
    });

    let messages = [];
    let currentMsg = `**🆔 IDs de Emojis de ${interaction.guild.name}**\n\n`;

    for (const emoji of emojiList) {
      if (currentMsg.length + emoji.length + 1 > 1900) {
        messages.push(currentMsg);
        currentMsg = '';
      }
      currentMsg += emoji + '\n';
    }

    if (currentMsg) {
      messages.push(currentMsg);
    }

    await interaction.reply({ content: messages[0], ephemeral: true });

    for (let i = 1; i < messages.length; i++) {
      await interaction.followUp({ content: messages[i], ephemeral: true });
    }
  },
};
