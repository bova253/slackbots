# slackbots

Just a custom slackbot that takes a slack api token and a weather underground api key as environment variables.

Usage:

    
    - <@slackbot name> <google OR lmgtfy> <phrase>:  posts a link to www.lmgtfy.com with the aforementioned phrase
    - <@slackbot name> weather <optional location>: posts a text string location's daily weather forecast.  defaults to Boston.
    - <@slackbot name> wiki <thing you want to search wikipedia for>: self explanatory
    - <@slackbot name> define <word or phrase>