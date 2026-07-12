import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import { jwtVerifier } from "../middleware/jwt.middleware";

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

export { userRouter }