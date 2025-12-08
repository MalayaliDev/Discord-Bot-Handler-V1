# 🤖 MDH - Discord Bot Handler (V1)

**A fast, lightweight, and feature-rich Discord bot handler with beautiful console UI. Built on `discord.js` (v14+), this framework provides seamless support for both modern Slash Commands and classic Prefix Commands, with built-in cooldowns, statistics tracking, and elegant logging.**

---

## ✨ Key Features

- **⚡ Dual Command System** — Full support for **Slash Commands** (`/`) and **Prefix Commands** (`!`)
- **🧩 Modular Architecture** — Clean separation of `CommandHandler` and `EventHandler` for easy maintenance
- **⏱️ Parallel Loading** — Commands and events load simultaneously using `Promise.all` for lightning-fast startup
- **🔒 Cooldown System** — Built-in per-user cooldowns prevent spam and abuse
- **📊 Live Statistics** — Track command usage, executions, and top users with 5-second caching
- **🎨 Beautiful Console** — Custom logger with color-coded output for better visibility
- **🚀 Production Ready** — Error handling, validation, and performance optimizations included

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

## 📂 Project Structure

The handler automatically detects and loads commands based on their location.

```
Bot Handler/
├── commands/                 # Prefix commands (e.g., !ping)
│   └── utility/              # Command category
│       ├── ping.js
│       └── hello.js
├── slash_command/            # Slash commands (e.g., /ping)
│   └── utility/              # Command category
│       ├── ping.js
│       └── stats.js
├── events/                   # Discord event handlers
│   ├── ready.js
│   ├── interactionCreate.js
│   └── messageCreate.js
├── handlers/                 # Core handlers
│   ├── commandHandler.js
│   └── eventHandler.js
├── utils/
│   └── logger.js             # Beautiful console logging
├── index.js                  # Main bot file
├── package.json
└── .env                      # Configuration (create from .env.example)
```

## 📝 Creating Commands

### Slash Commands (`slash_command/category/...`)

Slash commands use Discord's `SlashCommandBuilder` for registration.

```javascript
// Example: slash_command/utility/hello.js
import { SlashCommandBuilder } from 'discord.js';

export default {
  type: 'slash',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello!'),
  
  async execute(interaction) {
    await interaction.reply(`Hello ${interaction.user.username}!`);
  }
};
```

### Prefix Commands (`commands/category/...`)

Prefix commands use a simple object structure for the command name.

```javascript
// Example: commands/utility/hello.js
export default {
  type: 'prefix',
  cooldown: 3,
  data: { name: 'hello' },
  
  async execute(message, args) {
    await message.reply(`Hello ${message.author.username}!`);
  }
};
```

**Command Properties:**
- `type` — Command type (`'slash'` or `'prefix'`)
- `data` — Command metadata (required)
- `cooldown` — Cooldown in seconds (default: 3)
- `execute()` — Command logic function (required)

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
