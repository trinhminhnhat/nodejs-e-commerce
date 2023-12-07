'use strict';

const { Created, Ok } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
    /**
     * Create new discount code
     * @param {String} name - name of discount code
     * @param {String} description - description of discount code
     * @param {String} type - type of discount code (fixed_amount, percentage)
     * @param {Number} value - value of discount code
     * @param {String} code - code of discount code
     * @param {Date} startDate - start date of discount code
     * @param {Date} endDate - end date of discount code
     * @param {Number} maxUses - max uses of discount code
     * @param {Number} usesCount - uses count of discount code
     * @param {Array} usersUsed - users used of discount code
     * @param {Number} maxUsesPerUser - max uses per user of discount code
     * @param {Number} minOrderValue - min order value of discount code
     * @param {Boolean} isActive - is active of discount code
     * @param {String} appliesTo - applies to of discount code (all, specificProducts)
     * @param {Array} productIds - product ids of discount code
     * @return {JSON}
     */
    create = async (req, res) => {
        new Created({
            message: 'Create new discount code successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * Get products by discount code
     * @param {String} code - code of discount
     * @param {String} shopId - id of shop
     */
    getProductsByDiscountCode = async (req, res) => {
        new Ok({
            message: 'Get products by discount code successfully',
            metadata: await DiscountService.getProductsByDiscountCode({
                ...req.query,
            }),
        }).send(res);
    };

    /**
     * Get discount codes by shop
     * @param {Number} limit
     * @param {Number} page
     */
    getDiscountCodesByShop = async (req, res) => {
        new Ok({
            message: 'Get discounts by shop successfully',
            metadata: await DiscountService.getDiscountCodesByShop({
                shopId: req.user.userId,
                limit: req.query.limit,
                page: req.query.page,
            }),
        }).send(res);
    };

    /**
     * Get discount amount
     * @param {String} code - code of discount
     * @param {String} userId - id of user
     * @param {String} shopId - id of shop
     * @param {Array} products - list of products
     * @return {JSON}
     */
    getDiscountAmount = async (req, res) => {
        new Ok({
            message: 'Get discount amount successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };

    /**
     * Delete discount code
     * @param {String} code - code of discount
     * @return {JSON}
     */
    delete = async (req, res) => {
        new Ok({
            message: 'Delete discount code successfully',
            metadata: await DiscountService.deleteDiscountCode({
                code: req.body.code,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * Cancel discount code
     * @param {String} code - code of discount
     * @return {JSON}
     */
    cancel = async (req, res) => {
        new Ok({
            message: 'Cancel discount code successfully',
            metadata: await DiscountService.cancelDiscountCode({
                code: req.body.code,
                shopId: req.user.userId,
                userId: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
