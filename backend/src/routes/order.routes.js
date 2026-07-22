import { Router } from "express";
import { jwtVerifier } from "../middleware/jwt.middleware.js";
import { createOrder, getAllOrders, getOrders, updateOrderStatus, getOrderById, cancelMyOrder } from "../controllers/order.controller.js";
import { adminCheck } from "../middleware/admin.middleware.js";

const orderRouter = Router()

orderRouter.use(jwtVerifier)

orderRouter.route('/create').post(createOrder)

orderRouter.route('/get-orders').get(getOrders)

// Admin-specific routes
orderRouter.route('/get-all-orders').get(adminCheck, getAllOrders)
orderRouter.route('/update-status/:orderId').patch(adminCheck, updateOrderStatus)

// User/Admin detail and cancellation routes
orderRouter.route('/:orderId').get(getOrderById)
orderRouter.route('/cancel/:orderId').patch(cancelMyOrder)

export {orderRouter}