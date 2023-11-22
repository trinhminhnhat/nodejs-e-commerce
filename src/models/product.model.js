const { model, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify');

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
        productSlug: String,
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
            enum: ['Electronic', 'Clothing', 'Furniture'],
        },
        productShop: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
        productAttributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        productRatings: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        productVariations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

// create index for search
productSchema.index({ productName: 'text', productDescription: 'text' });

// document middleware: run before .save() and .create(), ...
productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, { lower: true });
    next();
});

const clothingSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        productShop: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
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
        productShop: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        timestamps: true,
        collection: 'Electronics',
    },
);

const furnitureSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
        productShop: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
    },
    {
        timestamps: true,
        collection: 'Furniture',
    },
);

// Export the model
module.exports = {
    productSchema: model(DOCUMENT_NAME, productSchema),
    clothingSchema: model('Clothing', clothingSchema),
    electronicSchema: model('Electronic', electronicSchema),
    furnitureSchema: model('Furniture', furnitureSchema),
};
