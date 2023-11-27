const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        shopId: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: 'fixed_amount', // percentage
        },
        value: {
            // 10000 VND || 10%
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        maxUses: {
            type: Number,
            required: true,
        },
        usesCount: {
            type: Number,
            required: true,
        },
        usersUsed: {
            type: Array,
            default: [],
        },
        maxUsesPerUser: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            required: true,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        appliesTo: {
            type: String,
            required: true,
            enum: ['all', 'specificProducts'],
        },
        productIds: {
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
module.exports = model(DOCUMENT_NAME, discountSchema);
