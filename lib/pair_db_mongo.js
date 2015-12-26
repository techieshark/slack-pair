var MongoClient = require('mongodb').MongoClient;
var MongoPairList = require('./mongo_pair_list.js');


function PairDbMongo () {
  this.dbUrl = process.env.MONGO_URL;
  if (!this.dbUrl || this.dbUrl === '') {
    throw "Missing MONGO_URL environment variable needed by Pair to run on Mongo DB.";
  }

  this.slack_token = process.env.SLACK_TOKEN;
  if (!this.slack_token || this.slack_token === '') {
    throw "Missing SLACK_TOKEN environment variable needed by Pair to run on Mongo DB.";
  }
}


PairDbMongo.prototype.getPairList = function () {
  return new MongoPairList(this.database, this.slack_token);
};


PairDbMongo.prototype.connect = function(callback) {
  var that = this;
  MongoClient.connect(this.dbUrl, function(err, database) {
    that.database = database;
    callback(err);
  });
};


module.exports = PairDbMongo;