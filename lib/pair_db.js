var PairDbMemory = require('./pair_db_memory.js'),
    PairDbMongo = require('./pair_db_mongo.js');
    // PairDbRedis = require('./pair_db_redis.js');

function PairDb () { }

// factory function:
// Decides which PairDb to return based on env var DB_PROVIDER
//
// returns a PairDb with functions:
// .connect(callback) -> connects to database, calls callback when done
// .getPairList() -> fetches pairlist from database
//
PairDb.build = function () {

  var provider = process.env.DB_PROVIDER;
  if (!provider || provider === '') {
    console.error("ERROR: environment variable DB_PROVIDER must be set to `memory`, `mongo`, or `redis`");
    process.exit(1);
  }

  if (provider === 'memory') {
    console.error("WARNING: While using in-memory storage, list won't save across app restarts.");
    Db = PairDbMemory;

  } else if (provider === 'mongo') {
    Db = PairDbMongo;

  } else if (provider === 'redis') {
    throw "Sorry, Redis isn't actually supported yet.";
  }

  try {
    return new Db();
  } catch (e) {
    console.error("ERROR: " + e);
    process.exit(1);
  }

};


module.exports = PairDb;

