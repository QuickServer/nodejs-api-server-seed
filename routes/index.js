module.exports = function (app, dbs) {
    //Required routes handlers
    var logs = require('./logs')(dbs);

    //API endpoints
    app.get('/getLogs', logs.get);
    return app;
}