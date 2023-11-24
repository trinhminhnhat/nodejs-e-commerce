'use strict';

const express = require('express');

const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// search products by keyword
router.get('/search/:keyword', asyncHandler(productController.searchByKeyword));

// get all products
router.get('/', asyncHandler(productController.getAllProducts));

// find a product by id
router.get('/:id/detail', asyncHandler(productController.findProduct));

// Authentication
router.use(authentication);

// create a product
router.post('/', asyncHandler(productController.create));

// get all draft products
router.get('/drafts', asyncHandler(productController.getAllDraftProducts));

// get all published products
router.get('/published', asyncHandler(productController.getAllPublishedProducts));

// update a product
router.patch('/:id', asyncHandler(productController.update));

// publish a product
router.patch('/:id/publish', asyncHandler(productController.publishProductByShop));

// un publish a product
router.patch('/:id/un-publish', asyncHandler(productController.unPublishProductByShop));

module.exports = router;
