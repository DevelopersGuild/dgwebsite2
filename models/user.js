'use strict';

var async     = require('async');
var bcrypt    = require('bcrypt');
var mongoose  = require('mongoose');
var validator = require('validator');

// Include database model
var db = require('./database');

// Titles for users
var TITLES = ['Guest', 'Member', 'Officer'];

var STOCKAVATARS = ['alpaca.png', 'anthony.png', 'bird.png', 'cat.png',
                    'chinchilla.png', 'fox.png', 'hedgehog.png', 'rat.png',
                    'husky.png', 'rabbit.png', 'polarbear.png', 'wifi.gif',
                    'slice.gif', 'cubes.gif','fronting.gif', 'infinite.gif',
                    'bouncy.gif', 'deanza.png','github.png', 'nodejs.png',
                    'swift.png', 'windows.png', 'osx.png','linux.png'];

// Get a random stock avatar
function getRandomStockAvatar() {
    return STOCKAVATARS[

      // Generate random subscript within the 0 - array length
      Math.floor(Math.floor(Math.random() * STOCKAVATARS.length))
    ];
}

var UserSchema = mongoose.Schema({
  username      : { type: String, required: true,  unique: true },
  usernameLower : { type: String, required: true,  unique: true },
  email         : { type: String, required: true,  unique: true },
  password      : { type: String, required: true },
  creationDate  : { type: Number, default: Date.now },
  title         : { type: Number, default: 0 },
  lastActivity  : { type: Number, default: Date.now },
  flags         : {
    banned        : { type: Boolean, default: false },
    retired       : { type: Boolean, default: false },
    online        : { type: Boolean, default: true }
  },
  profile       : {
    fName         : { type: String, required: true },
    lName         : { type: String, required: true},
    avatar        : { type: String, default: getRandomStockAvatar },
    bio           : { type: String },
    website       : { type: String },
    githubName    : { type: String }
  }
});

var UserMongoModel = db.model('users', UserSchema);

// Every 5 minutes, check to see if a user is online

function updateUserOnlineStatus() {

  //30 mins * 60 sec * 1000 millisec
  var TIMEOUT = 30 * 60 * 1000;

  var curTime = Date.now();

  var ttl = (curTime - TIMEOUT);

  // Find users that are flagged as online and have last activity less than TTL
  UserMongoModel.update({ lastActivity: {$lt : ttl},
  'flags.online': true},
  {'flags.online': false}, {multi: true},
   function (err) {
      if (err) {
        console.log(err);
      }

    }
  );
}

updateUserOnlineStatus();
setInterval(updateUserOnlineStatus, 1000 * 60 * 5);

function logInUser(usernameEmail, password, callback) {
  var query;
  if (validator.isEmail(usernameEmail)) {
    query = { email: usernameEmail.toLowerCase() };
  } else {
    query = { usernameLower: usernameEmail.toLowerCase() };
  }

  UserMongoModel.findOne(query,
  '_id username usernameLower password title flags profile.avatar',
    function(err, user) {
      var result;
      if (!user) {
        result = {
          code    : 400,
          message : 'Can\'t find that username or email.'
        };
        callback(result);
      } else {
        bcrypt.compare(password, user.password, function(err, correct) {
          if (!correct) {
            result = {
              code    : 400,
              message : 'You entered the wrong password'
            };
            callback(result);
          } else {
            callback(result, user);
          }
        });
      }
    }
  );
}

function createUser(username, email, password, fName, lName, callback) {

  // Use series to check to see if username or email already exists
  async.series([
    function(seriesCallback) {
      UserMongoModel.findOne({ usernameLower: username.toLowerCase() }, '_id',
        function(err, user) {
          var result;
          if (user) {

            // Non-null result ends the series immediately.
            result = {
              code    : 400,
              message : 'Username already exists.'
            };
          }
          seriesCallback(result);
        }
      );
    }
  , function(seriesCallback) {
      UserMongoModel.findOne({ email: email.toLowerCase() }, '_id',
        function(err, user) {
          var result;
          if (user) {

            // Non-null result ends the series immediately.
            result = {
              code    : 400,
              message : 'Email already exists.'
            };
          }
          seriesCallback(result);
        }
      );
    }
  ]
  , function(result) {
      if (result) {
        callback(result);
      } else {
        bcrypt.hash(password, 10, function(err, hash) {

          UserMongoModel.create({
            username      : username,
            usernameLower : username.toLowerCase(),
            email         : email.toLowerCase(),
            password      : hash,
            profile : {
              fName: fName,
              lName: lName
            }
          }, function(err, user) {

            var result;

            if (err) {
              result = {
                code    : 500,
                message : 'Something went wrong in the database. Try again.'
              };
              console.error(err);
            }

            callback(result, user);

          });
        });
      }
    });

}

function getUser(usernameOrId, callback) {

  var query;

  if (validator.isMongoId(usernameOrId)) {
    query = {_id: usernameOrId};
  } else {
    query = {usernameLower: usernameOrId.toLowerCase()};
  }

  UserMongoModel.findOne(query,
  '_id username usernameLower title flags profile.avatar', function(err, user) {

    var errorResult;

    if (err) {
      errorResult = {
        code    : 500,
        message : 'Something went wrong in the database.'
      };
      console.error(err);
    } else if (!user) {
      errorResult = {
        code    : 404,
        message : 'User not found.'
      };
    }
    callback(errorResult, user);

  });

}

function getUserProfile(username, callback) {

  UserMongoModel.findOne({usernameLower: username.toLowerCase()},
  'username usernameLower email creationDate title lastActivity flags profile',
    function(err, user) {

      var errorResult;

      if (err) {
        errorResult = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      } else if (!user) {
        errorResult = {
          code    : 404,
          message : 'User not found.'
        };
      }
      callback(errorResult, user);

    }
  );

}

function getAllMembers(callback) {

  var memberNum = 1;
  var officerNum = 2;
  var selectedFields = 'username usernameLower title flags.retired lastActivity profile.avatar profile.fName profile.lName';

  //.find({}) returns a query object, which can do more specific queries like
  //the or function, looking for either memberNum or officerNum
  //exec() sends docs to a callback
  UserMongoModel.find({}, selectedFields)
  .or([ {title: memberNum}, { title: officerNum}])
  .sort({title: -1})
    .exec(function(err, docs){

      if(docs){
        callback(docs);
      }

    });

}

function changeUserTitle(username, titleNum, callback) {
  UserMongoModel.findOneAndUpdate({ usernameLower: username.toLowerCase() },
    { title: titleNum }, function(err, doc) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database. Try again.'
        };
        console.error(err);
      } else if (!doc) {
        result = {
          code    : 400,
          message : 'Couldn\'t find that user.'
        };
      } else {
        result = {
          code: 200,
          message: doc.username + ' is now a ' + TITLES[doc.title] + '.'
        };
      }
      callback(result);
    }
  );
}

//curently updates on these routes:
// /user/:userid, and all routes in forum.js
function updateLastActivity(username, callback) {
  var curTime = Date.now();
  UserMongoModel.update({ usernameLower: username.toLowerCase() },
    { lastActivity: curTime, 'flags.online': true }, function(err) {

      if (err) {
        callback(err);
      }

    }
  );

}

function changeUserProfile(username, avatar, fName, lName, website, github, callback) {
  UserMongoModel.findOneAndUpdate({ usernameLower: username.toLowerCase() },
    { 'profile.avatar': STOCKAVATARS[avatar-1], 'profile.fName': fName, 'profile.lName': lName,
    'profile.website': website, 'profile.githubName': github},
    function(err, user) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database. Try again.'
        };
        console.error(err);
      } else if (!user) {
        result = {
          code    : 400,
          message : 'Couldn\'t find that user.'
        };
      } else {
        result = {
          code: 200,
          message: 'User Profile successfully changed.'
        };
      }
      callback(result, user.profile.avatar);
    }
  );
}

function getUserAvatar(username, callback) {
  UserMongoModel.findOne({usernameLower: username.toLowerCase()},
    'profile.avatar', function(err, user) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database. Try again.'
        };
        console.error(err);
      } else if (!user) {
        result = {
          code    : 400,
          message : 'Couldn\'t find that user.'
        };
      }

      var avatarStr = user.profile.avatar || undefined;
      callback(result, avatarStr);
    }
  );
}

function getUserTitle(username, callback) {
  UserMongoModel.findOne({usernameLower: username.toLowerCase()},
    'title', function(err, user) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database. Try again.'
        };
        console.error(err);
      } else if (!user) {
        result = {
          code    : 400,
          message : 'Couldn\'t find that user.'
        };
      }

      var title = user.title;
      callback(result, title);
    }
  );
}

function getActiveUsers(callback) {

  UserMongoModel.find({ 'flags.online': true  },
  'username usernameLower title profile.avatar', {sort: {'lastActivity': -1} },
  function (err, docs) {

      // TODO: Handle error
      if (docs) {
        callback(docs);
      }

    }
  );
}

function setUserOnlineStatus(username, bool, callback) {
  UserMongoModel.findOneAndUpdate({usernameLower: username.toLowerCase()},
  {'flags.online': bool }, function(err, user) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      } else if (!user) {
        result = {
          code    : 400,
          message : 'User not found.'
        };
      }
      callback(result);
    }
  );
}

function getUserOnlineStatus(username, callback) {
  UserMongoModel.findOne({usernameLower: username.toLowerCase()},'flags.online',
    function(err, user) {
      var result;
      if (err) {
        result = {
          code    : 500,
          message : 'Something went wrong in the database.'
        };
        console.error(err);
      } else if (!user) {
        result = {
          code    : 400,
          message : 'User not found.'
        };
      }
      callback(result, user.flags.online);
    }
  );
}


var UserModel = {
  login: logInUser,
  create: createUser,
  get: getUser,
  getProfile: getUserProfile,
  getAllMembers: getAllMembers,
  changeTitle: changeUserTitle,
  updateActivity: updateLastActivity,
  getActiveUsers: getActiveUsers,
  changeProfile: changeUserProfile,
  getAvatar: getUserAvatar,
  getTitle: getUserTitle,
  stockAvatarsList: STOCKAVATARS,
  setOnlineStatus: setUserOnlineStatus,
  getOnlineStatus: getUserOnlineStatus
};

module.exports = UserModel;
