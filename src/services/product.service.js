'use strict';

const { BadRequestError } = require('../core/error.response');
const { productSchema, clothingSchema, electronicSchema, furnitureSchema } = require('../models/product.model');
const {
    getAllDraftProducts,
    publishProductByShop,
    getAllPublishedProducts,
    unPublishProductByShop,
    searchProductsByKeyword,
    getAllProducts,
    findProduct,
    updateProductByIdWithShop,
} = require('../repositories/product.repository');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

// define Factory class to create product
class ProductFactory {
    static productRegistry = {}; // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];

        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).createProduct();
    }

    static async updateProduct({ type, productId, productShop, payload }) {
        const productClass = ProductFactory.productRegistry[type];

        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).updateProduct({ productId, productShop });
    }

    static async getAllDraftProducts({ productShop, limit = 50, skip = 0 }) {
        const query = { productShop, isDraft: true };

        return await getAllDraftProducts({ query, limit, skip });
    }

    static async getAllPublishedProducts({ productShop, limit = 50, skip = 0 }) {
        console.log('productShop: ', productShop);
        const query = { productShop, isPublished: true };

        return await getAllPublishedProducts({ query, limit, skip });
    }

    static async publishProductByShop({ productShop, productId }) {
        return await publishProductByShop({ productShop, productId });
    }

    static async unPublishProductByShop({ productShop, productId }) {
        return await unPublishProductByShop({ productShop, productId });
    }

    static async searchProductsByKeyword({ keyword }) {
        return await searchProductsByKeyword({ keyword });
    }

    static async getAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await getAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['productName', 'productPrice', 'productThumb'],
        });
    }

    static async findProduct({ productId }) {
        return await findProduct({ productId, unSelect: ['__v'] });
    }
}

// define base product class
class Product {
    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productShop,
        productAttributes,
        productVariations,
    }) {
        this.productName = productName;
        this.productThumb = productThumb;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productShop = productShop;
        this.productAttributes = productAttributes;
        this.productVariations = productVariations;
    }

    async createProduct(productId) {
        return await productSchema.create({ ...this, _id: productId });
    }

    async updateProduct({ productId, productShop, payload }) {
        return await updateProductByIdWithShop({ productId, productShop, payload, model: productSchema });
    }
}

// Define sub-class for different product type Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingSchema.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newClothing) throw new BadRequestError('Error create new clothing');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Error create new product');

        return newProduct;
    }

    async updateProduct({ productId, productShop }) {
        const objectParams = removeUndefinedObject(this);

        if (objectParams.productAttributes) {
            await updateProductByIdWithShop({
                productId,
                productShop,
                payload: updateNestedObjectParser(objectParams.productAttributes),
                model: clothingSchema,
            });
        }

        return await super.updateProduct({ productId, productShop, payload: updateNestedObjectParser(objectParams) });
    }
}

// Define sub-class for different product type Clothing
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicSchema.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newElectronic) throw new BadRequestError('Error create new electronic');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Error create new product');

        return newProduct;
    }

    async updateProduct({ productId, productShop }) {
        const objectParams = removeUndefinedObject(this);

        if (objectParams.productAttributes) {
            await updateProductByIdWithShop({
                productId,
                productShop,
                payload: updateNestedObjectParser(objectParams.productAttributes),
                model: electronicSchema,
            });
        }

        return await super.updateProduct({ productId, productShop, payload: updateNestedObjectParser(objectParams) });
    }
}

// Define sub-class for different product type Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furnitureSchema.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if (!newFurniture) throw new BadRequestError('Error create new furniture');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Error create new product');

        return newProduct;
    }

    async updateProduct({ productId, productShop }) {
        const objectParams = removeUndefinedObject(this);

        if (objectParams.productAttributes) {
            await updateProductByIdWithShop({
                productId,
                productShop,
                payload: updateNestedObjectParser(objectParams.productAttributes),
                model: furnitureSchema,
            });
        }

        return await super.updateProduct({ productId, productShop, payload: updateNestedObjectParser(objectParams) });
    }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
