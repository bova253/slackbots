var slack,
    config = require('./config'),
    listenFor = config.listenFor;

(function () {
    "use strict";
    var Slack = require('slack-client');
    var qs = require('querystring');

    var slackToken = process.env.token;
    var autoReconnect = true;
    var autoMark = true;

    try {
        slack = new Slack(slackToken, autoReconnect, autoMark);
        slack.on('open', function () {
            console.log('Connected');
        });


        slack.on('message', function (message) {
            // if(listenFor.test(message.text)) {
            var botId = slack.self.id;
            if (message != undefined && message.text != undefined && message.text.includes('@' + botId)) {
                var channel = slack.getChannelGroupOrDMByID(message.channel);
                var body = message.text.replace('<@' + botId + '>', '').trim();
                console.log('body:' + body);
                if (body) {

                } else {

                }
                var fromUser = slack.getUserByID(message.user);
                var createdLink = "http://lmgtfy.com/?" + qs.stringify({q: body});
                console.log(createdLink);
                channel.send(createdLink);
            }
        });

        var numRetries = 0;
        slack.on('error', function (err) {
            console.dir(err);
            console.log("number of retries to reconnect: " + numRetries);
            if (numRetries < 5) {
                slack.login();
                numRetries++;
            }

        });

        slack.login();
    } catch (e) {
        console.log("Uh oh, slack blew up for some reason.");
        console.log(e);
        slack.login();
    }

})();