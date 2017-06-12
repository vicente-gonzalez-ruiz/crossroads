const chalk = require('chalk');

const log = (...args) => {
  let level = 'INFO';
  let msg = '';
  if (args.length < 1) {
    return;
  } else if (args.length === 1) {
    msg = args[0];
    if (typeof msg !== 'string') {
      return;
    }
  } else {
    if (typeof args[0] !== 'string' || typeof args[1] !== 'string') {
      return;
    }
    level = args[0].toUpperCase();
    msg = args[1];
  }

  let markLabel;

  switch (level) {
    case 'INFO':
      markLabel = chalk.bgBlue.white.bold;
      break;

    case 'ERROR':
      markLabel = chalk.bgRed.white.bold;
      break;

    case 'DEBUG':
      markLabel = chalk.bgYellow.white.bold;
      break;

    case 'WARNING':
      markLabel = chalk.bgMagenta.white.bold;
      break;

    case 'SUCCESS':
      markLabel = chalk.bgGreen.white.bold;
      break;

    default:
      markLabel = chalk.bgCyan.white.bold;
      break;
  }

  const markTime = chalk.gray.bold;
  const time = markTime(new Date().toLocaleString() + ' - ');
  const label = markLabel(' ' + level + ' ');
  const logMessage = time + label + ' ' + msg + '\n';

  return level === 'ERROR'
    ? process.stderr.write(logMessage)
    : process.stdout.write(logMessage);
};

module.exports = log;
