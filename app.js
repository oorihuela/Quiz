var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function (req, res, next) {
    // guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas

    res.locals.session = req.session;
    next();
});

// Mecanismo de autologout después de inactividad de 2 minutos
app.use(function (req, res, next) {

    req.session.sessionTimeOut = 120000; // Almacenamos en una variable el valor de expiración de la sesion

    if(req.session.user){ // si existe sesion
        if(!req.session.ultimoclick){ // No existe registro de ultimo click, lo creamos
            req.session.ultimoclick = (new Date()).getTime();
        }else{
            if ((new Date()).getTime() - req.session.ultimoclick > req.session.sessionTimeOut) { // Si ha pasado más tiempo del definido en req.session.sessionTimeOut, eliminamos la sesión
                delete req.session.user;     // eliminamos el usuario
                delete req.session.ultimoclick;    // eliminamos la marca de tiempo
            }else{ // Si ha pasado menos tiempo del definido en req.session.sessionTimeOut, actualizamos el valor del registro del último click
                req.session.ultimoclick = (new Date()).getTime();
            }
        }
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
