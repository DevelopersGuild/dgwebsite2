'use strict';

var Config = {};

Config.SERVER_ADDRESS = process.env.SERVER_ADDRESS || '0.0.0.0';
Config.SERVER_PORT = process.env.SERVER_PORT || 3030;
Config.NODE_ENV = process.env.NODE_ENV || 'development';
Config.SECRET = process.env.SESS_SECRET || 'http://youtu.be/BwBK2xkjaSU';

module.exports = Config;
