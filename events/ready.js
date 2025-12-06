import { logger } from '../utils/logger.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.header(`${client.user.tag} is Online!`);
    logger.success(`Bot is ready with ${client.guilds.cache.size} guild(s)`);
    logger.success(`Serving ${client.users.cache.size} user(s)`);
    
    client.user.setActivity('Discord Bot Handler', { type: 'WATCHING' });
    logger.success('Activity status set');
  }
};
