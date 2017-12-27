var sql = require('mssql');
var HttpError = require('standard-http-error');
var errorCodes = require('../errors');
var regexUtil = require('../helpers/regex-util');

module.exports = function (dbs) {
    var me = {
        get: function (req, res, next) {
            if (!regexUtil.isEmail(req.query.email)) {
                throw new HttpError(422, 'Invalid email.', { reason: errorCodes.invalid_email, stack: 'No or invalid email.' });
            }
            var request = new sql.Request(dbs.sql);
            request.query('SELECT TOP (10) * FROM Nlog', function (err, recordset) {
                if (err) {
                    next(new HttpError(500, errorCodes.internal_server_error, { stack: err }));
                }
                res.status(200).json(recordset);
            });
        }
    };

    return me;
};