'use strict';

const { convertToObjectIdMongoDb } = require('../utils');
const discountSchema = require('../models/discount.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { getAllProducts } = require('../repositories/product.repository');
const { findAllDiscountCodesUnselect } = require('../repositories/discount.repository');

class DiscountService {
    static createDiscountCode = async (payload) => {
        const {
            shopId,
            name,
            description,
            type,
            value,
            code,
            startDate,
            endDate,
            maxUses,
            usesCount,
            usersUsed,
            maxUsesPerUser,
            minOrderValue,
            isActive,
            appliesTo,
            productIds,
        } = payload;

        // validate
        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired');
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date');
        }

        const discount = discountSchema.findOne({ code, shopId: convertToObjectIdMongoDb(shopId) }).lean();

        if (discount && discount.isActive) {
            throw new BadRequestError('Discount code already exists');
        }

        const newDiscount = await discountSchema.create({
            shopId,
            name,
            description,
            type,
            value,
            code,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxUses,
            usesCount,
            usersUsed,
            maxUsesPerUser,
            minOrderValue,
            isActive,
            appliesTo,
            productIds: appliesTo === 'all' ? [] : productIds,
        });

        return newDiscount;
    };

    static updateDiscountCode = async (payload) => {};

    static getProductsByDiscountCode = async ({ code, shopId, limit, page }) => {
        const discount = discountSchema.findOne({ code, shopId: convertToObjectIdMongoDb(shopId) }).lean();

        if (!discount || !discount.isActive) {
            throw new NotFoundError('Discount code not found');
        }

        const { appliesTo, productIds } = discount;
        let products;

        if (appliesTo === 'all') {
            products = await getAllProducts({
                limit,
                page,
                filter: {
                    shopId: convertToObjectIdMongoDb(shopId),
                    isPublished: true,
                },
                select: ['productName', 'productPrice', 'productThumb'],
            });
        } else if (appliesTo === 'specificProducts') {
            products = await getAllProducts({
                limit,
                page,
                filter: {
                    _id: { $in: productIds },
                    isPublished: true,
                },
                select: ['productName', 'productPrice', 'productThumb'],
            });
        }

        return products;
    };

    static getDiscountCodeByShop = async ({ shopId, limit, page }) => {
        return await findAllDiscountCodesUnselect({
            limit,
            page,
            filter: { shopId: convertToObjectIdMongoDb(shopId), isActive: true },
            unSelect: ['__v', 'shopId'],
        });
    };
}

module.exports = DiscountService;
