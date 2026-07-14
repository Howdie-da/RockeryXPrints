import { Router } from "express";
import { jwtVerifier } from "../middleware/jwt.middleware.js";
import { createOrder, getAllOrders, getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { adminCheck } from "../middleware/admin.middleware.js";

const orderRouter = Router()

orderRouter.use(jwtVerifier)

orderRouter.route('/create').post(createOrder)

orderRouter.route('/get-orders').get(getOrders)

orderRouter.use(adminCheck)

orderRouter.route('/get-all-orders').get(getAllOrders)

orderRouter.route('/update-status/:orderId').patch(updateOrderStatus)

export {orderRouter}