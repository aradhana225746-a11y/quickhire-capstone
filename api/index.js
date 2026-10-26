const connectDB = require('../server/src/config/db');
const app = require('../server/src/server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
