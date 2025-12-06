import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Cache for compiled command data
const commandCache = new Map();

export class CommandHandler {
  constructor(client) {
    this.client = client;
    this.slashCommands = new Collection();
    this.prefixCommands = new Collection();
    this.cooldowns = new Collection();
    this.statsCache = null;
    this.statsCacheTime = 0;
    this.stats = {
      totalCommands: 0,
      commandUsage: new Map(),
      userUsage: new Map(),
      startTime: Date.now(),
      totalExecutions: 0
    };
  }

  async loadCommands() {
    const startTime = performance.now();
    
    const commandsPath = join(__dirname, '../commands');
    let slashCount = 0;
    let prefixCount = 0;

    // Parallel loading with Promise.all for faster startup
    const loadPromises = [];

    // Load slash commands
    const slashPath = join(commandsPath, 'slash');
    if (this._pathExists(slashPath)) {
      const slashFolders = readdirSync(slashPath);
      for (const folder of slashFolders) {
        const folderPath = join(slashPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
          loadPromises.push(
            this._loadCommand(join(folderPath, file), 'slash').then(loaded => {
              if (loaded) slashCount++;
            })
          );
        }
      }
    }

    // Load prefix commands
    const prefixPath = join(commandsPath, 'prefix');
    if (this._pathExists(prefixPath)) {
      const prefixFolders = readdirSync(prefixPath);
      for (const folder of prefixFolders) {
        const folderPath = join(prefixPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
          loadPromises.push(
            this._loadCommand(join(folderPath, file), 'prefix').then(loaded => {
              if (loaded) prefixCount++;
            })
          );
        }
      }
    }

    await Promise.all(loadPromises);
    const loadTime = (performance.now() - startTime).toFixed(2);
    const totalCommands = slashCount + prefixCount;
    logger.summary('Commands', `${totalCommands} (${slashCount} slash, ${prefixCount} prefix) - ${loadTime}ms`);
  }

  _pathExists(path) {
    try {
      readdirSync(path);
      return true;
    } catch {
      return false;
    }
  }

  async _loadCommand(filePath, type) {
    try {
      const cacheKey = filePath;

      // Check cache first
      if (commandCache.has(cacheKey)) {
        const commandModule = commandCache.get(cacheKey);
        if (type === 'slash') {
          this.slashCommands.set(commandModule.data.name, commandModule);
        } else if (type === 'prefix') {
          this.prefixCommands.set(commandModule.data.name, commandModule);
        }
        return true;
      }

      const command = await import(`file://${filePath}?t=${Date.now()}`);
      const commandModule = command.default;

      if (!commandModule.data || !commandModule.execute) {
        return false;
      }

      // Cache the command
      commandCache.set(cacheKey, commandModule);

      if (type === 'slash') {
        this.slashCommands.set(commandModule.data.name, commandModule);
      } else if (type === 'prefix') {
        this.prefixCommands.set(commandModule.data.name, commandModule);
      }
      return true;
    } catch (error) {
      logger.error(`Failed to load command: ${error.message}`);
      return false;
    }
  }

  async registerSlashCommands() {
    logger.section('Registering Slash Commands');
    
    try {
      const commands = Array.from(this.slashCommands.values()).map(cmd => cmd.data);
      
      if (commands.length === 0) {
        logger.warn('No slash commands to register');
        return;
      }

      await this.client.application.commands.set(commands);
      logger.success(`Registered ${commands.length} slash commands globally`);
    } catch (error) {
      logger.error(`Failed to register slash commands: ${error.message}`);
    }
  }

  getSlashCommand(name) {
    // Direct O(1) lookup - Collection uses Map internally
    return this.slashCommands.get(name);
  }

  getPrefixCommand(name) {
    // Direct O(1) lookup - Collection uses Map internally
    return this.prefixCommands.get(name);
  }

  getAllSlashCommands() {
    return this.slashCommands;
  }

  getAllPrefixCommands() {
    return this.prefixCommands;
  }

  /**
   * Check if a user is on cooldown for a command
   * @param {string} userId - Discord user ID
   * @param {string} commandName - Command name
   * @param {number} cooldownSeconds - Cooldown duration in seconds (default: 3)
   * @returns {number} Remaining cooldown in ms, or 0 if no cooldown
   */
  checkCooldown(userId, commandName, cooldownSeconds = 3) {
    const key = `${userId}-${commandName}`;
    const now = Date.now();
    const cooldownMs = cooldownSeconds * 1000;

    const lastUsed = this.cooldowns.get(key);
    
    if (lastUsed === undefined) {
      this.cooldowns.set(key, now);
      return 0;
    }

    const remaining = lastUsed + cooldownMs - now;

    if (remaining > 0) {
      return remaining;
    }

    this.cooldowns.set(key, now);
    return 0;
  }

  /**
   * Track command usage for statistics
   * @param {string} commandName - Command name
   * @param {string} userId - Discord user ID
   * @param {string} type - Command type ('slash' or 'prefix')
   */
  trackCommandUsage(commandName, userId, type) {
    // Increment total executions counter
    this.stats.totalExecutions++;
    
    // Invalidate stats cache
    this.statsCache = null;

    // Track command usage - optimized with get/set
    const cmdData = this.stats.commandUsage.get(commandName);
    if (cmdData) {
      cmdData.count++;
    } else {
      this.stats.commandUsage.set(commandName, { count: 1, type });
    }

    // Track user usage - optimized with direct increment
    const userCount = this.stats.userUsage.get(userId) || 0;
    this.stats.userUsage.set(userId, userCount + 1);
  }

  /**
   * Get command statistics with caching (5 second cache)
   * @returns {object} Statistics object
   */
  getStats() {
    const now = Date.now();
    
    // Return cached stats if still valid (5 second cache)
    if (this.statsCache && now - this.statsCacheTime < 5000) {
      return this.statsCache;
    }

    const uptime = now - this.stats.startTime;
    
    // Sort and slice in one pass for top commands
    const topCommands = Array.from(this.stats.commandUsage.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    // Sort and slice in one pass for top users
    const topUsers = Array.from(this.stats.userUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }));

    const stats = {
      uptime,
      totalCommands: this.stats.commandUsage.size,
      totalExecutions: this.stats.totalExecutions,
      totalUsers: this.stats.userUsage.size,
      topCommands,
      topUsers
    };

    // Cache the result
    this.statsCache = stats;
    this.statsCacheTime = now;

    return stats;
  }

  /**
   * Reset all cooldowns
   */
  resetCooldowns() {
    this.cooldowns.clear();
    logger.info('All cooldowns have been reset');
  }
}
