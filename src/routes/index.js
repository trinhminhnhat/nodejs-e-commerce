'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// Middleware check apiKey
router.use(apiKey);
// Middleware check permission
router.use(permission('0000'));

router.use('/v1/api/auth', require('./access'));
router.use('/v1/api/products', require('./product'));

module.exports = router;
