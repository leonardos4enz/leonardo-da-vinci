const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Cache de modelos para autocomplete
let modelsCache = [];
let lastFetch = 0;

async function fetchModels() {
  const now = Date.now();
  // Actualizar cache cada 5 minutos
  if (modelsCache.length === 0 || now - lastFetch > 300000) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models');
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        modelsCache = data.data;
        lastFetch = now;
      }
    } catch (error) {
      console.error('Error fetching models for cache:', error);
    }
  }
  return modelsCache;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('model')
    .setDescription('Obtén información de un modelo de IA')
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('Nombre o ID del modelo')
        .setRequired(true)
        .setAutocomplete(true)),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const models = await fetchModels();

    const filtered = models
      .filter(m =>
        m.id.toLowerCase().includes(focusedValue) ||
        m.name.toLowerCase().includes(focusedValue)
      )
      .slice(0, 25)
      .map(m => ({
        name: m.name.length > 100 ? m.name.slice(0, 97) + '...' : m.name,
        value: m.id
      }));

    await interaction.respond(filtered);
  },
  async execute(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString('nombre').toLowerCase();

    try {
      const models = await fetchModels();

      if (models.length === 0) {
        return interaction.editReply('❌ Error al obtener datos de OpenRouter.');
      }

      // Buscar modelo por ID exacto primero, luego por coincidencia
      const model = models.find(m => m.id.toLowerCase() === query) ||
        models.find(m =>
          m.id.toLowerCase().includes(query) ||
          m.name.toLowerCase().includes(query)
        );

      if (!model) {
        return interaction.editReply(`❌ No se encontró ningún modelo con "${query}".`);
      }

      // Formatear precios
      const promptPrice = parseFloat(model.pricing.prompt) * 1000000;
      const completionPrice = parseFloat(model.pricing.completion) * 1000000;

      // Formatear contexto
      const formatContext = (ctx) => {
        if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)}M`;
        if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K`;
        return ctx.toString();
      };

      // Determinar emoji según proveedor
      const getProviderEmoji = (id) => {
        if (id.includes('openai')) return '<:openai:1434656065227849878>';
        if (id.includes('anthropic') || id.includes('claude')) return '<:claude:1434658380756156628>';
        if (id.includes('google') || id.includes('gemini')) return '<:google:1434659101786505336>';
        if (id.includes('meta') || id.includes('llama')) return '<:meta:1434660192137773056>';
        if (id.includes('mistral')) return '<:ai:1434657701614452986>';
        if (id.includes('qwen')) return '<:qwen:1434659186138021921>';
        if (id.includes('deepseek')) return '<:deepseek:1434658229039927519>';
        if (id.includes('grok') || id.includes('x-ai')) return '<:grok:1434656444610773023>';
        if (id.includes('cohere')) return '<:cohere:1434656919561175070>';
        if (id.includes('perplexity')) return '<:perplexity:1434656366395523104>';
        return '<:ai:1434657701614452986>';
      };

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`${getProviderEmoji(model.id)} ${model.name}`)
        .setDescription(model.description ? model.description.slice(0, 500) + (model.description.length > 500 ? '...' : '') : 'Sin descripción')
        .addFields(
          { name: '🆔 ID', value: `\`${model.id}\``, inline: false },
          { name: '📝 Contexto', value: formatContext(model.context_length), inline: true },
          { name: '💰 Input', value: `$${promptPrice.toFixed(4)}/M`, inline: true },
          { name: '💸 Output', value: `$${completionPrice.toFixed(4)}/M`, inline: true },
          { name: '🔄 Modalidad', value: model.architecture.modality, inline: true },
          { name: '📥 Input', value: model.architecture.input_modalities.join(', '), inline: true },
          { name: '📤 Output', value: model.architecture.output_modalities.join(', '), inline: true }
        )
        .setFooter({ text: 'Datos de OpenRouter API' })
        .setTimestamp();

      if (model.top_provider?.max_completion_tokens) {
        embed.addFields({
          name: '✍️ Max Tokens',
          value: formatContext(model.top_provider.max_completion_tokens),
          inline: true
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching model:', error);
      await interaction.editReply('❌ Error al obtener información del modelo.');
    }
  },
};
