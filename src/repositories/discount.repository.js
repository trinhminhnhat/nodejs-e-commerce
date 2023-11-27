'use strict';

const { Types } = require('mongoose');

const discountSchema = require('../models/discount.model');
const { getSelectData, getUnSelectData } = require('../utils');

const findAllDiscountCodesSelect = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await discountSchema.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
};

const findAllDiscountCodesUnselect = async ({ limit, sort, page, filter, unSelect }) => {
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

module.exports = {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnselect,
};
