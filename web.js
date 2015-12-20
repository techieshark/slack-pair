// web.js
var _ = require('lodash');
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var request = require('pr-request');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logfmt.requestLogger());

var users = [];

function setof(status, users) {
 return _.filter(users, { 'status': status }).map(function(user) {
   return ">*" + user.username + "*: " + user.comment;
 }).join('\n');
}

var help = 'Usage:\t /pair [yes|ok|no <your project here>]';

function getCurrentPairStatus(users) {
  var status = '', yes, no, ok;

  yes = setof('yes', users);
  ok = setof('ok', users);
  no = setof('no', users);


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
  if (status == '') {
    status = 'No one up for pairing (yet!). Pair up, yo.\n' + help;
  } else {
    status += '\n' + help + '\n---------------------- Pair up, yo. (Go find \'em!) ----------------------\n';
  }
  return status;
}

app.post('/', function(req, res) {
  var hasArgs = req.param('text').length > 0;
  var args = req.param('text').toLowerCase().split(' '),
      command = req.param('command'),
      username = req.param('user_name'),
      acceptable = ["yes", "ok", "no"];

    console.log('args');
    console.log(args);

    if (hasArgs) {
      if (_.contains(acceptable, args[0])) {
        var comment = args.slice(1).join(' ');
        user = _.find(users, {'username': username});
        if (user) {
          user.status = args[0];
          user.comment = comment;
        }
        else {
          users.push({'username': username, 'status': args[0], 'comment': comment});
        }
        console.log(users);
        // People want confirmation that we got their status, so show it and everyone else's:
        var status = 'Your pairing status was set to: ' + args[0] + '\n';
        status += getCurrentPairStatus(users);
        res.send(status);
      } else {
        res.send('Close but no cigar. What is this command, "' + args[0] + '", that you speak of?\n' + help);
      }
    }
    else {
      var status = getCurrentPairStatus(users);
      console.log(status)
      res.send(status);
    }
});

app.get('/keepalive', function (req, res) {
  console.log('pong');
  res.send(Date.now()+'');
})

function keepalive() {
  request(process.env.PAIRBOT_URL + '/keepalive')
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log("PAIR URL: " + process.env.PAIRBOT_URL);
  setInterval(keepalive, 60e3);
});
