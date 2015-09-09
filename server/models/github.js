'use strict';

var Request = require('../config/request');
var Config = require('../config/github');

function authenticateUser(code, callback) {
  Request.post({url: 'https://github.com/login/oauth/access_token',
    form: {
      code: code,
      client_id: Config.CLIENT_ID,
      client_secret: Config.CLIENT_SECRET
    }
  }, function(err, res, body) {
    if (err) {
      callback(err);
    } else if (res.statusCode !== 200) {
      callback(new Error('GitHub returned an unexpected code: ' +
                          res.statusCode));
    } else if (body.error) {

      // (TEMP)
      console.log(body.error_description);
      // This is a client error.
      // console.log(body.error_description);
      callback(new Error('Login failed, try again.'));
    } else if (body.scope !== Config.SCOPE) {

      console.log('Incorrect scope.');
      callback(new Error('Login failed, try again.'));
    } else {
      callback(null, body.access_token);
    }

  });
}

function getUser(token, callback) {
  Request.get({
    url: 'https://api.github.com/user',
    headers: { Authorization: 'token ' + token }
  }, function(err, res, body) {
    if (err) {
      callback(err);
    } else if (res.statusCode === 401) {
      callback(new Error('Server failed to get user.'));
    } else {

      var user = {
        id: body.id,
        username: body.login,
        name: body.name,
        email: body.email || undefined,
        website: body.blog
      };

      callback(null, user);
    }
  });
}


function isOfficer(username, callback) {
  Request.get({url: 'https://api.github.com/teams/' +
    Config.OFFICERS_TEAM_ID + '/memberships/' + username
  }, function(err, res, body) {
      if (err) {
        callback(err);
      } else {
        switch(res.statusCode) {
          default:
            callback(new Error('GitHub returned an unexpected code: ' +
                                res.statusCode));
            break;
          case 404:

            // 404 means the user isn't part of the team
            callback(null, false);
          break;
          case 200:
            callback(null, true);
          break;

        }
      }
    }
  );
}

function isMember(username, callback) {
  Request.get({url: 'https://api.github.com/teams/' +
    Config.MEMBERS_TEAM_ID + '/memberships/' + username
  }, function(err, res, body) {
      if (err) {
        callback(err);
      } else {
        switch(res.statusCode) {
          default:
            callback(new Error('GitHub returned an unexpected code: ' +
                                res.statusCode));
            break;
          case 404:

            // 404 means the user isn't part of the team
            callback(null, false);
          break;
          case 200:
            callback(null, true);
          break;

        }
      }
    }
  );
}

var GitHubModel = {
  authenticateUser: authenticateUser,
  isOfficer: isOfficer,
  isMember: isMember,
  getUser: getUser
};

module.exports = GitHubModel;
