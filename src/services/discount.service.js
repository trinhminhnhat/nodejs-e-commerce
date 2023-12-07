'use strict';

const { convertToObjectIdMongoDb } = require('../utils');
const discountSchema = require('../models/discount.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { getAllProducts } = require('../repositories/product.repository');
const { getAllDiscountCodesUnselect, findDiscount } = require('../repositories/discount.repository');

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
        if (new Date() > new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired');
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date');
        }

        const discount = await findDiscount({ code, shopId: convertToObjectIdMongoDb(shopId) });

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

    // Todo: update discount code
    static updateDiscountCode = async (payload) => {};

    static getProductsByDiscountCode = async ({ code, shopId, limit = 50, page = 1 }) => {
        const discount = await findDiscount({ code, shopId: convertToObjectIdMongoDb(shopId) });

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
                    productShop: convertToObjectIdMongoDb(shopId),
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

    static getDiscountCodesByShop = async ({ shopId, limit, page }) => {
        return await getAllDiscountCodesUnselect({
            limit,
            page,
            filter: { shopId: convertToObjectIdMongoDb(shopId), isActive: true },
            unSelect: ['__v', 'shopId'],
        });
    };

    static getDiscountAmount = async ({ code, shopId, products, userId }) => {
        console.log('shopId: ', shopId);
        console.log('code: ', code);
        const discount = await findDiscount({ code, shopId: convertToObjectIdMongoDb(shopId) });

        if (!discount || !discount.isActive) {
            throw new NotFoundError('Discount code not found');
        }

        const { type, value, usersUsed, maxUsesPerUser, minOrderValue, maxUses, startDate, endDate } = discount;

        if (!maxUses) throw new BadRequestError('Discount code are out');

        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired');
        }

        let totalOrder = 0;
        if (minOrderValue > 0) {
            totalOrder = products.reduce((total, product) => {
                // Todo: find product.productId
                return total + product.quantity * product.productPrice;
            }, 0);

            if (totalOrder < minOrderValue) {
                throw new BadRequestError('Discount code requires minimum order value');
            }
        }

        if (maxUsesPerUser > 0) {
            const userUsedDiscount = usersUsed.find((user) => user.userId === userId);

            if (userUsedDiscount && userUsedDiscount.count >= maxUsesPerUser) {
                throw new BadRequestError('Discount code has reached its usage limit');
            }
        }

        const amount = type === 'fixed_amount' ? value : (totalOrder * value) / 100;

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    };

    static deleteDiscountCode = async ({ shopId, code }) => {
        const discount = await findDiscount({ code, shopId: convertToObjectIdMongoDb(shopId) });

        if (!discount) {
            throw new NotFoundError('Discount code not found');
        }

        return await discountSchema.deleteOne({ _id: discount._id });
    };

    static cancelDiscountCode = async ({ shopId, code, userId }) => {
        const discount = await findDiscount({ code, shopId: convertToObjectIdMongoDb(shopId) });

        if (!discount || !discount.isActive) {
            throw new NotFoundError('Discount code not found');
        }

        return await discountSchema.findByIdAndUpdate(discount._id, {
            $pull: { usersUsed: { userId } },
            $inc: {
                maxUses: 1,
                usesCount: -1,
            },
        });
    };
}

module.exports = DiscountService;
