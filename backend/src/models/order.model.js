import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    orderItems: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product",
            required: true 
        },
        name: { 
            type: String, 
            required: true
        },
        quantity: { 
            type: Number, 
            required: true,
            min: 1 
        },
        priceAtPurchase: { 
            type: Number, 
            required: true
        }
    }],

    totalMRP: {
        type: Number,
        required: true
    },
    totalSellingPrice: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    finalTotal: {
        type: Number,
        required: true
    },

    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: Number, required: true },
        country: { type: String, required: true }
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },
    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Processing"
    },
    transactionID: {
        type: String,
        default: ""
    },

    deliveredAt: {
        type: Date
    }
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)