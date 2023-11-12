'use strict';

const express = require('express');

const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');

const router = express.Router();

// Login
router.post('/shop/login', asyncHandler(accessController.login));
// signUp
router.post('/shop/sign-up', asyncHandler(accessController.signUp));

module.exports = router;
