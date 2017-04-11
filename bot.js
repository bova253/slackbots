var slack,
    config = require('./config'),
    listenFor = config.listenFor,
    request = require('request'),
    qs = require('querystring'),
    _ = require('lodash');

commands = {
    google: function (channel, args) {
        // var queryString = args.join(' ');
        console.log("Google query: " + args);
        var createdLink = "http://lmgtfy.com/?" + qs.stringify({q: args});
        console.log(createdLink);
        channel.send(createdLink);
    },

    //make sure to set env "wu_token"
    weather: function (channel, args) {
        if(process.env.wu_token == undefined) {
            console.log("ERROR: No weather underground api key set!");
        } else {
            var baseUrl = "http://api.wunderground.com/api/" + process.env.wu_token;
            var forecastUrl =  baseUrl + "/forecast/q/MA/Boston.json";
            var tempUrl = baseUrl + "/hourly/q/MA/Boston.json";

            var todaysForecast, todaysTemp;

            var done = _.after(2, function() {

                if(todaysForecast != undefined ) {
                    channel.send(todaysForecast);
                }
                if(todaysTemp != undefined) {
                    channel.send(todaysTemp);
                }
            });

            // get forecast
            request(forecastUrl,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var weatherResp = JSON.parse(body);
                        todaysForecast = "Today's forecast: " + weatherResp.forecast.txt_forecast.forecastday[0].fcttext;
                        console.log(todaysForecast);
                        done();
                    } else if (error) {
                        console.log("ERROR: Problem retrieving weather forecast!");
                        console.log(error);
                        channel.send("Problem retrieving weather forecast!")
                    }
                });

            //get temp
            request(tempUrl,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var weatherResp = JSON.parse(body);
                        todaysTemp = "Temp: *" + weatherResp.hourly_forecast[0].temp.english +
                            "F*, Feels like: *" + weatherResp.hourly_forecast[0].feelslike.english +
                            "F*, Condition: " + weatherResp.hourly_forecast[0].condition;
                        console.log(todaysTemp);
                        done();
                    } else if (error) {
                        console.log("ERROR: Problem retrieving temperature!");
                        console.log(error);
                        channel.send("Problem retrieving temperature!")
                    }
                });


        }
    }
};

//make sure to set env "token", which is the slack api token you wish to use.
(function () {
    "use strict";
    var Slack = require('slack-client');

    var slackToken = process.env.token;
    var autoReconnect = true;
    var autoMark = true;

    try {
        slack = new Slack(slackToken, autoReconnect, autoMark);
        slack.on('open', function () {
            console.log('Connected');
        });


        slack.on('message', function (message) {
            var botId = slack.self.id;
            if (message != undefined && message.text != undefined && message.text.includes('@' + botId)) {
                var channel = slack.getChannelGroupOrDMByID(message.channel);
                var body = message.text.replace('<@' + botId + '>', '').trim();
                var fromUser = slack.getUserByID(message.user);
                console.log('body:' + body);
                var tokens = body.split(' '),
                    command = tokens[0].toLowerCase(),
                    args = tokens.splice(1).join(' ');

                if (command in commands) {
                    commands[command](channel, args, fromUser);
                }
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