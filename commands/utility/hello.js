export default {
  type: 'prefix',
  cooldown: 3,
  data: { name: 'hello' },
  
  async execute(message, args) {
    const user = args[0] ? `<@${args[0].replace(/[<@>]/g, '')}>` : message.author;
    await message.reply(`👋 Hello ${user}! Welcome to the bot.`);
  }
};
