var PairList = require('./pair_list.js');

function PairDbMemory() {
    this.pairList = new PairList();
}

// .connect(callback) -> connects to database, calls callback when done
PairDbMemory.prototype.connect = function (callback) {
    // does nothing, we're already connected to memory
    callback(null);
};

// .getPairList() -> fetches pairlist from database
PairDbMemory.prototype.getPairList = function () {
    return this.pairList;
};

module.exports = PairDbMemory;
