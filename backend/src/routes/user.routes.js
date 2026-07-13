import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { changePassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar } from "../controllers/user.controller.js";
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

userRouter.route('/logout').get(jwtVerifier, logoutUser)

userRouter.route('/change-password').post(jwtVerifier, changePassword)

userRouter.route('/refresh-token').post(jwtVerifier, refreshAccessToken)

userRouter.route('/current-user').get(jwtVerifier, getCurrentUser)

userRouter.route('/update-details').post(jwtVerifier, updateAccountDetails)

userRouter.route('/update-avatar').post(jwtVerifier,
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }]),
    updateAvatar)

export { userRouter }