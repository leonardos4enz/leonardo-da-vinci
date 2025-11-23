const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Lanza una moneda'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Cara' : 'Cruz';
    const emoji = result === 'Cara' ? '🪙' : '💿';

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🪙 Lanzamiento de Moneda')
      .setDescription(`${emoji} **${result}**`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
