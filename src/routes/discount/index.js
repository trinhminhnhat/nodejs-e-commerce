'use strict';

const express = require('express');

const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// get products by discount code
router.get('/products', asyncHandler(discountController.getProductsByDiscountCode));

// get discount amount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));

// Authentication
router.use(authentication);

// create a discount code
router.post('/', asyncHandler(discountController.create));

// get discounts code by shop
router.get('/', asyncHandler(discountController.getDiscountCodesByShop));

// delete a discount code
router.delete('/', asyncHandler(discountController.delete));

// cancel a discount code
router.post('/cancel', asyncHandler(discountController.cancel));

module.exports = router;
