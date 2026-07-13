import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    coverPhoto: {
        type: String,
        required: true
    },

    productCount: {
        type: Number,
        default: 0
    },

    totalSalesCount: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    }
}, {timestamps: true})

export const Category = mongoose.model("Category", categorySchema)