# MDH - Discord Bot Handler

A fast, lightweight Discord bot handler with beautiful console UI. Perfect for building Discord bots with slash commands and prefix commands.

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Setup
Copy `.env.example` to `.env` and add your bot token:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### 3. Run
```bash
npm start
```

## 📁 Project Structure

```
Bot Handler/
├── index.js              # Main bot file
├── handlers/
│   ├── commandHandler.js # Manages commands
│   └── eventHandler.js   # Manages events
├── commands/
│   ├── slash/            # Slash commands
│   │   └── utility/
│   │       ├── ping.js
│   │       └── stats.js
│   └── prefix/           # Prefix commands
│       └── utility/
│           └── ping.js
├── events/
│   ├── ready.js
│   ├── interactionCreate.js
│   └── messageCreate.js
└── utils/
    └── logger.js         # Console UI
```

## 📝 Create a Command

### Slash Command
Create file: `commands/slash/category/hello.js`
```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  type: 'slash',
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello'),
  
  async execute(interaction) {
    await interaction.reply(`Hello ${interaction.user.username}!`);
  }
};
```

### Prefix Command
Create file: `commands/prefix/category/hello.js`
```javascript
export default {
  type: 'prefix',
  cooldown: 3,
  data: { name: 'hello' },
  
  async execute(message, args) {
    await message.reply(`Hello ${message.author.username}!`);
  }
};
```

## 🎮 Use Commands

**Slash Commands:**
```
/ping
/stats
/hello
```

**Prefix Commands (default: `!`):**
```
!ping
!hello
```

## ⚙️ Features

- ✅ **Fast Loading** - Parallel command/event loading
- ✅ **Command Cooldowns** - Per-user rate limiting
- ✅ **Statistics** - Track command usage with `/stats`
- ✅ **Beautiful Console** - Clean, colorful output
- ✅ **Easy to Extend** - Simple command structure
- ✅ **Error Handling** - Comprehensive error catching

## 🔧 Configuration

### Change Prefix
Edit `events/messageCreate.js`:
```javascript
const PREFIX = '!'; // Change this
```

### Change Bot Activity
Edit `events/ready.js`:
```javascript
client.user.setActivity('Your Activity', { type: 'WATCHING' });
```

## 📊 Statistics Command

View bot stats with `/stats`:
- Bot uptime
- Total commands loaded
- Command usage count
- Top commands
- Most active users

## 🐛 Troubleshooting

**Bot not responding?**
- Check bot has permissions in server
- Verify `DISCORD_TOKEN` in `.env`
- Enable Message Content Intent in Discord Developer Portal

**Slash commands not showing?**
- Restart bot to register commands
- Check bot has `applications.commands` scope

## 📚 Resources

- [Discord.js Docs](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)

## 📄 License

MIT
