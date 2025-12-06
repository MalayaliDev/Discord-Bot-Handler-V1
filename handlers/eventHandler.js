import { readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Cache for compiled events
const eventCache = new Map();

export class EventHandler {
  constructor(client) {
    this.client = client;
  }

  async loadEvents() {
    const startTime = performance.now();
    
    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    let count = 0;

    // Parallel event loading
    const loadPromises = eventFiles.map(async (file) => {
      try {
        const filePath = join(eventsPath, file);
        const cacheKey = filePath;

        // Check cache first
        if (eventCache.has(cacheKey)) {
          const eventModule = eventCache.get(cacheKey);
          this._registerEvent(eventModule);
          return true;
        }

        const event = await import(`file://${filePath}?t=${Date.now()}`);
        const eventModule = event.default;

        if (!eventModule.name || !eventModule.execute) {
          return false;
        }

        // Cache the event
        eventCache.set(cacheKey, eventModule);
        this._registerEvent(eventModule);
        return true;
      } catch (error) {
        logger.error(`Failed to load event ${file}: ${error.message}`);
        return false;
      }
    });

    const results = await Promise.all(loadPromises);
    count = results.filter(Boolean).length;
    
    const loadTime = (performance.now() - startTime).toFixed(2);
    logger.summary('Events', `${count} - ${loadTime}ms`);
  }

  _registerEvent(eventModule) {
    if (eventModule.once) {
      this.client.once(eventModule.name, (...args) => eventModule.execute(...args, this.client));
    } else {
      this.client.on(eventModule.name, (...args) => eventModule.execute(...args, this.client));
    }
  }
}
