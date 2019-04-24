"use strict";

var dotenv = require('dotenv');

dotenv.config();
module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT || 5000,
  jwt_secret: process.env.JWT_SECRET || 'makemeasandwichrightnow'
};