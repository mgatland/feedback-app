"use strict"

process.title = 'feedback-app'
var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html')
});

app.post("/feedback", function (req, res) {
    console.log("new feedback: ")
    console.log(req.body)
    sendEmail(req.type, req.text)
    res.send("ok")
});

var sendEmail
var sendgrid_api_key = process.env.sendgrid_api_key
if (sendgrid_api_key) {
    var sendgrid  = require('sendgrid')(sendgrid_api_key)
    var sendEmail = function (type, message) {
        sendgrid.send({
          to:       'Matthew Gatland <support@matthewgatland.com>',
          from:     'Caves Feedback <hi+caves@mgatland.com>',
          subject:  'Feedback: ' + type,
          text:     message
        }, function(err, json) {
          if (err) { return console.error(err) }
          console.log(json)
        });
    }
} else {
    sendEmail = function (message) {
        console.log("(email is disabled)")
    }
}

app.listen(port)
console.log("listening on port " + port)