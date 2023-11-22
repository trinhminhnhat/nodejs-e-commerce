'use strict';

const { Types } = require('mongoose');
const { productSchema } = require('../models/product.model');

const getAllDraftProducts = async ({ query, limit, skip }) => {
    return await productQuery({ query, limit, skip });
};

const getAllPublishedProducts = async ({ query, limit, skip }) => {
    return await productQuery({ query, limit, skip });
};

const publishProductByShop = async ({ productShop, productId }) => {
    const product = await productSchema.findOne({
        productShop: new Types.ObjectId(productShop),
        _id: new Types.ObjectId(productId),
    });

    if (!product) return null;

    product.isDraft = false;
    product.isPublished = true;

    return await product.save();
};

const unPublishProductByShop = async ({ productShop, productId }) => {
    const product = await productSchema.findOne({
        productShop: new Types.ObjectId(productShop),
        _id: new Types.ObjectId(productId),
    });

    if (!product) return null;

    product.isDraft = true;
    product.isPublished = false;

    return await product.save();
};

const searchProductsByKeyword = async ({ keyword }) => {
    const regexSearch = new RegExp(keyword);

    return await productSchema
        .find(
            {
                isPublished: true,
                $text: { $search: regexSearch },
            },
            { score: { $meta: 'textScore' } },
        )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
};

const productQuery = async ({ query, limit, skip }) => {
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
    publishProductByShop,
    getAllPublishedProducts,
    unPublishProductByShop,
    searchProductsByKeyword,
};
