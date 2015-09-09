'use strict';

var qs = require('querystring');

// TODO: Require these to be valid in production
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

// This is the token from the GitHub Bot that
// gives permission to read the GitHub bot's orgs
var BOT_TOKEN = process.env.BOT_TOKEN;

var SCOPE = 'user:email';

var OFFICERS_TEAM_ID = 576789;

var MEMBERS_TEAM_ID = 1041991;

var loginUrl = 'https://github.com/login/oauth/authorize' + '?' +
                qs.stringify({scope: SCOPE, client_id: CLIENT_ID});

var GitHubConfig = {
  SCOPE: SCOPE,
  loginUrl: loginUrl,
  CLIENT_ID: CLIENT_ID,
  CLIENT_SECRET: CLIENT_SECRET,
  BOT_TOKEN: BOT_TOKEN,
  OFFICERS_TEAM_ID: OFFICERS_TEAM_ID,
  MEMBERS_TEAM_ID: MEMBERS_TEAM_ID
};

module.exports = GitHubConfig;
