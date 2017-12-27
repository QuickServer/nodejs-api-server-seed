var config = require('config');
var env = config.get('env');
module.exports = {
    prepareError: function (data) {
        var responseError = {
            error: {
                code: data.error.code,
                message: data.error.message,
                reason:data.error.reason,
            }
        };

        if (env.mode !== 'production') {
            responseError.error.stack = data.error.stack;
            responseError.error.stack.trace = data.error.stack.stack;
        }
        return responseError;
    }
};