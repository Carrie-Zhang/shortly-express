const models = require('../models');
const Promise = require('bluebird');


let createSessionCookie = function(req, res, next) {
  return models.Sessions.create()
  .then(function(results) {
    return models.Sessions.get({id: results.insertId});
  })
  .then(function(session) {
    req.session = session;
    res.cookie('shortlyid', session.hash);
    req.cookies = {shortlyid: {value: session.hash}};
    //console.log(req.cookies);
    next();
  });
}

module.exports.createSession = (req, res, next) => {
  let cookie = req.cookies;
  //console.log('cookie: ', cookie);
  if (cookie && Object.keys(cookie).length) {
    let cookieHash = cookie.shortlyid;
    return models.Sessions.get({hash: cookieHash})
    .then(result => {
      req.session = result;
      req.session.hash = cookie;
      next();
    }).catch(err => {
      //console.log(err);
      createSessionCookie(req, res, next);
    })
  } else {
    createSessionCookie(req, res, next);
  }
};
// check the cookie does exist or not:
  // if exist, get the parsed cookie
    // grab the user info based on the cookie,
    // and set to session
  // if not, create a new session in the db
/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// module.exports.verifySession = (req, res, next) => {
//   models.Sessions.isLoggedIn
// }
