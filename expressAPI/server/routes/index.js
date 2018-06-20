const express = require('express');
let chirpsRouter = require('./chirps');
let router = express.Router();

router.use('/chirps', chirpsRouter);

module.exports = router;