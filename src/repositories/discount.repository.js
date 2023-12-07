'use strict';

const discountSchema = require('../models/discount.model');
const { getSelectData, getUnSelectData } = require('../utils');

const getAllDiscountCodesSelect = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await discountSchema.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const getAllDiscountCodesUnselect = async ({ limit, sort, page, filter, unSelect }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await discountSchema
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean();
};

const findDiscount = async (filter = {}) => {
    return await discountSchema.findOne(filter).lean();
};

module.exports = {
    getAllDiscountCodesSelect,
    getAllDiscountCodesUnselect,
    findDiscount,
};
