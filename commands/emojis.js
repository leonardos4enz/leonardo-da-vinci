const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojis')
    .setDescription('Muestra todos los emojis del servidor'),
  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;

    if (emojis.size === 0) {
      return interaction.reply({ content: 'Este servidor no tiene emojis personalizados.', ephemeral: true });
    }

    const animated = emojis.filter(e => e.animated);
    const static_ = emojis.filter(e => !e.animated);

    let messages = [];
    let currentMsg = `**😀 Emojis de ${interaction.guild.name}**\n\n`;

    if (static_.size > 0) {
      currentMsg += `**Estáticos (${static_.size}):**\n`;
      const staticEmojis = static_.map(e => `${e}`).join(' ');

      if (currentMsg.length + staticEmojis.length > 1900) {
        const chunks = staticEmojis.match(/.{1,1800}/g) || [];
        currentMsg += chunks[0];
        messages.push(currentMsg);
        for (let i = 1; i < chunks.length; i++) {
          messages.push(chunks[i]);
        }
        currentMsg = '';
      } else {
        currentMsg += staticEmojis + '\n\n';
      }
    }

    if (animated.size > 0) {
      const animatedHeader = `**Animados (${animated.size}):**\n`;
      const animatedEmojis = animated.map(e => `${e}`).join(' ');

      if (currentMsg.length + animatedHeader.length + animatedEmojis.length > 1900) {
        if (currentMsg) messages.push(currentMsg);
        currentMsg = animatedHeader;
        const chunks = animatedEmojis.match(/.{1,1800}/g) || [];
        currentMsg += chunks[0];
        messages.push(currentMsg);
        for (let i = 1; i < chunks.length; i++) {
          messages.push(chunks[i]);
        }
        currentMsg = '';
      } else {
        currentMsg += animatedHeader + animatedEmojis + '\n\n';
      }
    }

    if (currentMsg) {
      currentMsg += `\n**Total: ${emojis.size} emojis**`;
      messages.push(currentMsg);
    } else if (messages.length > 0) {
      messages[messages.length - 1] += `\n\n**Total: ${emojis.size} emojis**`;
    }

    await interaction.reply({ content: messages[0], ephemeral: true });

    for (let i = 1; i < messages.length; i++) {
      await interaction.followUp({ content: messages[i], ephemeral: true });
    }
  },
};
