const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pregunta a la bola mágica')
    .addStringOption(option =>
      option.setName('pregunta')
        .setDescription('Tu pregunta')
        .setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('pregunta');

    const responses = [
      'Sí, definitivamente.',
      'Sin duda.',
      'Sí.',
      'Probablemente sí.',
      'Las señales apuntan a que sí.',
      'Respuesta confusa, intenta de nuevo.',
      'Pregunta de nuevo más tarde.',
      'Mejor no te lo digo ahora.',
      'No puedo predecirlo ahora.',
      'Concéntrate y pregunta de nuevo.',
      'No cuentes con ello.',
      'Mi respuesta es no.',
      'Mis fuentes dicen que no.',
      'Las perspectivas no son buenas.',
      'Muy dudoso.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor('#9932CC')
      .setTitle('🎱 Bola Mágica')
      .addFields(
        { name: 'Pregunta', value: question, inline: false },
        { name: 'Respuesta', value: response, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
