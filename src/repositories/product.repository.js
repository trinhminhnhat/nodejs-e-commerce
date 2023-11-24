'use strict';

const { Types } = require('mongoose');

const { productSchema } = require('../models/product.model');
const { getSelectData, getUnSelectData } = require('../utils');

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

const getAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await productSchema.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const findProduct = async ({ productId, unSelect }) => {
    return await productSchema.findById(productId).select(getUnSelectData(unSelect)).lean();
};

const updateProductByIdWithShop = async ({ productId, productShop, payload, model, isNew = true }) => {
    return await model.findOneAndUpdate(
        {
            _id: new Types.ObjectId(productId),
            productShop: new Types.ObjectId(productShop),
        },
        payload,
        { new: isNew },
    );
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
    getAllProducts,
    findProduct,
    updateProductByIdWithShop,
};
