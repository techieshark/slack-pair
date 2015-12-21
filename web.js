// web.js
var _ = require('lodash');
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var request = require('request');


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

var help = 'Usage:\t `/pair [yes|ok|no <your project here>]` or `/pair` alone to see who is free.';

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
  if (status === '') {
    status = 'No one up for pairing (yet!). Pair up, yo.\n';
  } else {
    status += '\n Pair up, yo. (Go find \'em!) \n';
  }
  return status;
}

function validToken(token) {
  if (token == process.env.SLACK_TOKEN) {
    console.log('Slack token verified');
    return true;
  } else{
    console.log('Slack token does not match stored token, if present.');
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
        console.log(body);
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

    console.log('args');
    console.log(args);

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
          user = _.find(users, {'username': username});
          if (user) {
            user.status = status;
            user.comment = comment;
          }
          else {
            user = {'username': username, 'status': status, 'comment': comment};
            users.push(user);
          }
          console.log(users);
          // People want confirmation that we got their status, so show it and everyone else's:
          notification = 'Your pairing status was set to: ' + status + '\n';
          notification += getCurrentPairStatus(users);
          res.send(notification);

          // notify pairing channel if environment vars are provided and status is yes/ok
          if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_PAIR_CHANNEL &&
              status === 'yes' || status === 'ok') {
            notifyChannel(user.username + " says '" + user.status + "' to pairing" + (user.comment ? " (" + user.comment + ")" : "" ) + "! Go pair!");
          }
        } else {
          res.send('Close but no cigar. What is this command, "' + args[0] + '", that you speak of?\n' + help);
        }
      }
      else {
        status = getCurrentPairStatus(users);
        console.log(status);
        res.send(status);
      }
    }
});

app.get('/keepalive', function (req, res) {
  console.log('pong');
  res.send(Date.now()+'');
});

function keepalive() {
  request(process.env.PAIRBOT_URL + '/keepalive');
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log("PAIR URL: " + process.env.PAIRBOT_URL);
  console.log("SLACK_TOKEN: " + process.env.SLACK_TOKEN);
  console.log("SLACK_WEBHOOK_URL: " + process.env.SLACK_WEBHOOK_URL);
  console.log("SLACK_PAIR_CHANNEL: " + process.env.SLACK_PAIR_CHANNEL);
  setInterval(keepalive, 60e3);
});
