var forever = require('forever-monitor');

var child = new (forever.Monitor)('bot.js', {
    silent: false,
    args: []
});

child.start();