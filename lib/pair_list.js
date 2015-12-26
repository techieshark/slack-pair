var _ = require('lodash'),
    assert = require('assert'),
    debug = require('debug')('pair_list');


// Simple PairList using an array
function PairList () {
  this._pairs = [];
}

// Fetches (currently no-op), then calls callback
// callback(err, pairList)
PairList.prototype.fetch = function (callback) {
  callback(null, this);
};

function _update (users, username, status, comment) {
  var user = _.find(users, {'username': username});
  if (user) {
    user.status = status;
    user.comment = comment;
  }
  else {
    user = {'username': username, 'status': status, 'comment': comment};
    users.push(user);
  }
  debug("Updated pair list: ");
  debug(users);
  return user;
}


// update the pair list. Calls cb with the user & pairlist that has been updated.
PairList.prototype.update = function (username, status, comment, callback) {
  assert(this._pairs instanceof Array);
  user = _update(this._pairs, username, status, comment);
  callback(null, {user: user, pairs: this._pairs});
};


function setof(status, users) {
 return _.filter(users, { 'status': status }).map(function(user) {
   return ">*" + user.username + "*: " + user.comment;
 }).join('\n');
}


PairList.prototype.toString = function () {
  var status = '', yes, no, ok;

  yes = setof('yes', this._pairs);
  ok = setof('ok', this._pairs);
  no = setof('no', this._pairs);

  if (yes.length > 0) {
    status = '*Yes! Let\'s pair. Come find me now:*\n';
    status += yes;
  }
  if (ok.length > 0 ) {
    status += '\n*Ok. I\'m working but you can interrupt:*\n';
    status += ok;
  }
  if (no.length > 0 ) {
    status += '\n*Nope. Do Not Disturb:*\n';
    status += no;
  }
  if (status === '') {
    status = 'No one up for pairing (yet!). Pair up, yo.\n';
  } else {
    status += '\n Pair up, yo. (Go find \'em!) \n';
  }
  return status;
};

module.exports = PairList;

