// web.js
var _ = require('lodash');
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var request = require('pr-request');


var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(logfmt.requestLogger());

var users = [];

function setof(status, users) {
 return _.filter(users, { 'status': status }).map(function(user) {
   return "\t" + user.username + ": " + user.comment;
 }).join('\n');
}

function getCurrentPairStatus(users) {
  var status = '', yes, no, ok;
  
  yes = setof('yes', users);
  ok = setof('ok', users);
  no = setof('no', users);


  if (yes.length > 0) {
    status = 'Yes! Someone should come find me now. Let\'s pair:\n';
    status += yes;
  }
  if (ok.length > 0 ) {
    status += '\n\nOk. I\'m working but feel free to interrupt me:\n';
    status += ok;
  }
  if (no.length > 0 ) {
    status += '\n\nNope. Do Not Disturb:\n';
    status += no;
  }
  if (status == '') {
    status = 'Got nothing. Go ahead and: \n\t /pair yes|ok|no <what you want to do with fun people>';
  }
  return status;
}

app.post('/', function(req, res) {
  var hasArgs = req.param('text').length > 0;
  var args = req.param('text').split(' ').map(function(i){return i.toLowerCase();}),
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
  request(process.env.CHATBOT_URL + '/keepalive')
}

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
  setInterval(keepalive, 60e3);
});
