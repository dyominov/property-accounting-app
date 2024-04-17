import pino from 'pino';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});

export default logger;
