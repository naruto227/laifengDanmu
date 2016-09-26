var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var eventEmitter = require('events').EventEmitter;
var myEvents = new eventEmitter();
var cheerio = require('cheerio');

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var rule1 = new schedule.RecurrenceRule();
var routes = require('./routes/index');
var users = require('./routes/users');

var lf = require('./models/LaiFeng');
var config = require('./config');
var request = require("request");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var rooms = [];
 var times = [];
 myEvents.on("laifeng", function (room) {
    new lf(room);
});
 request('http://120.27.94.166:2999/getRooms?platform=laifeng&topn=' + config.topn, function (error, response, body) {
    if (error) {
        return console.log(error);
    }
    var parse = JSON.parse(body);
    for (var i = 0; i < parse.data.length; i++) {
        var roomId = parse.data[i].room_id;
        rooms.push(roomId);
    }

    rule.second = times;
    for (var i = 0; i < 60; i++) {
        times.push(i);
    }

    // console.log("-------------");
    var count = 0;
    schedule.scheduleJob(rule, function () {
        if (count >= rooms.length) {
            this.cancel();
            return;
        }
        myEvents.emit("laifeng", rooms[count++]);
    });

});
/*var times1 = [];
rule1.hour = times1;
for (var i = 0; i < 24; i = i + 4) {
    times1.push(i);
}
// schedule.scheduleJob(rule1, function () {
//     console.log(new Date());

    var options = {
        method: 'GET',
        url: 'http://www.laifeng.com/center',
        qs: {pageNo: '1'},
    };

    request(options, function (error, response, body) {
        if (error) return console.log(error.message);
        var $ = cheerio.load(body);
        var name = $(".user-list .name a").toArray();
        var rooms = [];
        for (var i = 0; i < name.length; i++) {
            var href = name[i].attribs.href;
            var room_id = href.substring(21, href.length);
            rooms.push(room_id);
        }
        console.log("rooms:" + rooms);
        // if (rooms.length >= 120) {

        /!*var options1 = {
            method: 'POST',
            url: 'http://120.27.94.166:2999/insertCR',
            body: {
                platform: 'laifeng',
                rooms: rooms
            },
            json: true
        };

        request(options1, function (error, response, body) {
            if (error)  return console.log(error.message);

            console.log(body);
        });*!/
        var times = [];

        // myEvents.on("laifeng", function (room) {
        // });

        for (var i = 0; i < 60; i++) {
            times.push(i);
        }
        rule.second = times;
        // console.log("-------------");
        var count = 0;
        schedule.scheduleJob(rule, function () {
            if (count >= rooms.length) {
                this.cancel();
                rooms = [];
                return;
            }
            new lf(rooms[count++]);

            // myEvents.emit("laifeng", rooms[count++]);
        });

        // }
        // console.log(body);
    });*/
// });

module.exports = app;
