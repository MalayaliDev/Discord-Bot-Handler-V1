import { logger } from '../utils/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Early exit for non-command interactions
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const command = client.commandHandler.getSlashCommand(commandName);

    // Command not found - silent return for performance
    if (!command) return;

    try {
      // Check cooldown first (fastest operation)
      const cooldown = command.cooldown || 3;
      const remaining = client.commandHandler.checkCooldown(interaction.user.id, commandName, cooldown);
      
      if (remaining > 0) {
        const seconds = (remaining / 1000).toFixed(1);
        await interaction.reply({ 
          content: `⏱️ Please wait ${seconds}s before using this command again.`, 
          ephemeral: true 
        });
        return;
      }

      // Track and execute in parallel logging
      logger.command('slash', commandName, interaction.user.tag);
      client.commandHandler.trackCommandUsage(commandName, interaction.user.id, 'slash');
      
      // Execute command
      await command.execute(interaction);
    } catch (error) {
      logger.error(`Error executing slash command ${commandName}: ${error.message}`);
      
      const errorMessage = { 
        content: '❌ An error occurred while executing this command.', 
        ephemeral: true 
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }
};
