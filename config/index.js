'use strict';

var Config = {};

Config.SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'localhost';
Config.SERVER_PORT = process.env.SERVER_PORT || 3000;
Config.NODE_ENV = process.env.NODE_ENV || 'development';
Config.SECRET = process.env.SESS_SECRET || 'http://youtu.be/BwBK2xkjaSU';

module.exports = Config;
