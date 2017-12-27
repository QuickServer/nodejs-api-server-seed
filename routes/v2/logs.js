var express = require('express');
var router = express.Router();
var sql = require('mssql');
var HttpError = require('standard-http-error');
var errorCodes = require('../../errors');
var regexUtil = require('../../helpers/regex-util');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time V2: ', Date.now())
    next()
})

router.get('/getAllLogs', function (req, res, next) {
    if (!regexUtil.isEmail(req.query.email)) {
        throw new HttpError(422, 'Invalid email.', { reason: errorCodes.invalid_email, stack: 'No or invalid email.' });
    }
    var request = new sql.Request(req.app.dbs.sql);
    request.query('SELECT TOP (10) * FROM Nlog', function (err, recordset) {
        if (err) {
            next(new HttpError(500, errorCodes.internal_server_error, { stack: err }));
        }
        res.status(200).json(recordset);
    });
})

router.get('/getLogById', function (req, res) {
    res.send('Logs by id')
})

module.exports = router



// module.exports = function (dbs) {
//     var me = {
//         get: function (req, res, next) {

//         }
//     };

//     return me;
// };