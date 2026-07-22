import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import crypto from "crypto"

const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country || !shippingAddress.phone) {
        throw new ApiError(400, "Complete shipping address is required")
    }

    const user = await User.findById(req.user._id).populate("cart.product")

    if (!user.cart || user.cart.length === 0) {
        throw new ApiError(400, "Your cart is empty")
    }

    let totalMRP = 0
    let totalSellingPrice = 0
    const orderItems = []

    for (const item of user.cart) {
        const product = item.product
        
        if (product.stock < item.quantity) {
            throw new ApiError(400, `Product "${product.name}" does not have enough stock`)
        }

        // Deduct inventory stock and increment salesCount
        product.stock -= item.quantity
        product.salesCount = (product.salesCount || 0) + item.quantity
        await product.save({ validateBeforeSave: false })

        totalMRP += product.mrp * item.quantity
        totalSellingPrice += product.sellingPrice * item.quantity

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images[0],
            quantity: item.quantity,
            priceAtPurchase: product.sellingPrice
        })
    }
    const shippingFee = paymentMethod !== "cod" ? 0 : 50 
    
    const tax = Math.round(totalSellingPrice * 0.18) 
    
    const finalTotal = totalSellingPrice + tax + shippingFee

    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`

    const order = await Order.create({
        user: req.user._id,
        orderId,
        orderItems,
        totalMRP,
        totalSellingPrice,
        tax,
        shippingFee,
        finalTotal,
        shippingAddress,
        paymentMethod: paymentMethod || "Online",
        paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid"
    })

    user.cart = []
    await user.save({ validateBeforeSave: false })

    return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully. Ready for payment processing."))
})

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })

    if (!orders) {
        throw new ApiError(404, "No orders found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order history fetched successfully"))
})

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("user", "fullName email")
        .sort({ createdAt: -1 })

    let totalRevenue = 0
    orders.forEach(order => {
        if (order.paymentStatus === "Paid") {
            totalRevenue += order.finalTotal
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            totalOrders: orders.length,
            totalRevenue,
            orders
        }, "All orders fetched successfully")
    )
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "You have already delivered this order")
    }

    // Handle inventory restock if order was cancelled
    if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product)
            if (product) {
                product.stock += item.quantity
                product.salesCount = Math.max(0, (product.salesCount || 0) - item.quantity)
                await product.save({ validateBeforeSave: false })
            }
        }
    } else if (order.orderStatus === "Cancelled" && status !== "Cancelled") {
        // Re-deduct inventory if changing status from Cancelled to something else
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product)
            if (product) {
                if (product.stock < item.quantity) {
                    throw new ApiError(400, `Cannot update order status. Product "${product.name}" does not have enough stock`)
                }
                product.stock -= item.quantity
                product.salesCount = (product.salesCount || 0) + item.quantity
                await product.save({ validateBeforeSave: false })
            }
        }
    }

    order.orderStatus = status

    if (status === "Delivered") {
        order.deliveredAt = Date.now()
        if (order.paymentMethod === "cod") {
            order.paymentStatus = "Paid"
        }
    }

    await order.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200, order, `Order status updated to ${status}`))
})

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate("user", "fullName email avatar")

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    const ownerIdStr = order.user?._id ? order.user._id.toString() : order.user?.toString();
    const reqUserIdStr = req.user?._id ? req.user._id.toString() : '';

    console.log("Order owner:", ownerIdStr);
    console.log("Request user ID:", reqUserIdStr);
    console.log("Request user role:", req.user?.role);
    console.log("Is owner match:", ownerIdStr === reqUserIdStr);
    console.log("Is admin:", req.user?.role === 'admin');

    if (ownerIdStr !== reqUserIdStr && req.user?.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to view this order")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order details fetched successfully"))
})

const cancelMyOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this order")
    }

    if (order.orderStatus !== "Processing") {
        throw new ApiError(400, "Only orders in 'Processing' status can be cancelled")
    }

    // Restock inventory stock and update salesCount
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product)
        if (product) {
            product.stock += item.quantity
            product.salesCount = Math.max(0, (product.salesCount || 0) - item.quantity)
            await product.save({ validateBeforeSave: false })
        }
    }

    order.orderStatus = "Cancelled"
    await order.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order cancelled successfully"))
})

export { createOrder, getOrders, getAllOrders, updateOrderStatus, getOrderById, cancelMyOrder }