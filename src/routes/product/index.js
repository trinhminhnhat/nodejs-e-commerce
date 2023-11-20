'use strict';

const express = require('express');

const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');

const router = express.Router();

// create product
router.post('/', asyncHandler(productController.create));

// get all draft products
router.get('/drafts', asyncHandler(productController.getAllDraftProducts));

module.exports = router;
