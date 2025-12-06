import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  type: 'slash',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows bot statistics'),
  
  async execute(interaction) {
    const stats = interaction.client.commandHandler.getStats();
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 Bot Statistics')
      .addFields(
        { name: '⏱️ Uptime', value: `${Math.floor(stats.uptime / 1000)}s`, inline: true },
        { name: '📝 Total Commands', value: `${stats.totalCommands}`, inline: true },
        { name: '🎯 Total Executions', value: `${stats.totalExecutions}`, inline: true },
        { name: '👥 Total Users', value: `${stats.totalUsers}`, inline: true }
      );

    if (stats.topCommands.length > 0) {
      const topCmds = stats.topCommands.map(cmd => `**${cmd.name}** - ${cmd.count} uses`).join('\n');
      embed.addFields({ name: '🔥 Top Commands', value: topCmds || 'None' });
    }

    if (stats.topUsers.length > 0) {
      const topUsrs = stats.topUsers.map(user => `<@${user.userId}> - ${user.count} commands`).join('\n');
      embed.addFields({ name: '👑 Top Users', value: topUsrs || 'None' });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
