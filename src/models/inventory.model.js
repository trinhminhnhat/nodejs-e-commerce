const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
    {
        productId: {
            type: Types.ObjectId,
            ref: 'Product',
        },
        shopId: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
        stock: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            default: 'HCM',
        },
        reservation: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

// Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
