'use strict';

var async = require('async');
var mongoose  = require('mongoose');

var db = require('./database');
var GitHub = require('./github');

var UserSchema = mongoose.Schema({
  id        : { type: Number, required: true, unique: true },
  token     : { type: String, required: true, unique: true },
  username  : { type: String, required: true, unique: true },
  email     : { type: String, unique: true },
  twitter   : { type: String, unique: true },
  instagram : { type: String, unique: true },
  slack     : { type: String, unique: true }
});

var UserMongoModel = db.model('users', UserSchema);

function authenticateUser(token, callback) {
  UserMongoModel
  .findOne({token: token})
  .select('-_id id username token')
  .exec(function(err, user) {
    if (err) {
      callback(err);
    } else {

      // If I couldn't find the token
      if (!user) {
        async.waterfall([
          function(next) {
            GitHub.getUser(token, next);
          },
          function(user, next) {
            UserMongoModel
            .findOne({id: user.id})
            .select('_id')
            .exec(function(err, _user) {
              if (err) {
                next(err);
              } else {

                // If still can't find the user, create an account
                if (!_user) {
                  UserMongoModel
                  .create({
                    id: user.id,
                    token: token,
                    username: user.username,
                    email: user.email
                  }, next);
                } else {

                  // Found user by Id, update their token
                  _user.token = token;
                  _user.save();
                  next(null, user);
                }
              }
            });
          }

        ], callback);
      } else {

        // Found user by token
        callback(null, user);
      }
    }
  });
}

var UserModel = {
  authenticate: authenticateUser
};

module.exports = UserModel;
