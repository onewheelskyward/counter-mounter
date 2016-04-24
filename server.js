/*
 Automatic Pancake
 */
var express = require('express');
var busboy = require('connect-busboy');
// var exec = require('child_process').exec;
var app = express();
var bodyParser = require('body-parser');
var config = require('./config.json');

var r = require('rethinkdbdash')(
    {host: config.db.host, port: config.db.port, database: config.db.database}
);

app.set('port', config.app.port);
app.use(busboy());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', function (req, res) {
    res.send('');
});

app.get('/update/:bridge/:date', function (req, res) {
    console.log(req.params.date);
    res.send(req.params.date);
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
