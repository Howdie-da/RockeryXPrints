import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { changePassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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

export { userRouter }