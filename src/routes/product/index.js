'use strict';

const express = require('express');

const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// Authentication
router.use(authentication);

// create product
router.post('/', asyncHandler(productController.create));

// publish a product
router.patch('/:id/publish', asyncHandler(productController.publishProductByShop));

// get all draft products
router.get('/drafts', asyncHandler(productController.getAllDraftProducts));

// get all published products
router.get('/published', asyncHandler(productController.getAllPublishedProducts));

module.exports = router;
