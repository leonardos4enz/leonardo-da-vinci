const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Elige entre varias opciones')
    .addStringOption(option =>
      option.setName('opciones')
        .setDescription('Opciones separadas por comas (ej: pizza, hamburguesa, tacos)')
        .setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString('opciones');
    const options = input.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

    if (options.length < 2) {
      return interaction.reply({ content: '❌ Necesitas al menos 2 opciones separadas por comas.', ephemeral: true });
    }

    const choice = options[Math.floor(Math.random() * options.length)];

    const embed = new EmbedBuilder()
      .setColor('#00CED1')
      .setTitle('🤔 Elección')
      .addFields(
        { name: 'Opciones', value: options.join(', '), inline: false },
        { name: 'Elijo', value: `**${choice}**`, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
