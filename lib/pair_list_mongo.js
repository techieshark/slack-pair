
var PairList = require('./pair_list.js'),
    assert = require('assert'),
    debug = require('debug')('pair_list_mongo');


var pairCollection = 'pair';

// Create a pair list backed by a connected MongoDB database
function PairListMongo (db, slack_token) {
  assert(db);
  assert(slack_token);
  this._db = db;
  this._token = slack_token;

  PairList.call(this);
}

PairListMongo.prototype = Object.create(PairList.prototype);
PairListMongo.prototype.constructor = PairListMongo;


// fetch list initially
PairListMongo.prototype.fetch = function (callback) {
  var pairList = this;
  var cursor = this._db.collection(pairCollection).find({"slack_token": this._token}).limit(1);
  cursor.toArray(function(err, documents) {
    assert.equal(err, null);
    if (documents !== null) {
      assert(documents.length < 2);
      var list;
      if (documents.length === 1 && documents[0].users instanceof Array) {
        list = documents[0].users;
        debug("db found users list:");
        debug(list);
        debug("docs:");
        debug(documents);
      } else {
        list = [];
      }
      pairList._pairs = list;
      assert(pairList._pairs instanceof Array);

      callback(null, pairList);
    } else {
      callback("No userlist found.");
    }
  });
};


PairListMongo.prototype.update = function (username, status, comment, callback) {
  // call PairList update first, then save to database
  pairList = this;
  assert(this._pairs instanceof Array);
  Object.getPrototypeOf(PairListMongo.prototype).update.call(this,
    username, status, comment,
    function (err, data) {
      if (err) throw err;
      pairList._save(data, callback);
    });
};


PairListMongo.prototype._save = function (data, callback) {
  var list = data.pairs;
  var user = data.user;
  debug("saving data:");
  debug(data);
  this._db.collection(pairCollection).updateOne(
    { "slack_token": this._token },
    { // perhaps we could just update the one user, but for small lists this s/be ok
      "slack_token": this._token,
      "users" : list
    },
    { upsert: true },
    function (err, result) {
      assert.equal(err, null);
      debug("Updated MongoDB w/ slack pairs: ");
      debug(list);
      callback(null, data);
    }
  );
};


module.exports = PairListMongo;
