import { logger } from '../utils/logger.js';

const PREFIX = '!';

export default {
  name: 'messageCreate',
  async execute(message, client) {
    // Early exit for bots and non-prefix messages
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // Parse command and args
    const content = message.content.slice(PREFIX.length).trim();
    const args = content.split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get command with O(1) lookup
    const command = client.commandHandler.getPrefixCommand(commandName);
    if (!command) return;

    try {
      // Check cooldown first (fastest operation)
      const cooldown = command.cooldown || 3;
      const remaining = client.commandHandler.checkCooldown(message.author.id, commandName, cooldown);
      
      if (remaining > 0) {
        const seconds = (remaining / 1000).toFixed(1);
        await message.reply(`⏱️ Please wait ${seconds}s before using this command again.`);
        return;
      }

      // Track and execute
      logger.command('prefix', commandName, message.author.tag);
      client.commandHandler.trackCommandUsage(commandName, message.author.id, 'prefix');
      await command.execute(message, args);
    } catch (error) {
      logger.error(`Error executing prefix command ${commandName}: ${error.message}`);
      await message.reply('❌ An error occurred while executing this command.');
    }
  }
};
