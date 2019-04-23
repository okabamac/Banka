const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT || 8000,
  jwt_secret: process.env.JWT_SECRET || 'makemeasandwichrightnow',   
};
