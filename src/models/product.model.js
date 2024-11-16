const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productThumb: {
            type: String,
            required: true,
        },
        productDescription: String,
        productPrice: {
            type: Number,
            required: true,
        },
        productQuantity: {
            type: Number,
            required: true,
        },
        productType: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Furniture'],
        },
        productShop: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
        productAttributes: {
            type: Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

const clothingSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: 'Clothing',
    },
);

const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
    },
    {
        timestamps: true,
        collection: 'Electronics',
    },
);

// Export the model
module.exports = {
    productSchema: model(DOCUMENT_NAME, productSchema),
    clothingSchema: model('Clothing', clothingSchema),
    electronicSchema: model('Electronic', electronicSchema),
};
