import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { CommandHandler } from './handlers/commandHandler.js';
import { EventHandler } from './handlers/eventHandler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// Initialize handlers
client.commandHandler = new CommandHandler(client);
const eventHandler = new EventHandler(client);

// Startup sequence
(async () => {
  try {
    logger.mdhBanner();
    
    // Load commands
    await client.commandHandler.loadCommands();
    
    // Load events
    await eventHandler.loadEvents();
    
    // Login
    logger.section('Authenticating');
    await client.login(process.env.DISCORD_TOKEN);
    
    // Register slash commands after bot is ready
    client.once('ready', async () => {
      await client.commandHandler.registerSlashCommands();
    });
    
  } catch (error) {
    logger.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
})();

// Handle errors
process.on('unhandledRejection', error => {
  logger.error(`Unhandled Promise Rejection: ${error.message}`);
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});
