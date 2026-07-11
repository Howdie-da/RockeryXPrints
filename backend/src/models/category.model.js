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

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        default: null
    },

    totalSalesCount: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    }
}, {timestamps: true})

export const Category = mongoose.model("Category", categorySchema)