require('dotenv').config();
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Cargar comandos
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Comando cargado: ${command.data.name}`);
  } else {
    console.log(`⚠️ [WARNING] El comando en ${filePath} no tiene "data" o "execute"`);
  }
}

client.once('ready', () => {
  console.log(`\n🤖 Bot conectado como ${client.user.tag}`);
  console.log(`📊 Comandos cargados: ${client.commands.size}`);
  console.log(`🌐 Servidores: ${client.guilds.cache.size}\n`);
});

// Handler de comandos slash y autocomplete
client.on('interactionCreate', async interaction => {
  // Manejar autocomplete
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`Error en autocomplete de ${interaction.commandName}:`, error);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Comando ${interaction.commandName} no encontrado.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error ejecutando ${interaction.commandName}:`, error);
    const errorMessage = { content: '❌ Hubo un error ejecutando este comando.', ephemeral: true };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Evento de bienvenida
client.on('guildMemberAdd', async member => {
  const WELCOME_CHANNEL_ID = '1431696442501894145';
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🚀 ¡Nuevo Inventor!')
    .setDescription(`¡Hola ${member}! Bienvenido a **${member.guild.name}**\n\n<:ai:1434657701614452986> Somos una comunidad de creadores que usan inteligencia artificial para imaginar, construir e innovar.\n\n<:blob_heart:1434660286924591155> Comparte tus ideas, aprende y da vida al futuro con nosotros.\n\n<:claude:1434658380756156628> **Miembro #${member.guild.memberCount}**`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .setImage('https://lh3.googleusercontent.com/sitesv/AAzXCkee6ktnk3C7kY5OH6lPe1CqLcFo1ndRkjvjjpm-9i-NhhWyCH-W20B60U4wnv0e1wQHxO74_CUT0STxZvjHwC0sGesaoeyp2ZhmB28CzPZ1lXtQVvGERlmY38utikxiUqAdfEo1SwC0oUZQE583CBA3kIhZVnJXe8xpstHirjDZq5cqMm471NPI6qNgmhrf1GTzu5bRyHqu7tceVgUo3LSPPO22LrdSBNxTOZI=w1280')
    .setFooter({ text: `¡Bienvenido inventor! • ID: ${member.id}` })
    .setTimestamp();

  try {
    await channel.send({ content: `¡${member} ha llegado!`, embeds: [embed] });
  } catch (error) {
    console.error('Error enviando mensaje de bienvenida:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
