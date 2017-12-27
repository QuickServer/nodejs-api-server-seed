var express = require('express');
var router = express.Router();
router.use('/logs', require('./logs'));
module.exports = router;