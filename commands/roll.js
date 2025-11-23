const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Tira dados')
    .addIntegerOption(option =>
      option.setName('caras')
        .setDescription('Número de caras del dado (por defecto 6)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de dados a tirar (por defecto 1)')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('caras') || 6;
    const count = interaction.options.getInteger('cantidad') || 1;

    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    const embed = new EmbedBuilder()
      .setColor('#FF6347')
      .setTitle('🎲 Tirada de Dados')
      .addFields(
        { name: 'Dados', value: `${count}d${sides}`, inline: true },
        { name: 'Resultados', value: rolls.join(', '), inline: true },
        { name: 'Total', value: `${total}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
