'use strict';

const express = require('express');

const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Login
router.post('/shop/login', asyncHandler(accessController.login));
// signUp
router.post('/shop/sign-up', asyncHandler(accessController.signUp));

// Authentication
router.use(authentication);

// Logout
router.post('/shop/logout', asyncHandler(accessController.logout));

router.post('/shop/handle-refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
