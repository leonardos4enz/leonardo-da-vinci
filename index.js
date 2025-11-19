require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
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

// Handler de comandos slash
client.on('interactionCreate', async interaction => {
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

client.login(process.env.DISCORD_TOKEN);
