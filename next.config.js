const SCANS = process.env.SCANS;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

module.exports = {
  reactStrictMode: true,
  env: {
    DATE_FORMAT: 'DD.MM.YYYY',
    SCANS,
    BASE_URL: 'http://localhost:3000',
    HOST,
    PORT,
  },
};
