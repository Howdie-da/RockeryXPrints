import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },

    mrp: {
        type: Number,
        required: true,
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    searchTags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    images: [{
        type: String,
        validate: {
            validator: function(v) { return v && v.length > 0; },
            message: 'A product must have at least one image upload.'
        }
    }],

    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    deliveryDays: {
        type: Number,
        default: 2
    },

    rating: {
        type: Number,
        min: 0,
        max: 5
    },

    salesCount: {
        type: Number,
        default: 0,
        index: true
    }
}, {timestamps: true})

productSchema.index({ name: 'text', description: 'text', searchTags: 'text' });

export const Product = mongoose.model("Product", productSchema)