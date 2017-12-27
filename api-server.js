
// require('@risingstack/trace');
var pmx = require('pmx').init({
  http: true, // HTTP routes logging (default: true)
  ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors: true, // Exceptions loggin (default: true)
  custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network: true, // Network monitoring at the application level
  ports: true  // Shows which ports your app is listening on (default: false)
});

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var path = require('path');
var validator = require('express-validation');
var logger = require('morgan');
var config = require('config');
var HttpError = require('standard-http-error');
var version = require('version-healthcheck');
var versionRoutes = require('versioned-express-route');

//Get config settings
var env = config.get('env');

//Generic express settings
var app = express();
app.locals.lang = 'en';
app.locals.appName = 'ATS-APIServer';
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pmx.expressErrorHandler());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//Route mapping
var baseURI=config.get('api.API_BASE_URI');
var vroutes=versionRoutes(
  path.join(__dirname, './routes'),
  ['v1','v2']
);
app.use(baseURI, vroutes);

app.get('/version',version);

//db connection pools mapping
app.dbs = require('./db');

//Error handlers
var errorUtil = require('./helpers/error-util');
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {

  var errorData = {};

  if (err instanceof validator.ValidationError) {
    var validationError = {
      error: {
        code: err.status,
        message: err.message,
        stack: err
      }
    };
    if (err.action) {
      validationError.error.action = err.action;
    }
    if (err.reason) {
      validationError.error.reason = err.reason;
    }
    errorData = errorUtil.prepareError(validationError);
    res.status(err.status || 500);
    return res.send(errorData);
  }

  if (!(err instanceof HttpError)) {
    var basicError = {
      error: {
        code: err.status,
        message: err.message,
        stack: err
      }
    };

    if (err.action) {
      basicError.error.action = err.action;
    }
    if (err.reason) {
      basicError.error.reason = err.reason;
    }
    errorData = errorUtil.prepareError(basicError);
    res.status(err.status || 500);
    return res.send(errorData);
  }

  var httpError = {
    error: {
      code: err.ecode || err.code,
      message: err.message,
      stack: err
    }
  };

  if (err.action) {
    httpError.error.action = err.action;
  }
  if (err.reason) {
    httpError.error.reason = err.reason;
  }
  errorData = errorUtil.prepareError(httpError);
  res.status(err.code || 500);
  return res.send(errorData);
});

//Connect the pool and start web server when pool is connected
app.dbs.sql.connect().then(function () {
  console.log('Connection pool ready with SQL server');
  var server = app.listen(env.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('ATS - API server running at http://%s:%s', host, port);
  });
}).catch(function (err) {
  console.error('Error while creating connection pool', err);
});