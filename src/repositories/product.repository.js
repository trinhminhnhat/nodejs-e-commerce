'use strict';

const { productSchema } = require('../models/product.model');

const getAllDraftProducts = async ({ query, limit, skip }) => {
    return await productSchema
        .find(query)
        .populate('productShop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

module.exports = {
    getAllDraftProducts,
};
