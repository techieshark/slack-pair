// web.js
var _ = require('lodash');
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var MongoPairList = require('./lib/mongo_pair_list.js');
var debug = require('debug')('pair');

var db;
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logfmt.requestLogger());

var help = 'Usage:\t `/pair [yes|ok|no <your project here>]` or `/pair` alone to see who is free.';

function validToken(token) {
  if (token == process.env.SLACK_TOKEN) {
    debug('Slack token verified');
    return true;
  } else{
    debug('Slack token does not match stored token, if present.');
    return false;
  }
}

function notifyChannel(text) {
  payload = {
    "channel": process.env.SLACK_PAIR_CHANNEL,
    "username": "pair",
    "text": text,
    "icon_url": "http://s8.postimg.org/kmlmmglid/noun_19161_cc.png" // thx @ainsleywagon, https://thenounproject.com/term/pair/19161/
  };

  request.post({
      uri: process.env.SLACK_WEBHOOK_URL,
      body: JSON.stringify(payload),
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        debug(body);
      } else if (error) {
        console.error("Error posting to channel: " + error);
      }
    }
  );
}


app.post('/', function(req, res) {
  var hasArgs = req.body.text.length > 0;
  var args = req.body.text.toLowerCase().split(' '),
      command = req.body.command,
      username = req.body.user_name,
      token = req.body.token,
      acceptable = ["yes", "ok", "no"];
  var user, status, notification;
  var pairList;

    debug('args');
    debug(args);

    if (!validToken(token)) {
      res.send('Invalid Slack token. Ensure that the correct Slack integration token is set as the SLACK_TOKEN env var.');
    } else {
      if (hasArgs) {
        if (args[0] === 'help') {
          // send help
          res.send(
            {
              "response_type": "ephemeral",
              "text": help + "\n" +
                "Full documentation <https://github.com/techieshark/slack-pair|on Github>.",
            });
        } else if (_.contains(acceptable, args[0])) {
          var comment = args.slice(1).join(' ');
          status = args[0];

          // get pairList from DB
          pairList = new MongoPairList(db, process.env.SLACK_TOKEN);
          pairList.fetch(function (err, pairList) {
            pairList.update(username, status, comment, function (err, data) {
              user = data.user; // users = data.users

              // People want confirmation that we got their status, so show it and everyone else's:
              notification = 'Your pairing status was set to: ' + status + '\n';
              notification += pairList.toString();
              res.send(notification);

              // notify pairing channel if environment vars are provided and status is yes/ok
              if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_PAIR_CHANNEL &&
                  (status === 'yes' || status === 'ok')) {
                notifyChannel(user.username + " says '" + user.status + "' to pairing" + (user.comment ? " (" + user.comment + ")" : "" ) + "! Go pair!");
              }
            });
          });
        } else {
          res.send('Close but no cigar. What is this command, "' + args[0] + '", that you speak of?\n' + help);
        }
      }
      else {
        // get pairList from DB
        pairList = new MongoPairList(db, process.env.SLACK_TOKEN);
        pairList.fetch(function (err, pairList) {
          if(err) throw err;
          status = pairList.toString();
          debug(status);
          res.send(status);
        });
      }
    }
});

app.get('/keepalive', function (req, res) {
  debug('pong');
  res.send(Date.now()+'');
});

function keepalive() {
  request(process.env.PAIRBOT_URL + '/keepalive');
}

// Initialize connection once
var dbURL = process.env.MONGO_URL;
if (!dbURL || dbURL === '') {
  console.error("Error: Missing MONGO_URL environment variable.");
  process.exit(1);
}

MongoClient.connect(dbURL, function(err, database) {
  if(err) throw err;

  db = database;

  // Start the application after the database connection is ready
  var port = Number(process.env.PORT || 5000);
  app.listen(port, function() {
    console.log("Listening on " + port);
    console.log("PAIR URL: " + process.env.PAIRBOT_URL);
    console.log("SLACK_TOKEN: " + process.env.SLACK_TOKEN);
    console.log("SLACK_WEBHOOK_URL: " + process.env.SLACK_WEBHOOK_URL);
    console.log("SLACK_PAIR_CHANNEL: " + process.env.SLACK_PAIR_CHANNEL);
    console.log("MONGO_URL: " + process.env.MONGO_URL);
    setInterval(keepalive, 60e3);
  });
});
