'use strict';

const inventorySchema = require('../models/inventory.model');

const createInventory = async ({ productId, shopId, stock, location = 'HCM' }) => {
    return await inventorySchema.create({ productId, shopId, stock, location });
};

module.exports = {
    createInventory,
};
