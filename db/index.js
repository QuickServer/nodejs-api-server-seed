var sql = require('mssql');
var redis = require('redis');
var config = require('config');
var appDbConfig = config.get('db').appDb;
var redisConfig = config.get('db').redis;

//Connection pool
var sqlCP = new sql.ConnectionPool(appDbConfig);
var redisClient = redis.createClient(redisConfig);
var dbs = {
    sql: sqlCP,
    redis: redisClient
}

//SQL error handler
sql.on('error', err => {
    console.log('Error in connecting sql server');
});

//Redis error handler
dbs.redis.on('error', function (err) {
    console.log('Error: Redis server down');
});
//Redis ready state handler
dbs.redis.on('ready', function () {
    console.log('Connected to Redis.');
});

module.exports = dbs;