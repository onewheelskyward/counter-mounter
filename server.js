/*
 Automatic Pancake
 */
var express = require('express');
var busboy = require('connect-busboy');
// var exec = require('child_process').exec;
var app = express();
var bodyParser = require('body-parser');
var config = require('./config.json');
var superagent = require('superagent');

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

app.get('/:bridge/:date/update', function (req, res) {
    var uri = 'http://www.eco-public.com/api/h7q239dd/data/periode/';
    var bridgeId;

    switch (req.params.bridge) {
        case 'tilikum':
            bridgeId = '24559';
            console.log('Tilikum update ' + req.params.date)
            break;
        case 'hawthorne':
            bridgeId = '05157';
            console.log('Hawthorne update ' + req.params.date)
            //Statements executed when the result of expression matches value2
            break;
        default:
            //Statements executed when none of the values match the value of the expression
            req.send(404);
    }
    // Tilikum 1000 all, 1010 Westbound, 1020 Eastbound
    // http://www.eco-public.com/api/h7q239dd/data/periode/101024559/?begin=20150911&end=20160422&step=4
    // http://www.eco-public.com/api/h7q239dd/data/periode/102024559/?begin=20150911&end=20160422&step=4
    // http://www.eco-public.com/api/h7q239dd/data/periode/100024559?begin=20150911&end=20160422&step=4

    // Hawthorne
    // http://www.eco-public.com/api/h7q239dd/data/periode/101005157/?begin=20150911&end=20160422&step=4
    // http://www.eco-public.com/api/h7q239dd/data/periode/102005157/?begin=20150911&end=20160422&step=4
    // http://www.eco-public.com/api/h7q239dd/data/periode/100005157?begin=20150911&end=20160422&step=4
    superagent
        .get(uri + '/1010' + bridgeId)
        .query({begin: req.params.date, end: req.params.date, step: 2})
        .end(function(err, res){
            res.body.forEach(function(item) {
                console.log(item);
            })
    });

    // superagent
    //     .get(uri + '/1020' + bridgeId)
    //     .query({begin: req.params.date, end: req.params.date, step: 2})
    //     .end(function(err, res){
    //         console.log(res.body);
    // });
    console.log(req.params.date);
    res.send(req.params.date);
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
