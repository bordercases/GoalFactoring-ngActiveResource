var express    = require('express');
var app        = module.exports = express();

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var db         = require('./lib/mongooseModels');
var facultyAPI = require('faculty-api'); // replacing with mers; keeping around because it's quick and easy to test with
var mers       = require('mers');
var path       = require('path');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

/* create restful payload from mers format */
var BufferedJSONStream = require('./lib/mers/streams').BufferedJSONStream, util = require('util');
//subclass BufferedJSONStream
var RestLikeJSONStream = function(){
    BufferedJSONStream.apply(this, arguments);
}
util.inherits(RestLikeJSONStream, BufferedJSONStream);
//overwrite format;
RestLikeJSONStream.prototype.format = function(send){
    return JSON.stringify(send.payload);
}

app.use(methodOverride());
app.use(bodyParser());
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, '../bower_components/')));
app.use(express.static(path.join(__dirname, '../lib/')));
app.use(express.static(path.join(__dirname, '../dist/')));
app.use(express.static(path.join(__dirname, '../app')));
app.use('/api',mers({responseStream: RestLikeJSONStream, uri:'mongodb://localhost/goalfactor_db'}).rest());
//app.use(express.static(path.join(__dirname, '../example')));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

/*
facultyAPI.addResource({
  app: app,
  resourceName: 'systems',
  collection: db.system
});

facultyAPI.addResource({
  app: app,
  resourceName: 'sensors',
  collection: db.sensor
});


facultyAPI.addResource({
  app: app,
  resourceName: 'post',
  collection: db.post
});

facultyAPI.addResource({
  app: app,
  resourceName: 'comment',
  collection: db.comment
});
*/
/*
facultyAPI.addResource({
    app: app,
    resourceName: 'session',
    collection: db.session
});

facultyAPI.addResource({
    app: app,
    resourceName: 'node',
    collection: db.node
});

facultyAPI.addResource({
    app: app,
    resourceName: 'edge',
    collection: db.edge
});

facultyAPI.addResource({
    app: app,
    resourceName: 'graph',
    collection: db.graph
});
*/

app.set('port', process.env.PORT || 3000);

