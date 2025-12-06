# ✨ Discord Bot Handler: Fast & Modular (V1)

**A high-performance, flexible, and feature-rich Discord bot framework built on `discord.js` (v14+). This handler provides native, efficient support for both modern Slash Commands and classic Prefix Commands, complete with built-in cooldowns, statistics, and a robust logging utility.**

---

## 🚀 Key Features

  * **⚡ Dual Command System:** Full support for both **Slash Commands** (`/`) and **Prefix Commands** (`!`).
  * **🧩 Modular Architecture:** Clear separation of logic into `CommandHandler` and `EventHandler` for maximum maintainability and organization.
  * **⏱️ Optimized Startup:** Events and commands are loaded **in parallel** using `Promise.all` for minimal startup latency.
  * **🔒 Cooldown Management:** Built-in, per-user cooldowns for both command types, preventing spam and misuse.
  * **📊 Runtime Statistics:** The `CommandHandler` tracks command usage, total executions, and top users in real-time, with a **5-second cache** for performance.
  * **🎨 Advanced Logging:** A custom `logger.js` utility using `chalk` provides clean, color-coded, and informative console output.
  * **♻️ Hot-Reload Ready:** Utilizes a custom cache system for commands and events to optimize future development cycles.

---

## ⚙️ Getting Started

Follow these simple steps to deploy your Discord bot.

### Prerequisites

1.  **Node.js** (v18 or newer).
2.  A **Discord Application** and **Bot Token**.
3.  Basic understanding of `discord.js` v14.

### 1\. Installation

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/MalayaliDev/Discord-Bot-Handler-V1.git
cd Discord-Bot-Handler-V1
npm install
```

### 2\. Configuration (`.env` File)

Create a file named **`.env`** in the root directory and add your application credentials.

| Variable | Description | Requirement |
| :--- | :--- | :--- |
| `DISCORD_TOKEN` | The secret token for your Discord Bot. | **Required** |
| `CLIENT_ID` | Your Discord Application ID (for registering Slash Commands). | **Required** |
| `GUILD_ID` | The ID of your primary testing/development server. | **Highly Recommended** (For instant slash command registration) |

**Example `.env`:**

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=123456789012345678
GUILD_ID=987654321098765432
```

### 3\. Run the Bot

Use the defined scripts in `package.json` to start your bot.

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the bot using `node index.js`. |
| `npm run dev` | Runs the bot using `node --watch index.js` for automatic restarts during development. |

---

## 📂 Project Structure & Command Setup

The handler is designed to automatically detect and load files based on their location.

```
.
├── commands/
│   ├── prefix/               # Traditional commands (e.g., !ping)
│   │   └── fun/              # Command category
│   │       └── ping.js       
│   └── slash/                # Application commands (e.g., /ping)
│       └── utility/          # Command category
│           └── info.js       
├── events/                   # Discord events (ready, messageCreate, etc.)
├── handlers/                 # Core logic (CommandHandler, EventHandler)
├── utils/                    # Helper functions (logger.js)
├── index.js                  # Main entry file
└── package.json
```

### Command File Formatting (The `data` and `execute` standard)

#### 1\. Slash Commands (`commands/slash/...`)

Slash commands **MUST** use the `data` property for registration with the Discord API.

```javascript
// Example: commands/slash/utility/info.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Provides information about the bot and server.'),
  
  cooldown: 5, // Optional: Per-command cooldown in seconds
  
  async execute(interaction) {
    await interaction.reply({ content: 'Bot info here!', ephemeral: true });
  },
};
```

#### 2\. Prefix Commands (`commands/prefix/...`)

Prefix commands use a simple JSON object for the `data` property, defining the command name and optional aliases.

```javascript
// Example: commands/prefix/fun/hello.js
export default {
  data: {
    name: 'hello',
    aliases: ['hi', 'hey'], // Optional: command aliases
    description: 'Says hello back.',
  },

  cooldown: 3, // Optional: Per-command cooldown in seconds

  async execute(message, args) {
    // args is an array of strings following the command name
    await message.reply(`Hello, ${message.author.username}! You sent: ${args.join(' ')}`);
  },
};
```

### Cooldowns (How it Works)

The `CommandHandler` uses an in-memory `Collection` to store command usage timestamps (`userId-commandName`).

1.  When a command is executed, `client.commandHandler.checkCooldown()` is called.
2.  If `command.cooldown` is defined, that value is used; otherwise, it defaults to **3 seconds**.
3.  If the time difference is less than the cooldown, the remaining time is calculated and returned, stopping the command execution.

---

## 🧠 Handler Deep Dive

### `handlers/commandHandler.js`

This class manages the lifecycle of commands:

  * **`loadCommands()`:** Scans the file system, imports command modules, and stores them in **`slashCommands`** and **`prefixCommands`** `Collection`s for $O(1)$ lookup.
  * **`registerSlashCommands()`:** Extracts the `data` objects from all slash commands and uses `client.application.commands.set(commands)` to register them with Discord upon bot login.
  * **`getStats()`:** Efficiently calculates and caches runtime metrics every 5 seconds, including:
      * **Uptime**
      * **Total Executions**
      * **Top 5 Commands** (by usage count)
      * **Top 5 Users** (by usage count)

### `handlers/eventHandler.js`

  * **`loadEvents()`:** Scans the `events/` directory, imports the event modules, and registers them using `client.on()` or `client.once()` based on the `eventModule.once` flag.

### `events/interactionCreate.js` & `events/messageCreate.js`

These are the main runtime processors:

  * **Filter/Parse:** They first filter out non-relevant events (e.g., bot messages, non-command interactions).
  * **Lookup:** They perform a fast command lookup.
  * **Cooldown Check:** They immediately check the cooldown.
  * **Log & Track:** They log the command execution using the custom `logger` and call `trackCommandUsage()`.
  * **Execution & Error Handling:** They execute the command's logic and gracefully handle errors, replying to the user with a clean error message.

---

## ❓ Need Help?

Feel free to open an issue on the GitHub repository if you encounter any bugs or have suggestions for new features\!

## 📄 License
[MIT](LICENSE)
