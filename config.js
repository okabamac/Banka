const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  psqlUrl: process.env.PSQL_CONNECT,
  psqlTest: process.env.PSQL_TEST,
};
