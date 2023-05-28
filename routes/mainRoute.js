const express = require('express');
const router = express.Router();

router.use('/data',require('./dataRoute'));
router.use('/auth',require('./authRoute'));

module.exports = router;