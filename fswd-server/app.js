require('dotenv').config();
var expressWinston = require('express-winston'),
    winston = require('winston'),
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    users = require('./routes/users'),
    recordingRoute = require('./routes/recordingRouter'),
    settingRoute = require('./routes/settingRouter'),
    energyRoute = require('./routes/energyRouter'),
    mongoose = require('mongoose'),
    myLogger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                expressFormat: true,
                colorize: true
            })
        ]
    });

/* istanbul ignore next */
myLogger.transports.console.level = process.env.LOGGING || 'warn';

mongoose.connect(process.env.MONGODB_URI);
myLogger.debug("mongo URI :", process.env.MONGODB_URI);
// myLogger.debug("env vars:", process.env);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    myLogger.info("Connected correctly to server");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Place the express-winston logger before the router.
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        })
    ]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/recordings', recordingRoute);
app.use('/settings', settingRoute);
app.use('/energy', energyRoute);

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        }),
    ]
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

/* istanbul ignore next */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
/* istanbul ignore next */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
