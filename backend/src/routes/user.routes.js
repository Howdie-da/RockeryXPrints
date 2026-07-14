import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addToCart, changePassword, getCurrentUser, getUserCart, loginUser, logoutUser, refreshAccessToken, registerUser, removeFromCart, updateAccountDetails, updateAvatar } from "../controllers/user.controller.js";
import { jwtVerifier } from "../middleware/jwt.middleware.js";

const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route('/login').post(loginUser)

userRouter.use(jwtVerifier)

userRouter.route('/logout').get(logoutUser)

userRouter.route('/change-password').post(changePassword)

userRouter.route('/refresh-token').post(refreshAccessToken)

userRouter.route('/current-user').get(getCurrentUser)

userRouter.route('/update-details').post(updateAccountDetails)

userRouter.route('/update-avatar').post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }]),
    updateAvatar
)

userRouter.route('/cart').get(getUserCart)

userRouter.route('/add-cart').post(addToCart)

userRouter.route('/remove-cart/:productId').delete(removeFromCart)

export { userRouter }