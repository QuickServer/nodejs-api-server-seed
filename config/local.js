// API server Settings
var p = require('./../package.json');
var version = p.version.split('.').shift();
var defer = require('config/defer').deferConfig;
module.exports = {
  api: {
    API_ROOT_URI: '/api',
    API_BASE_URI: defer(function (cfg) {
      return cfg.api.API_ROOT_URI + (version > 0 ? '/v' + version : '');
    })
  },
  db: {
    appDb: {
      user: 'amreesh',
      password: '123123#',
      server: 'my-sql-server',
      database: 'testdb',
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    },
    redis: {
      host: 'localhost',
      port: 6379,
      database: '2'//,
      // user: 'redis_admin',
      //password: 'bat777bat'
    }
  },
  env: {
    mode: 'development',
    host: process.env.HOST || 'localhost',
    port: 8087
  }
};