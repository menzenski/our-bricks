var express = require('express'),
    colors = require('colors');
    mon = require('mongoman'),
    expressJson = require('express-json'),
    bodyParser = require('body-parser');

// app-internal modules
var routes = require('./api/routes'),
    err = require('./api/lib/error');

// export the server for testing
module.exports = startServer;

// if testing, don't run setup functions
// (if run as a module, not from the command line)
if (require.main !== module) {
    return;
}

// DATABASE SETUP
mon.goose.connection.on('open', function(ref) {
    console.log('\n  Connected to mongo server.\n'.blue);

    // register all models
    mon.registerAll(__dirname + 'api/components', /_model$/i);

    // execute the server startup
    startServer();
});
mon.goose.connection.on('error', function(err) {
    console.log('\n  Could not connect to mongo server.\n  '.red +
                'Try running `[sudo] mongod` in another terminal.\n'.red);
    process.kill();
});
mon.connect(/* pass in database URI on the live server */);

// SERVER SETUP
// allow log suppression for testing
function startServer(portOverride, suppressLogs) {
    var server = express();

    // load the config.json file from the current directory
    server.config = require('config.json')();

    // apply middleware
    server.use(expressJson());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());

    // deliver static files defined in config.json
    for (dir in server.config.staticMap) {
        server.use(dir, express.static(__dirname +
                   server.config.staticMap[dir]));
    }

    // prime routes to set headers and logout route details
    server.use(function init(req, res, next) {
        // set response headers used in each request
        res.set({
            // the server will always return JSON
            'Content-Type': 'application/json'
        });
        // log the request, if logging isn't suppressed
        if (!suppressLogs) {
            console.log('  ' + (req.method).cyan.dim +
                        ' ' + (req.url).grey.dim);
        }
        return next();
    });

    // register API routes
    routes.register(server);

    // register error handler
    server.use(err.errorHandler);

    // home should return our angular app (index.html)
    server.get('/', function(req, res) {
        // respond with html for this one
        res.set({'Content-Type': 'text/html; charset=utf-8'});

        // log the request and send the application file
        if (!suppressLogs) {
            console.log('  ' + (req.method).cyan.dim +
                        ' ' + (req.url).grey.dim);
        }
        res.sendFile(__dirname + '/dist/index.html');
    });

    var finalPort = portOverride || server.config.port;
    server.listen(finalPort);

    if (!suppressLogs) {
        console.log('\n  Listening on port'.green +
                    (finalPort + '').blue + '\n');
    }

    return server;
}
