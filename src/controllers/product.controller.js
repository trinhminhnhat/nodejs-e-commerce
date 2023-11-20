'use strict';

const { Created, Ok } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    /**
     * Create new product
     * @param {String} productName - name of product
     * @param {String} productThumb - url of product's thumbnail
     * @param {String} productDescription - description of product
     * @param {Number} productPrice - price of product
     * @param {Number} productQuantity - quantity of product
     * @param {String} productType - type of product
     * @param {Array} productAttributes - attributes of product
     * @param {Number} productRatings - ratings of product
     * @param {Array} productVariations - variations of product
     * @return {JSON}
     */
    create = async (req, res) => {
        new Created({
            message: 'Create new product successfully',
            metadata: await ProductService.createProduct(req.body.productType, {
                ...req.body,
                productShop: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * Get all draft products of shop
     * @param {Number} productShop - id of shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftProducts = async (req, res) => {
        new Ok({
            message: 'Get all draft products successfully',
            metadata: await ProductService.getAllDraftProducts({
                productShop: req.user.userId,
                limit: req.query.limit,
                skip: req.query.skip,
            }),
        }).send(res);
    };
}

module.exports = new ProductController();
