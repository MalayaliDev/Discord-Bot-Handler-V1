import chalk from 'chalk';

export const logger = {
  success: (message) => {
    console.log(`${chalk.green('✓')} ${chalk.green(message)}`);
  },
  
  error: (message) => {
    console.log(`${chalk.red('✗')} ${chalk.red(message)}`);
  },
  
  info: (message) => {
    console.log(`${chalk.blue('ℹ')} ${chalk.blue(message)}`);
  },
  
  warn: (message) => {
    console.log(`${chalk.yellow('⚠')} ${chalk.yellow(message)}`);
  },
  
  debug: (message) => {
    console.log(`${chalk.magenta('◆')} ${chalk.magenta(message)}`);
  },
  
  command: (type, name, user) => {
    const typeLabel = type === 'slash' ? chalk.cyan('SLASH') : chalk.yellow('PREFIX');
    console.log(`${typeLabel} ${chalk.white(name)} ${chalk.gray(`by ${user}`)}`);
  },
  
  header: (text) => {
    const line = '═'.repeat(50);
    console.log(`\n${chalk.cyan(line)}`);
    console.log(`${chalk.cyan('║')} ${chalk.bold.cyan(text.padEnd(48))} ${chalk.cyan('║')}`);
    console.log(`${chalk.cyan(line)}\n`);
  },
  
  section: (text) => {
    console.log(`\n${chalk.magenta('▶')} ${chalk.bold.magenta(text)}`);
  },

  summary: (label, count) => {
    console.log(`${chalk.cyan('→')} ${chalk.bold.cyan(label)}: ${chalk.yellow(count)}`);
  },

  pixelBanner: () => {
    const banner = `
${chalk.bold.cyan('  ███╗   ███╗██████╗ ')}
${chalk.bold.cyan('  ████╗ ████║██╔══██╗')}
${chalk.bold.cyan('  ██╔████╔██║██║  ██║')}
${chalk.bold.cyan('  ██║╚██╔╝██║██║  ██║')}
${chalk.bold.cyan('  ██║ ╚═╝ ██║██████╔╝')}
${chalk.bold.cyan('  ╚═╝     ╚═╝╚═════╝ ')}
    `;
    console.log(banner);
  },

  mdHandler: () => {
    const banner = `
${chalk.bold.cyan('  ███╗   ███╗██████╗ ')}
${chalk.bold.cyan('  ████╗ ████║██╔══██╗')}
${chalk.bold.cyan('  ██╔████╔██║██║  ██║')}
${chalk.bold.cyan('  ██║╚██╔╝██║██║  ██║')}
${chalk.bold.cyan('  ██║ ╚═╝ ██║██████╔╝')}
${chalk.bold.cyan('  ╚═╝     ╚═╝╚═════╝ ')}

${chalk.bold.yellow('  ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ')}
${chalk.bold.yellow('  ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗')}
${chalk.bold.yellow('  ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝')}
${chalk.bold.yellow('  ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗')}
${chalk.bold.yellow('  ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║')}
${chalk.bold.yellow('  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝')}
    `;
    console.log(banner);
  },

  mdhBanner: () => {
    const banner = `
${chalk.bold.magenta('  ███╗   ███╗██████╗ ██╗  ██╗')}
${chalk.bold.magenta('  ████╗ ████║██╔══██╗██║  ██║')}
${chalk.bold.magenta('  ██╔████╔██║██║  ██║███████║')}
${chalk.bold.magenta('  ██║╚██╔╝██║██║  ██║██╔══██║')}
${chalk.bold.magenta('  ██║ ╚═╝ ██║██████╔╝██║  ██║')}
${chalk.bold.magenta('  ╚═╝     ╚═╝╚═════╝ ╚═╝  ╚═╝')}
    `;
    console.log(banner);
  }
};
