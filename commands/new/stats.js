const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Display bot statistics',
    category: 'general',
    aliases: ['botstats', 'info'],
    cooldown: 2,
    async execute(message, args, client) {
        const uptime = client.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime % 86400000) / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);

        const memUsage = process.memoryUsage();
        const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);

        const embed = new EmbedBuilder()
            .setColor(client.config?.embedColor || 0x0099ff)
            .setTitle('📊 Bot Statistics')
            .addFields(
                { name: 'Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
                { name: 'Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: 'Memory', value: `${memUsageMB}MB / ${memTotalMB}MB`, inline: true },
                { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${client.users.cache.size}`, inline: true },
                { name: 'Channels', value: `${client.channels.cache.size}`, inline: true },
                { name: 'Commands', value: `${client.commands.size + client.slashCommands.size}`, inline: true },
                { name: 'Node.js', value: process.version, inline: true },
                { name: 'Discord.js', value: require('discord.js').version, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}` })
            .setTimestamp();

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};
